import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownContentProps {
  content: string
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className='text-foreground border-border mt-10 mb-6 border-b pb-3 text-3xl font-bold tracking-tight'>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className='text-foreground border-border/50 mt-10 mb-4 border-b pb-2 text-2xl font-semibold tracking-tight'>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className='text-foreground mt-6 mb-3 text-xl font-semibold'>
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className='text-foreground mt-4 mb-2 text-lg font-medium'>
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className='text-foreground/85 mb-5 leading-7'>{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className='text-primary decoration-primary/40 hover:decoration-primary underline underline-offset-4 transition-colors'
      target='_blank'
      rel='noopener noreferrer'>
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className='text-foreground font-semibold'>{children}</strong>
  ),
  em: ({ children }) => (
    <em className='text-foreground/80 italic'>{children}</em>
  ),
  ul: ({ children }) => (
    <ul className='text-foreground/85 mb-5 ml-6 list-disc space-y-2'>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className='text-foreground/85 mb-5 ml-6 list-decimal space-y-2'>
      {children}
    </ol>
  ),
  li: ({ children }) => <li className='leading-7'>{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className='border-primary/60 bg-primary/5 text-foreground/80 my-6 rounded-r-lg border-l-4 py-3 pl-5 italic [&>p]:mb-0'>
      {children}
    </blockquote>
  ),
  code: ({ className, children }) => {
    const isBlock = className?.includes('language-')
    if (isBlock) {
      return (
        <code className='text-foreground/90 block font-mono text-sm leading-6'>
          {children}
        </code>
      )
    }
    return (
      <code className='bg-muted text-secondary rounded-md px-1.5 py-0.5 font-mono text-sm'>
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className='bg-muted/80 border-border mb-5 overflow-x-auto rounded-lg border p-4'>
      {children}
    </pre>
  ),
  hr: () => <hr className='border-border my-8' />,
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || '/placeholder.svg'}
      alt={alt ?? ''}
      className='border-border my-6 max-w-full rounded-lg border'
    />
  ),
  table: ({ children }) => (
    <div className='mb-5 overflow-x-auto'>
      <table className='w-full border-collapse text-sm'>{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className='border-border border-b-2'>{children}</thead>
  ),
  th: ({ children }) => (
    <th className='text-foreground bg-muted/50 p-3 text-left font-semibold'>
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className='border-border text-foreground/85 border-b p-3'>
      {children}
    </td>
  ),
  input: (props) => {
    if (props.type === 'checkbox') {
      return (
        <input
          type='checkbox'
          checked={props.checked}
          readOnly
          className='accent-primary mr-2'
        />
      )
    }
    return <input {...props} />
  },
  del: ({ children }) => (
    <del className='text-muted-foreground line-through'>{children}</del>
  ),
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <article className='prose-blog max-w-none'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </article>
  )
}
