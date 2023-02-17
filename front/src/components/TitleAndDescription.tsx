import Head from 'next/head'

export function TitleAndDescription({
  title,
  description,
}: {
  title?: string
  description?: string
}) {
  const titleBase = 'Assemblee Simplifiee'
  const finalTitle = title ? `${title} | ${titleBase}` : titleBase
  const descriptionBase = `Site d'information et de vulgarisation sur les députés et l'Assemblée nationale.`
  return (
    <Head>
      <title>{finalTitle}</title>
      <meta name="description" content={description ?? descriptionBase} />
    </Head>
  )
}
