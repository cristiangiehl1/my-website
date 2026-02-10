import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface ContactReceivedProps {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactReceived({
  name = 'Visitante',
  email = 'email@exemplo.com',
  subject = 'Mensagem de contato',
  message = 'Mensagem enviada pelo formulário...',
}: ContactReceivedProps) {
  return (
    <Html>
      <Head />
      <Preview>📩 Nova mensagem de contato — {name}</Preview>

      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            <Heading style={logo}>Portfolio</Heading>
          </Section>

          {/* Content */}
          <Section style={contentSection}>
            <Heading style={heading}>Nova mensagem recebida</Heading>

            <Text style={paragraph}>
              Você recebeu uma nova mensagem através do formulário de contato do
              site.
            </Text>

            <Hr style={divider} />

            {/* Sender info */}
            <Section style={infoSection}>
              <Text style={infoItem}>
                <strong>Nome:</strong> {name}
              </Text>
              <Text style={infoItem}>
                <strong>Email:</strong> {email}
              </Text>
              <Text style={infoItem}>
                <strong>Assunto:</strong> {subject}
              </Text>
            </Section>

            <Hr style={divider} />

            {/* Message */}
            <Section>
              <Text style={summaryLabel}>Mensagem</Text>
              <Section style={messageBox}>
                <Text style={messageText}>{message}</Text>
              </Section>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              Este e-mail foi enviado automaticamente pelo formulário de contato
              do site.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

/* Styles */

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
  textAlign: 'center',
  borderBottom: '1px solid #1e1e22',
}

const logo: React.CSSProperties = {
  color: '#a78bfa',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0',
}

const contentSection: React.CSSProperties = {
  padding: '40px',
}

const heading: React.CSSProperties = {
  color: '#f5f5f7',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 16px 0',
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

const infoSection: React.CSSProperties = {
  margin: '0',
}

const infoItem: React.CSSProperties = {
  color: '#d4d4d8',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 8px 0',
}

const summaryLabel: React.CSSProperties = {
  color: '#e4e4e7',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 12px 0',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

const messageBox: React.CSSProperties = {
  backgroundColor: '#16161a',
  borderRadius: '8px',
  padding: '20px',
  border: '1px solid #1e1e22',
}

const messageText: React.CSSProperties = {
  color: '#a1a1aa',
  fontSize: '14px',
  lineHeight: '1.7',
  margin: '0',
  whiteSpace: 'pre-wrap',
}

const footerSection: React.CSSProperties = {
  backgroundColor: '#0a0a0b',
  padding: '24px 40px',
  borderTop: '1px solid #1e1e22',
  textAlign: 'center',
}

const footerText: React.CSSProperties = {
  color: '#52525b',
  fontSize: '12px',
  margin: '0',
}
