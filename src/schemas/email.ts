import { z } from 'zod'

export const sendEmailSchema = z
  .object({
    to: z.string().email().or(z.array(z.string().email())),
    subject: z.string().min(1).max(200),
    html: z.string().optional(),
    text: z.string().optional(),
    from: z.string().email().optional().default('contact@cristiangiehl.com.br'),
  })
  .refine((data) => data.html || data.text, {
    message: 'É necessário fornecer ao menos html ou text',
  })

export type SendEmailData = z.infer<typeof sendEmailSchema>
