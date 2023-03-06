import fs from 'fs'
import { GetStaticPaths, GetStaticProps } from 'next'
import * as circoDpt from './circonscription/departement/[nom_departement]'
import * as comPerm from './commissions-permanentes/[legislature]'
import * as deputeFiche from './depute/[slug]'
import * as deputesList from './deputes/[legislature]'
import * as histoRemplacements from './historique-remplacements/[legislature]'
import { notNull } from '../lib/utils'
const Sitemap = () => null

export default Sitemap

const fixedPaths = [
  '/',
  '/a-propos',
  '/groupes',
  '/doc/commissions-permanentes',
  // '/circonscription',
  '/commissions-permanentes',
  '/deputes',
  '/historique-remplacements',
]

async function generateDynamicPathsForPage<Params extends {}>(
  getStaticPaths: GetStaticPaths<Params>,
  buildUrl: (_: Params) => string,
): Promise<string[]> {
  return (await getStaticPaths({})).paths
    .map(path => {
      if (typeof path !== 'string') {
        return buildUrl(path.params)
      }
      return null
    })
    .filter(notNull)
}

async function generateDynamicPaths() {
  return [
    // ...(await generateDynamicPathsForPage(
    //   circoDpt.getStaticPaths,
    //   _ => `/circonscription/departement/${_.nom_departement}`,
    // )),
    ...(await generateDynamicPathsForPage(
      comPerm.getStaticPaths,
      _ => `/commissions-permanentes/${_.legislature}`,
    )),
    ...(await generateDynamicPathsForPage(
      deputeFiche.getStaticPaths,
      _ => `/depute/${_.slug}`,
    )),
    ...(await generateDynamicPathsForPage(
      deputesList.getStaticPaths,
      _ => `/deputes/${_.legislature}`,
    )),
    ...(await generateDynamicPathsForPage(
      histoRemplacements.getStaticPaths,
      _ => `/historique-remplacements/${_.legislature}`,
    )),
  ]
}

// Dummy page used to create the sitemap.xml file
// "next build" will call this function and will create the file
export const getStaticProps: GetStaticProps = async () => {
  const allPaths = [...fixedPaths, ...(await generateDynamicPaths())]
  const links = allPaths.map(url => ({ url, priority: 1 }))
  const sitemapXml = await createSiteMap(
    links,
    'https://www.assembleesimplifiee.com',
  )
  // we manually create the file.
  fs.writeFileSync('./public/sitemap.xml', sitemapXml)
  return { props: {} }
}

async function createSiteMap(
  links: { url: string; priority: number }[],
  hostname: string,
): Promise<string> {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n'
  const urlSetOpen =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  const urlSetClose = '</urlset>\n'
  function buildUrlTag(url: string, priority: number) {
    return `<url>
  <loc>${url}</loc>
  <priority>${priority.toFixed(1)}</priority>
</url>\n`
  }

  const urls = links
    .map(link => buildUrlTag(`${hostname}${link.url}`, link.priority))
    .join('')
  return xmlHeader + urlSetOpen + urls + urlSetClose
}
