import type { AppProps } from 'next/app'
import '../styles/globals.scss'
import Layout from './components/Layout'
import { store } from '../lib/store'
import { Provider } from 'react-redux'
import { SessionProvider } from "next-auth/react"

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <Provider store={store}>
      <Layout>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </Layout>
    </Provider>
  )
}

export default MyApp
