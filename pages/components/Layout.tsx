import { ReactNode } from 'react'
import Head from 'next/head'
import { GlobalTheme } from '@carbon/react'
import '../../styles/Layout.module.scss'

interface Props {
  children: ReactNode
}
export default function Layout({ children }: Props) {
  return (
    <GlobalTheme theme="g100">
      <Head>
        <title>live[code]</title>
        <meta name="description" content="Online code editing environment based onmonaco editor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
    </GlobalTheme>
  )
}
