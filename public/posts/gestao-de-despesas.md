## Sobre o Projeto

**Gestão de Despesas** é um sistema **interno** de uma empresa do setor varejista, criado para controlar as **despesas de compras não revenda** — tudo o que a empresa compra para operar (serviços, materiais, manutenção, marketing, TI…) e que **não** vai para a prateleira. Cada nota fiscal percorre um fluxo de aprovação por papéis e, ao final, é integrada de volta ao **ERP corporativo**.

> ⚠️ **Projeto interno, sem link público.** Por se tratar de um sistema corporativo que lida com dados fiscais e financeiros reais da empresa, **não há URL pública nem repositório no GitHub disponível**. Este post descreve a **arquitetura, as regras de negócio, as integrações e as principais dificuldades** do projeto de forma anonimizada — sem expor dados sensíveis, endereços internos, nomes de sistemas proprietários ou credenciais.

O sistema é, na prática, **dois componentes** que formam um pipeline único:

- Um **worker de ingestão** (Node.js/TypeScript) que observa pastas de rede, extrai os dados das notas fiscais e as insere na base.
- Uma **aplicação web** (Next.js 15) onde as notas são validadas, aprovadas por múltiplos níveis e integradas ao ERP.

## O Problema

Antes do sistema, as despesas de compras não revenda chegavam de forma **dispersa** — notas fiscais em XML, PDF ou até imagens, enviadas por e-mail ou depositadas em pastas compartilhadas por cada área de custo (controladoria, marketing, RH, TI, manutenção, suprimentos). A partir daí, o processo era manual e frágil:

- **Sem rastreabilidade:** não havia registro de quem aprovou o quê, quando e por qual valor.
- **Sem alçada consistente:** aprovações fora do limite de responsabilidade de cada gestor passavam despercebidas.
- **Digitação manual no ERP:** alguém relia a nota e redigitava os dados no ERP — lento e sujeito a erro.
- **Complexidade fiscal:** cálculos como o **DIFAL** (diferencial de alíquota de ICMS em compras interestaduais) dependiam de consulta manual e cálculo à parte.

O objetivo do sistema é **fechar esse ciclo de ponta a ponta**: capturar a nota automaticamente, extrair e validar seus dados, conduzi-la por um fluxo de aprovação auditável com alçadas, e **integrá-la ao ERP sem redigitação**.

## Arquitetura

O sistema separa claramente a **ingestão** (produção de dados a partir de documentos) da **operação** (aprovação e integração), com o OracleDB como ponto de encontro entre os dois mundos.

```
                    ┌───────────────────────────────────────────┐
  Pastas de rede →  │  WORKER DE INGESTÃO (Node.js / TypeScript) │
  (XML/PDF/imagem)  │                                            │
                    │  chokidar (watch)                          │
                    │      ↓                                     │
                    │  hash SHA-256 → idempotência               │
                    │      ↓                                     │
                    │  ┌─────────────┐   ┌──────────────────┐    │
                    │  │ XmlExtractor│   │ LlmExtractor      │    │
                    │  │ (NF-e/NFS-e)│   │ (PDF/imagem, LLM) │    │
                    │  └─────────────┘   └──────────────────┘    │
                    │      ↓                                     │
                    │  Validação fiscal → score de confiança     │
                    └───────────────────┬───────────────────────┘
                                        │ insert (cabeçalho + itens,
                                        │ mesma transação)
                                        ▼
                    ┌───────────────────────────────────────────┐
                    │          OracleDB  (notas + itens          │
                    │          + auditoria + cadastros)          │
                    └───────────────────┬───────────────────────┘
                                        │
                                        ▼
                    ┌───────────────────────────────────────────┐
  Navegador     →   │  APLICAÇÃO WEB (Next.js 15 App Router)     │
  (comprador,       │                                            │
   aprovador,       │  Server Actions → Repository → Database    │
   controladoria,   │      ↓                                     │
   fiscal, admin)   │  Máquina de estados de aprovação           │
                    │      ↓                                     │
                    │  node-cron (jobs)   BullMQ + Redis (filas) │
                    └───────────────────┬───────────────────────┘
                                        │ fila de integração
                                        ▼
                                 ERP corporativo (API)
```

### Aplicação web

Construída em **Next.js 15 (App Router)** com **React 19**, priorizando **Server Components + Server Actions** — o caminho típico de uma mutação é **Server Action → Repository → Database (OracleDB)**. As camadas são bem isoladas:

- **Actions** — Server Actions agrupadas por domínio (notas, compradores, aprovadores, fornecedores, usuários). Toda ação sensível passa por um _wrapper_ de segurança que injeta o usuário autenticado e **exige os papéis permitidos**; formulários são validados com **Zod**.
- **Repository** — acesso a dados, um módulo por agregado. O SQL fica em arquivos `.sql.ts` co-localizados, e cada repositório recebe uma instância de `Database` no construtor.
- **Database** — uma classe que encapsula o **pool de conexões OracleDB**. É possível passar uma conexão existente para rodar várias instruções em uma **única transação**.
- **Rotas por papel** — o dashboard é agrupado por perfil (admin, aprovador, comprador, controladoria, financeiro, fiscal, gestor); um middleware protege cada rota conforme os papéis permitidos.

### Worker de ingestão

Um serviço Node.js/TypeScript separado, com **arquitetura hexagonal** (domínio, aplicação, infraestrutura, portas). Ele observa as pastas de entrada em tempo real e transforma documentos brutos em registros estruturados e validados na base — detalhado na próxima seção.

## Pipeline de Ingestão

Cada área de custo tem uma pasta de entrada monitorada. Quando um arquivo aparece, o worker executa:

1. **Detecção** — o `chokidar` detecta o novo arquivo na pasta de entrada.
2. **Idempotência** — calcula o **SHA-256** do arquivo e checa na base se ele já foi processado; duplicatas são descartadas sem reprocessar.
3. **Extração** — dois caminhos conforme o tipo:
   - **XML** → parsing estruturado direto (NF-e modelo 55 e NFS-e ABRASF).
   - **PDF / imagem** → **LLM com saída estruturada** (schema Zod), cobrindo NF-e, NFS-e, notas de comunicação, boletos, faturas, notas de débito e recibos. Campos críticos do cabeçalho recebem _double-check_ automático, e a concorrência de chamadas ao LLM é limitada.
   - **Itens/produtos** são extraídos no mesmo passo (código, descrição, NCM, CFOP, quantidade, valores, ICMS, IPI…).
4. **Validação fiscal** — um motor de validação confere **CNPJ (mód-11)**, **chave de acesso da NF-e**, coerência de valores e datas. Cada falha aplica penalidade e reduz o **score de confiança** do documento.
5. **Enriquecimento** — resolve fornecedor, tipo e loja na base; detecta e corrige inversão de CNPJs (emitente × destinatário).
6. **Persistência** — insere **cabeçalho + itens na mesma transação** (rollback atômico se qualquer parte falhar) e registra a auditoria.
7. **Roteamento do arquivo** — conforme o resultado, o arquivo é movido para `Arquivos Lidos`, `Revisão` (score abaixo do limiar) ou `Falhas`, sempre organizado por `ano/mês`.

O limiar de _auto-insert_ sem revisão humana é **0,70**. Abaixo disso, a nota vai para uma fila de revisão em vez de entrar direto no fluxo.

## Regras de Negócio

O coração do sistema é a **máquina de estados** que rege a vida de cada nota fiscal.

### Fluxo de aprovação

Uma nota recém-ingerida entra como **não processada**. Um job tenta **vinculá-la automaticamente** ao fornecedor, à natureza de despesa e ao aprovador responsável, usando as associações cadastradas. A partir daí:

- Se os dados estão incompletos ou inválidos, a nota vai para a **controladoria** corrigir (ex.: fornecedor desconhecido, natureza desconhecida, detalhes inválidos).
- Se estão completos, segue para **validação do comprador** e depois para o **aprovador**.
- Aprovada, vai para o **fiscal**, responsável por sincronizar com o ERP.
- Sincronizada com sucesso, atinge o estado terminal.

Estados terminais e de integração **não reentram** no fluxo de aprovação — uma invariante importante para evitar reprocessamento indevido.

### Alçada por valor e escalonamento

Cada aprovador tem um **valor máximo** que pode aprovar. Se o valor da nota **excede** esse limite, ela é **automaticamente transferida** para o aprovador superior definido na hierarquia. Isso garante que gastos altos sempre passem por um nível de alçada compatível, sem depender de disciplina manual.

### Férias e aprovador substituto

Se um aprovador está **de férias** (com período configurado), as notas destinadas a ele são **redirecionadas automaticamente** para o aprovador substituto. A resolução do "aprovador efetivo" acontece no momento do roteamento, mantendo o fluxo sempre com um responsável ativo.

### Cálculo de DIFAL

Em compras **interestaduais**, incide o **diferencial de alíquota de ICMS (DIFAL)** — a diferença entre a alíquota interestadual (destacada pelo fornecedor) e a alíquota interna do estado de destino para aquele **NCM**. O sistema separa três grupos de dados por item:

- **Extraídos** pelo LLM/XML (valores, alíquota interestadual…).
- **Enriquecidos** pelo fiscal (a alíquota **interna** do estado de destino, que varia por NCM/decreto e não é confiável extrair automaticamente).
- **Calculados** pela aplicação, no momento em que a alíquota interna é preenchida:

```
VALOR_DIFAL = VALOR_TOTAL × (aliq_interna − aliq_interestadual) / (100 − aliq_interna)
```

O cálculo é **"por dentro"** (base incluída), conforme a LC 190/2022. Exemplos de percentuais efetivos: `12→17% ≈ 6,03%`, `4→17% ≈ 15,66%`, `4→12% ≈ 9,09%`.

### Auditoria

Toda ação relevante sobre uma nota (aprovar, reprovar, transferir, comentar, atualizar) é registrada em uma **trilha de auditoria** com autor e timestamp, permitindo reconstruir o histórico completo de cada despesa.

## Integrações

- **Autenticação no ERP corporativo** — o login não usa base de usuários local: um provedor de autenticação customizado (Next-Auth v5, sessão JWT) valida as credenciais contra o **ERP corporativo**. Os papéis do usuário vêm dessa integração e determinam o que ele enxerga e pode fazer.
- **Integração de saída (fila)** — quando uma nota é aprovada, ela entra em uma **fila de integração** (BullMQ + Redis) que a envia para a **API do ERP**, com _retries_ e status de acompanhamento (`aguardando`, `integrando`, `integrada`, `falha`). Isolar a integração em uma fila evita travar a UI e absorve instabilidades do ERP.
- **Conversão NFe → PDF** — um **serviço lateral (sidecar) em PHP**, em container próprio, converte o XML da NF-e em PDF para visualização, mantendo essa dependência específica fora do processo principal.

## Principais Dificuldades

- **Extração confiável de documentos heterogêneos.** XML é estruturado, mas PDFs e imagens não. Usar um LLM com **saída estruturada + score de confiança + limiar de revisão** foi o que permitiu automatizar sem abrir mão do controle: o que o modelo não tem certeza vai para revisão humana, em vez de entrar errado na base.
- **Distinção entre `null` e `"0.00"`.** Um campo **não impresso** na nota (`null`) é semanticamente diferente de um valor **destacado como zero** (isento/não incidente). Preservar essa diferença é essencial para o tratamento fiscal correto.
- **Transação atômica cabeçalho + itens.** Uma nota sem seus itens (ou vice-versa) é um estado inválido. Inserir os dois na **mesma transação**, com rollback automático, garante consistência mesmo sob falha parcial.
- **A nuance fiscal do DIFAL.** A alíquota interna varia por NCM e por decreto estadual — algo que **não dá para automatizar com segurança**. A solução foi um desenho híbrido: automatizar o que é seguro (extração, cálculo) e deixar explícito o ponto que exige o especialista fiscal (alíquota interna), inclusive com um índice de "itens aguardando revisão fiscal".
- **Idempotência.** Um mesmo arquivo pode reaparecer na pasta. O **hash SHA-256** com verificação prévia garante que reprocessar nunca gere duplicatas.
- **Processos em background.** Jobs agendados (**node-cron**) processam notas pendentes a cada poucos minutos, promovem lançamentos futuros que venceram e notificam aprovadores; workers **BullMQ/Redis** cuidam da integração e dos e-mails. Todos precisam de _graceful shutdown_ e rodar apenas no runtime Node — não na edge.

## Tecnologias Utilizadas

### Aplicação web

- **Next.js 15** (App Router) + **React 19** + **TypeScript** — Server Components e Server Actions.
- **Tailwind CSS** + componentes acessíveis (Radix/shadcn) — interface responsiva.
- **Next-Auth v5** — autenticação integrada ao ERP corporativo (sessão JWT).
- **Zod** — validação de schemas em todas as entradas.

### Worker de ingestão

- **Node.js / TypeScript** — arquitetura hexagonal (domínio, aplicação, infraestrutura).
- **LLM com saída estruturada** — extração de PDFs e imagens; **fast-xml-parser** para XML.
- **chokidar** — observação das pastas de entrada em tempo real.

### Dados, filas e infraestrutura

- **OracleDB** — base transacional e cadastral (pool de conexões, binds parametrizados).
- **Redis + BullMQ** — filas assíncronas (integração e e-mail).
- **node-cron** — tarefas agendadas.
- **Docker** — empacotamento de todos os serviços (web, worker e o sidecar PHP).

## Notas Técnicas

- **Separação ingestão × operação.** Manter o worker de ingestão como serviço próprio permite escalá-lo e implantá-lo independentemente da web app; o OracleDB é o contrato entre os dois.
- **Segurança por papel na borda da ação.** Em vez de espalhar checagens de permissão pela UI, cada Server Action é embrulhada por um _wrapper_ que valida papel e injeta o usuário autenticado — a autorização mora em um único lugar.
- **SQL co-localizado e parametrizado.** As queries ficam em arquivos próprios por agregado e sempre usam _binds_, mitigando injeção de SQL.
- **Anonimização.** Nomes de empresa, sistemas proprietários, endereços de rede, schema do banco e URLs internas foram deliberadamente omitidos deste post — o foco é a engenharia, não os dados corporativos.
