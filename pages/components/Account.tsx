import { Button, Stack } from '@carbon/react'
import Link from 'next/link'
import { useSession, signIn, signOut } from "next-auth/react"
import { Octokit } from "@octokit/core"
import styles from '../../styles/Profile.module.scss'
export default function Account () {
  const { data: session } = useSession()


  if (session != null) {

    return (
      <Stack gap={6}>
        <h5>Welcome, {session.user.name}</h5>
        <div className={styles.github}>
          Send your bug reports, suggestions or ideas to <a href="https://github.com/vko-online/livecode/issues">Github</a>
        </div>
        <Button kind='secondary' size='sm' variant='' onClick={signOut}>Logout</Button>
      </Stack>
    )
  }

  return (
    <div>
      <h5>Sign in</h5>
      <Button onClick={signIn}>Login</Button>
    </div>
  )
}