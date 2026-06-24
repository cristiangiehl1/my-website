import { type CreateEmailOptions, Resend } from 'resend'

const from = 'contact@cristiangiehl.com.br'
export const contactReceivedObj = {
  from,
  to: ['cristiangiehl@gmail.com'],
  subject: 'Meu Portfólio - Nova Mensagem',
}

export function initClient() {
  try {
    return new Resend(process.env.RESEND_API_KEY)
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function sendEmail({
  to,
  subject,
  template,
}: {
  to: string
  subject: string
  template: React.ReactNode
}) {
  try {
    const resend = initClient()

    return await resend.emails.send({
      from,
      to,
      subject,
      react: template,
    })
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function sendHtmlEmail({
  to,
  subject,
  html,
  text,
  from,
}: {
  to: string[]
  subject: string
  html?: string
  text?: string
  from?: string
}) {
  const resend = initClient()

  return await resend.emails.send({
    from: from ?? 'contact@cristiangiehl.com.br',
    to,
    subject,
    html,
    text,
  } as CreateEmailOptions)
}
