'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Send } from 'lucide-react'
import type { HTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { type ContactFormData, contactSchema } from '@/schemas/contact'

import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Textarea } from '../../ui/textarea'

export function ContactForm() {
  // hooks
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      subject: '',
      email: '',
      phone: '',
      message: '',
    },
  })

  const phoneField = register('phone')

  async function onSubmit(data: ContactFormData) {
    try {
      const res = await fetch('/api/emails/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      const body = await res.json()

      if (!res.ok) {
        return toast.error(body.message ?? 'Erro inesperado. Tente novamente.')
      }

      toast.success(body.message)
      reset()
    } catch (err) {
      if (err instanceof Error) {
        return toast.error(err.message)
      }

      toast.error(
        'Erro inesperado. Tente novamente ou entre em contato diretamente pelo WhatsApp.'
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
        <div className='flex flex-col gap-2'>
          <Label
            htmlFor='name'
            className='text-foreground/80 text-sm font-medium'>
            Nome
          </Label>
          <Input
            id='name'
            placeholder='Seu nome'
            className='border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-12 rounded-lg transition-colors'
            {...register('name')}
          />
          {errors.name && <ErrorMsg msg={errors.name.message} />}
        </div>
        <div className='flex flex-col gap-2'>
          <Label
            htmlFor='email'
            className='text-foreground/80 text-sm font-medium'>
            E-mail
          </Label>
          <Input
            id='email'
            type='email'
            placeholder='seu@email.com'
            className='border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-12 rounded-lg transition-colors'
            {...register('email')}
          />
          {errors.email && <ErrorMsg msg={errors.email.message} />}
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <Label
          htmlFor='subject'
          className='text-foreground/80 text-sm font-medium'>
          Assunto
        </Label>
        <Input
          id='subject'
          placeholder='Assunto da mensagem'
          className='border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-12 rounded-lg transition-colors'
          {...register('subject')}
        />
        {errors.subject && <ErrorMsg msg={errors.subject.message} />}
      </div>

      <div className='flex flex-col gap-2'>
        <Label
          htmlFor='phone'
          className='text-foreground/80 text-sm font-medium'>
          Telefone{' '}
          <span className='text-muted-foreground font-normal'>(opcional)</span>
        </Label>
        <Input
          id='phone'
          type='tel'
          inputMode='tel'
          placeholder='(00) 00000-0000'
          maxLength={16}
          className='border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-12 rounded-lg transition-colors'
          {...phoneField}
          onChange={(e) => {
            e.target.value = maskPhone(e.target.value)
            phoneField.onChange(e)
          }}
        />
        {errors.phone && <ErrorMsg msg={errors.phone.message} />}
      </div>

      <div className='flex flex-col gap-2'>
        <Label
          htmlFor='message'
          className='text-foreground/80 text-sm font-medium'>
          Mensagem
        </Label>
        <Textarea
          id='message'
          placeholder='Escreva sua mensagem aqui...'
          rows={10}
          className='border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 resize-none rounded-lg transition-colors'
          {...register('message')}
        />
        {errors.message && <ErrorMsg msg={errors.message.message} />}
      </div>

      <Button
        type='submit'
        disabled={isSubmitting}
        className='bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-lg text-base font-semibold transition-all disabled:opacity-70'>
        {isSubmitting ? (
          <>
            <Loader2 className='mr-2 h-5 w-5 animate-spin' />
            Enviando...
          </>
        ) : (
          <>
            <Send className='mr-2 h-5 w-5' />
            Enviar mensagem
          </>
        )}
      </Button>
    </form>
  )
}

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function ErrorMsg({
  msg,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { msg?: string }) {
  if (!msg) return null

  return (
    <p className={cn('text-destructive mt-1 text-xs', className)} {...props}>
      {msg}
    </p>
  )
}
