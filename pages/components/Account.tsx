import { Button } from '@carbon/react'
import Link from 'next/link'
import { useSession, signIn, signOut } from "next-auth/react"
import { Octokit } from "@octokit/core"
import styles from '../../styles/Editor.module.scss'
export default function Account () {
  const { data: session } = useSession()


  if (session != null) {
    const octokit = new Octokit({ auth: session.accessToken })
    octokit.request('GET /gists', {}).then(data => console.log('data', data))

    return (
      <>
        <h5>Welcome, {session.user.name}</h5>
        <code>{session.accessToken}</code>
        <div className={styles.profile}>

        </div>
        <Button kind='secondary' size='sm' variant='' onClick={signOut}>Logout</Button>
      </>
    )
  }

  return (
    <div>
      <h5>Sign in</h5>
      <Button onClick={signIn}>Login</Button>
    </div>
  )
}