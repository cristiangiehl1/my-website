import { z } from 'zod'

type T = (key: string) => string

export function makeContactSchema(t: T) {
  return z.object({
    name: z.string().min(1, t('validation.name')),
    email: z.email(t('validation.emailInvalid')),
    phone: z
      .string()
      .refine((val) => val === '' || /^\(\d{2}\) \d{4,5}-\d{4}$/.test(val), {
        message: t('validation.phoneFormat'),
      })
      .optional()
      .or(z.literal('')),
    subject: z
      .string()
      .nonempty(t('validation.subjectRequired'))
      .max(256, t('validation.subjectMax')),
    message: z
      .string()
      .min(1, t('validation.messageRequired'))
      .refine((val) => !/<script[\s\S]*?>[\s\S]*?<\/script>/i.test(val), {
        message: t('validation.scriptInjection'),
      }),
  })
}

// Stable type derived from a schema built with an identity translator
export type ContactFormData = z.infer<ReturnType<typeof makeContactSchema>>
