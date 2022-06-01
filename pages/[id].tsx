import Header from './components/Header'
import type { NextPage, GetServerSidePropsContext, GetServerSideProps } from 'next'
import { useCallback, useEffect, useMemo, useState } from 'react'
import MonacoEditor, { Cursor } from './components/MonacoEditor'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { io } from "socket.io-client"
import { useRouter } from 'next/router'
import useSocket from './hooks/useSocket'
import { useSession } from 'next-auth/react';
import { useMonaco } from '@monaco-editor/react';
import prisma from './lib/prisma-client'
import { Post } from '@prisma/client';
import debounce from 'lodash.debounce'
import { serverUrl } from './lib/config';

interface Props {
  post?: Post
}

const Editor: NextPage = ({ post }: Props) => {
  const [connected, setConnected] = useState<boolean>(false);
  const dispatch = useDispatch()
  const { data: session } = useSession()
  const router = useRouter()
  const monaco = useMonaco()
  const { id } = router.query
  const socket = useSocket(id, session?.user?.name ?? 'anonymous')
  

  const [value, setValue] = useState(post?.content)
  const [members, setMembers] = useState<string[]>([])
  const [otherCursor, setOtherCursor] = useState<Cursor>()

  const changeHandler = useCallback(() => {
    fetch(`${serverUrl}/api/post`, {
      method: 'POST',
      body: JSON.stringify({
        id,
        content: value,
        authorId: session?.userId
      })
    })
  }, [value, id, session])

  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, 300)
  , [changeHandler])

  useEffect(() => {
    debouncedChangeHandler()

    return () => {
      debouncedChangeHandler.cancel()
    }
  }, [value, id, session, debouncedChangeHandler])

  
  useEffect(() => {
    socket?.on('code_change', (new_code) => {
      setValue(new_code)
    })
    socket?.on('joined_room', (userId) => {
      setMembers([...members, userId])
    })
    socket?.on('left_room', (userId) => {
      setMembers(members.filter(v => v !== userId))
    })
    // socket?.on('cursor_position', (data) => {
    //   setOtherCursor(data)
    // })

    return () => {
      socket?.off('code_change')
      socket?.off('joined_room')
      socket?.off('left_room')
      // socket?.off('cursor_position')
    }
  }, [socket, members])

  return (
    <>
      <Header />
      <div>
        <MonacoEditor
          value={value}
          // onCursorPositionChange={(e) => {
          //   socket?.emit('input_cursor_position', e)
          // }}
          // otherCursor={otherCursor}
          onChange={(val) => {
            setValue(val)
            socket?.emit('input_code_change', val)
          }}
        />
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const res = await fetch(`${serverUrl}/api/post/${context.params.id}`)
  const data = await res.json()
  return { props: { post: data } }
}

export default Editor
