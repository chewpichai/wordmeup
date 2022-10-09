import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Nav } from 'components'
import { userService } from 'services'
import 'styles/globals.css'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // on initial load - run auth check 
    authCheck(router.asPath)

    // on route change start - hide page content by setting authorized to false  
    const hideContent = () => setAuthorized(false)
    router.events.on('routeChangeStart', hideContent)

    // on route change complete - run auth check 
    router.events.on('routeChangeComplete', authCheck)

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent)
      router.events.off('routeChangeComplete', authCheck)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    $('.navbar-collapse.collapse').removeClass('show')
  }, [authorized])

  function authCheck(url) {
    const publicPaths = ['/']
    const path = url.split('?')[0]
    const isAdmin = path.startsWith('/admin')
    if (!userService.userValue && !publicPaths.includes(path)) {
      setAuthorized(false)
      router.push({
        pathname: '/',
        query: { returnUrl: router.asPath }
      })
    } else if (!userService.userValue?.isAdmin && isAdmin) {
      setAuthorized(false)
      router.push({ pathname: '/main' })
    } else {
      setAuthorized(true)
    }
  }

  return (
    <>
    <Head>
      <title>WORD ME UP</title>
    </Head>

    <div className="app">
      <Nav />
      <div className="container">
        {authorized && <Component {...pageProps} />}
      </div>
      <footer className="text-center p-2 mt-4">&copy;2022</footer>
    </div>
    </>
  )
}

export default MyApp
