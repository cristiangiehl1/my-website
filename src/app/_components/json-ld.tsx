interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        // `<` escaped so a value can never close the script tag
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          ...data,
        }).replace(/</g, '\\u003c'),
      }}
    />
  )
}
