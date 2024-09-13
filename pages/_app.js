import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"
import Layout from '../components/Layout'
import { getConfig } from '../config/privateLabel'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const config = getConfig(typeof window !== 'undefined' ? window.location.hostname : '');

  return (
    <SessionProvider session={session}>
      <Layout config={config}>
        <Component {...pageProps} config={config} />
      </Layout>
    </SessionProvider>
  )
}

export default MyApp