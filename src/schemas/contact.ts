import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1, 'Informe seu nome'),
  email: z.email('Informe um formato de e-mail válido'),
  subject: z
    .string()
    .nonempty('Por favor, preenche o assunto da sua mensagem')
    .max(256, 'O assunto não pode ultrapassar 256 caracteres'),
  message: z
    .string()
    .min(1, 'Por favor, preencha a mensagem que deseja enviar')
    .refine((val) => !/<script[\s\S]*?>[\s\S]*?<\/script>/i.test(val), {
      message: 'Script injection detectado',
    }),
})

export type ContactFormData = z.infer<typeof contactSchema>
