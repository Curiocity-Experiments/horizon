import '../styles/globals.css'
import { useState, useEffect } from 'react'
import { auth } from '../lib/firebase'
import Layout from '../components/Layout'
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Layout config={config} user={user}>
      <Component {...pageProps} config={config} user={user} remoteConfig={remoteConfig} />
    </Layout>
  )
}

export default MyApp