import { sendEmailSchema } from '@/schemas/email'
import { sendHtmlEmail } from '@/services/email'

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.EMAIL_SERVICE_API_KEY}`) {
    return Response.json(
      { message: 'Não autorizado' },
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const body = await req.json()
  const parsed = sendEmailSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json(
      { message: parsed.error.issues[0].message },
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { to, subject, html, text, from } = parsed.data
  const toArray = Array.isArray(to) ? to : [to]

  try {
    const { error } = await sendHtmlEmail({
      to: toArray,
      subject,
      html,
      text,
      from,
    })

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
