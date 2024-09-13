import '../styles/globals.css'
import { useState, useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import { auth } from '../lib/firebase'
import { getConfig } from '../config/privateLabel'
import { useRemoteConfig } from '../hooks/useRemoteConfig'

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null)
  const { config: remoteConfig, loading, error } = useRemoteConfig();
  const config = getConfig(typeof window !== 'undefined' ? window.location.hostname : '');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} config={config} user={user} remoteConfig={remoteConfig} />
    </SessionProvider>
  );
}

export default MyApp