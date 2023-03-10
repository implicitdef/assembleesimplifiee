import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Script from 'next/script'
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
    >
      {label ?? to}
      {wip ? <span className="text-amber-700"> (WIP)</span> : null}
    </MyLink>
  )
}

const LOGO_TEXT = 'Assemblee Simplifiee.com'

function Logo() {
  return (
    <MyLink
      href={'/'}
      className={`block bg-black py-2 px-4 text-right uppercase `}
      textColorClassOverride="text-white"
      underline={false}
    >
      <p className=" text-2xl font-bold leading-none ">ASSEMBLEE</p>
      <p className=" text-2xl font-bold leading-none ">SIMPLIFIEE.COM</p>
    </MyLink>
  )
}

function LogoMobile() {
  return (
    <MyLink
      href={'/'}
      underline={false}
      className={`mx-4 flex items-center justify-center `}
      textColorClassOverride="text-white"
    >
      <p className="text-lg font-bold sm:text-xl">ASSEMBLEE SIMPLIFIEE.COM</p>{' '}
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
    <div
      className={` border-b-2 border-dotted border-slate-800 first:border-b-0 last:border-b-0  ${classname}`}
    >
      {children}
    </div>
  )
}

function SideMenu({ mobileMenuFolded }: { mobileMenuFolded: boolean }) {
  return (
    <nav
      className={`fixed z-20 flex min-h-full w-screen flex-col border-r border-black bg-white text-left lg:static lg:w-[250px] lg:text-left ${
        mobileMenuFolded ? 'hidden lg:block' : ''
      }`}
    >
      <Division classname="hidden lg:block mx-0">
        <Logo />
      </Division>
      <Division classname="mx-2">
        <MenuLink to="/deputes" label="Tous les d??put??s" />
        <MenuLink to="/circonscription" label="D??put??s par circonscription" />
        <MenuLink
          to="/commissions-permanentes"
          label="D??put??s par commission permanente"
        />
        <MenuLink
          to="/historique-remplacements"
          label="Historique des d??parts et remplacements"
        />
      </Division>
      <Division classname="mx-2">
        <MenuLink to="/groupes" label="C'est quoi les groupes ?" />

        <MenuLink
          to="/doc/commissions-permanentes"
          label="C'est quoi les commissions permanentes ?"
        />
      </Division>
      <Division classname="mx-1">
        <MenuLink to="/a-propos" label="?? propos" />
      </Division>
      {/* <Division>
        <MenuLink to="/long" label="Page avec beaucoup de contenu" smaller />
        <MenuLink to="/short" label="Page avec tr??s peu de contenu" smaller />
      </Division> */}
    </nav>
  )
}

function MobileTopBar({ toggleMobileMenu }: { toggleMobileMenu: () => void }) {
  return (
    <div className="fixed z-20 flex h-11 w-full justify-between bg-black text-white lg:hidden">
      <button
        className="my-2 flex w-fit items-center justify-center border-r border-white p-2 text-white "
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
    <div className="grow px-1">
      <main className="z-0 mx-auto flex h-full w-full flex-col pt-2  pb-6 sm:w-[640px] md:w-[768px] xl:w-[1030px] 2xl:w-[1286px]">
        {children}
      </main>
    </div>
  )
}

function MatomoScript() {
  return (
    <Script id="matomo">
      {`var _paq = window._paq = window._paq || [];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function() {
      var u="https://assembleesimplifiee.matomo.cloud/";
      _paq.push(['setTrackerUrl', u+'matomo.php']);
      _paq.push(['setSiteId', '1']);
      var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      g.async=true; g.src='//cdn.matomo.cloud/assembleesimplifiee.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
    })();`}
    </Script>
  )
}

function DevModeMarker() {
  if (process.env.NODE_ENV === 'development') {
    // Run development-only code here
    return (
      <div className="absolute top-0 left-20 z-50 bg-lime-400 p-1 font-bold text-black lg:left-2">
        DEV
      </div>
    )
  }
  return null
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
      <MatomoScript />
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DevModeMarker />
      <div
        className="flex min-h-screen flex-col bg-white
      "
      >
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
