import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.scss'
import { useSession, signIn, signOut } from "next-auth/react"

const Home: NextPage = () => {
  const { data: session } = useSession()
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>
        Welcome to <span className={styles.logo}>live<b>[code]</b></span>
      </h1>

      <p className={styles.description}>
        Online code editing environment based on
        <code className={styles.code}>monaco editor</code>
      </p>

      <div className={styles.grid}>
        <Link href='/api/new'>
          <a className={styles.card}>
            <h2>Start coding &rarr;</h2>
            <p>Using editor that powers Visual Studio Code</p>
          </a>
        </Link>

        {
          session != null ? (
            <Link href='/profile'>
              <a className={styles.card}>
                <h2>View your gists &rarr;</h2>
                <p>Manage your gists, analytics or profile</p>
              </a>
            </Link>
          ) : (
            <a onClick={() => signIn()} className={styles.card}>
              <h2>Login or SignUp &rarr;</h2>
              <p>To load or save your gists from Github</p>
            </a>
          )
        }
      </div>
    </div>
  )
}

export default Home
