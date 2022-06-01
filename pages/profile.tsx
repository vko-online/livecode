import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Octokit } from "@octokit/core"
import styles from '../styles/Profile.module.scss'
import { useSession, signIn, signOut } from "next-auth/react"
import { Theme, Header, Stack, HeaderName, Grid, Column, Tabs, TabList, Tab, Button, TabPanels, TabPanel } from '@carbon/react'
import { useEffect, useState } from 'react'
import { serverUrl } from './lib/config'
import { Post } from '@prisma/client'

interface  Props {
  posts: Post[]
}
const Profile: NextPage = ({ posts }: Props) => {
  const { data: session } = useSession()
  // const [gists, setGists] = useState([])

  // useEffect(() => {
  //   const octokit = new Octokit({ auth: session.accessToken })
  //   octokit.request('GET /gists', {}).then(res => setGists(res.data))
  // }, [session?.accessToken])
  
  return (
    <div className={styles.content}>
      <Theme theme="g100">
        <Header aria-label="IBM Platform Name">
          <HeaderName href="/" prefix="live">
            [code]
          </HeaderName>
        </Header>
      </Theme>
      <Tabs>
        <TabList aria-label="List of tabs">
          <Tab>Profile</Tab>
          <Tab>Code shares</Tab>
          {/* <Tab>Gists</Tab> */}
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid className={styles.grid} fullWidth>
              <Column sm={2} md={2} lg={2}>
                {
                  session?.user?.image && <Image src={session?.user?.image} alt='avatar' width={100} height={100}  />
                }
              </Column>
              <Column sm={12} md={12} lg={12}>
                <h1>{session?.user?.name}</h1>
                <code>{session?.user?.email}</code>
              </Column>
              <Column sm={1} md={1} lg={1}>
                <Button kind='secondary' size='sm' variant='' onClick={signOut}>Logout</Button>
              </Column>
            </Grid>
          </TabPanel>
          <TabPanel className={styles.gists}>
            <ul>
              {
                posts.map(post => (
                  <li key={post.id}>
                    <Link href={`/${post.id}`}>{post.id}</Link>
                  </li>
                ))
              }
            </ul>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const res = await fetch(`${serverUrl}/api/post/posts`)
  const data = await res.json()
  return { props: { posts: data } }
}


export default Profile
