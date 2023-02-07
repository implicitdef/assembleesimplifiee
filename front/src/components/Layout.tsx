import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { MyLink } from './MyLink'

type Props = {
  children: ReactNode
}

function MenuLink({
  to,
  label,
  className,
  wip = false,
  smaller = false,
}: {
  to: string
  label?: string
  className?: string
  wip?: boolean
  smaller?: boolean
}) {
  return (
    <MyLink
      href={to}
      className={`block py-4 text-lg ${smaller ? 'text-sm' : ''} ${className}`}
      textColorClassOverride=" text-slate-900"
    >
      {label ?? to}
      {wip ? <span className="text-amber-700"> (WIP)</span> : null}
    </MyLink>
  )
}

const LOGO_TEXT = 'AssembleeSimplifiee.com'

function Logo() {
  return (
    <MyLink href={'/'} className={`block items-center  py-2`}>
      <p className=" text-lg font-bold text-slate-900">{LOGO_TEXT}</p>{' '}
    </MyLink>
  )
}

function LogoMobile() {
  return (
    <MyLink href={'/'} className={`flex items-center justify-center px-2`}>
      <p className="text-xl font-bold text-slate-900 ">{LOGO_TEXT}</p>{' '}
    </MyLink>
  )
}

function Division({
  classname,
  children,
}: {
  classname?: string
  children: ReactNode
}) {
  return (
    <div className={`mx-4  border-slate-800 last:border-b-0 ${classname}`}>
      {children}
    </div>
  )
}

function SideMenu({ mobileMenuFolded }: { mobileMenuFolded: boolean }) {
  return (
    <nav
      className={`fixed z-50 flex min-h-full w-screen flex-col border-r border-slate-800 bg-slate-300 text-center  lg:static lg:w-[250px] ${
        mobileMenuFolded ? 'hidden lg:block' : ''
      }`}
    >
      <Division classname="hidden lg:block mx-0">
        <Logo />
      </Division>
      <Division>
        <MenuLink to="/deputes" label="Liste des députés" />
        <MenuLink to="/circonscription" label="Les circonscriptions" />
        <MenuLink
          to="/commissions-permanentes"
          label="Les commissions permanentes"
        />
        <MenuLink
          to="/historique-remplacements"
          label="Historique des départs et remplacements"
        />
      </Division>
      <Division>
        <MenuLink to="/a-propos" label="À propos" />
      </Division>
      {/* <Division>
        <MenuLink to="/seances" label="Les séances en hémicycle" wip />
        <MenuLink to="/sessions" label="Les sessions parlementaires" wip />
        <MenuLink to="/dossiers" label="Les dossiers législatifs" wip />
        <MenuLink to="/scrutins" label="Les scrutins" wip />
      </Division> */}
      {/* <Division>
        <MenuLink to="/long" label="Page avec beaucoup de contenu" smaller />
        <MenuLink to="/short" label="Page avec très peu de contenu" smaller />
      </Division> */}
    </nav>
  )
}

function MobileTopBar({ toggleMobileMenu }: { toggleMobileMenu: () => void }) {
  return (
    <div className="fixed z-50 flex h-11 w-full border-b-2 border-dashed border-slate-400 bg-slate-300 lg:hidden">
      <button
        className="m-1  rounded  bg-slate-600 px-1 text-slate-300"
        onClick={toggleMobileMenu}
      >
        menu
      </button>
      <LogoMobile />
    </div>
  )
}

function RestOfPage({ children }: Props) {
  return (
    <div className="grow">
      <main className="z-0 mx-auto flex h-full w-full flex-col pt-2  pb-6 sm:w-[640px] md:w-[768px] xl:w-[1030px] 2xl:w-[1286px]">
        {children}
      </main>
    </div>
  )
}

export function Layout({ children }: Props) {
  const [mobileMenuFolded, setMobileMenuFolded] = useState(true)
  const router = useRouter()
  useEffect(() => {
    // fold menu when changing routes
    const handleRouteChange = () => {
      setMobileMenuFolded(true)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])

  return (
    <>
      <Head>
        <title>
          AssembleeSimplifiee.com : site d'information et de vulgarisation sur
          le fonctionnement de l'Assemblée Nationale
        </title>
        {/* TODO il faudra repasser sur les métas, balises pour SEO, partage twitter, etc.
         */}
        {/* favicon commenté pour le moment car il m'embrouille dans mes onglets */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <div className="flex min-h-screen flex-col bg-slate-300 text-slate-700">
        <MobileTopBar
          toggleMobileMenu={() => {
            setMobileMenuFolded(v => !v)
          }}
        />
        <div className="mt-11 flex grow lg:mt-0">
          <SideMenu {...{ mobileMenuFolded }} />
          <RestOfPage {...{ children }} />
        </div>
      </div>
    </>
  )
}
