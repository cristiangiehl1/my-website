import ContactConfirmation from '@/emails/contact-confirmation'
import ContactReceived from '@/emails/contact-received'
import { makeContactSchema } from '@/schemas/contact'
import { contactReceivedObj, initClient } from '@/services/email'

const contactSchema = makeContactSchema((k) => k)

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json(
      { message: 'Corpo da requisição inválido' },
      { status: 400 }
    )
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { message: 'Dados inválidos', issues: parsed.error.issues },
      { status: 400 }
    )
  }
  const { email, message, name, phone, subject } = parsed.data

  const resend = initClient()

  try {
    const { error } = await resend.batch.send([
      {
        ...contactReceivedObj,
        react: ContactReceived({
          email,
          message,
          name,
          phone,
          subject,
        }),
      },
      {
        from: 'contact@cristiangiehl.com.br',
        to: [email],
        subject: `Mensagem automática: sua mensagem foi recebida 🎇`,
        react: ContactConfirmation({
          name,
          message,
          subject,
        }),
      },
    ])

    if (error) {
      return Response.json(
        { message: error.message },
        {
          status: error.statusCode ?? 503,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    return Response.json(
      { message: 'E-mail enviado com sucesso' },
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error(err)

    return Response.json(
      {
        message: 'Aconteceu um erro inesperado ao utilizar o serviço de e-mail',
      },
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
