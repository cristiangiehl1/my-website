import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

import { __CONTACT__ } from '@/constants/contact'

interface ContactConfirmationProps {
  name: string
  subject: string
  message: string
}

export default function ContactConfirmation({
  name = 'Visitante',
  subject = 'Mensagem de contato',
  message = 'Sua mensagem aqui...',
}: ContactConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Recebi sua mensagem - Obrigado pelo contato, {name}!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            <Heading style={logo}>Portfolio</Heading>
          </Section>

          {/* Main Content */}
          <Section style={contentSection}>
            <Heading style={heading}>Mensagem recebida com sucesso!</Heading>

            <Text style={greetingText}>
              Ola, <strong>{name}</strong>!
            </Text>

            <Text style={paragraph}>
              Obrigado por entrar em contato. Recebi sua mensagem e vou
              responde-la o mais breve possivel, geralmente em ate{' '}
              <strong>24 horas</strong>.
            </Text>

            <Hr style={divider} />

            {/* Message Summary */}
            <Section style={summarySection}>
              <Text style={summaryLabel}>Resumo da sua mensagem</Text>

              <Section style={summaryBox}>
                <Text style={summaryField}>
                  <strong>Assunto:</strong> {subject}
                </Text>
                <Text style={summaryField}>
                  <strong>Mensagem:</strong>
                </Text>
                <Text style={summaryMessage}>{message}</Text>
              </Section>
            </Section>

            <Hr style={divider} />

            {/* CTA */}
            <Text style={paragraph}>
              Enquanto isso, voce também pode me contactar diretamente pelo
              WhatsApp para assuntos urgentes:
            </Text>

            <Section style={buttonContainer}>
              <Link href={__CONTACT__.whatsapp.href} style={whatsappButton}>
                Falar no WhatsApp
              </Link>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              Este é um e-mail automático de confirmação. Por favor, não
              responda diretamente a este e-mail.
            </Text>
            <Text style={footerLinks}>
              <Link href={__CONTACT__.github.href} style={footerLink}>
                GitHub
              </Link>
              {' | '}
              <Link href={__CONTACT__.linkedin.href} style={footerLink}>
                LinkedIn
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main: React.CSSProperties = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}

const container: React.CSSProperties = {
  maxWidth: '580px',
  margin: '0 auto',
  backgroundColor: '#111113',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid #1e1e22',
}

const headerSection: React.CSSProperties = {
  backgroundColor: '#16161a',
  padding: '32px 40px',
  textAlign: 'center' as const,
  borderBottom: '1px solid #1e1e22',
}

const logo: React.CSSProperties = {
  color: '#a78bfa',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0',
  letterSpacing: '-0.5px',
}

const contentSection: React.CSSProperties = {
  padding: '40px',
}

const heading: React.CSSProperties = {
  color: '#f5f5f7',
  fontSize: '22px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '0 0 24px 0',
}

const greetingText: React.CSSProperties = {
  color: '#e4e4e7',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 8px 0',
}

const paragraph: React.CSSProperties = {
  color: '#a1a1aa',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0 0 16px 0',
}

const divider: React.CSSProperties = {
  borderTop: '1px solid #1e1e22',
  margin: '24px 0',
}

const summarySection: React.CSSProperties = {
  margin: '0',
}

const summaryLabel: React.CSSProperties = {
  color: '#e4e4e7',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 12px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}

const summaryBox: React.CSSProperties = {
  backgroundColor: '#16161a',
  borderRadius: '8px',
  padding: '20px',
  border: '1px solid #1e1e22',
}

const summaryField: React.CSSProperties = {
  color: '#d4d4d8',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 8px 0',
}

const summaryMessage: React.CSSProperties = {
  color: '#a1a1aa',
  fontSize: '14px',
  lineHeight: '1.7',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
}

const buttonContainer: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '24px 0 8px 0',
}

const whatsappButton: React.CSSProperties = {
  backgroundColor: '#25D366',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '14px 32px',
  borderRadius: '8px',
  display: 'inline-block',
}

const footerSection: React.CSSProperties = {
  backgroundColor: '#0a0a0b',
  padding: '24px 40px',
  borderTop: '1px solid #1e1e22',
  textAlign: 'center' as const,
}

const footerText: React.CSSProperties = {
  color: '#52525b',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0 0 8px 0',
}

const footerLinks: React.CSSProperties = {
  color: '#52525b',
  fontSize: '12px',
  margin: '0',
}

const footerLink: React.CSSProperties = {
  color: '#a78bfa',
  textDecoration: 'none',
}
