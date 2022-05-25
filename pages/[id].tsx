import Header from './components/Header'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import MonacoEditor, { Cursor } from './components/MonacoEditor'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { io } from "socket.io-client"
import { useRouter } from 'next/router'
import useSocket from './hooks/useSocket'
import { useSession } from 'next-auth/react';
import { useMonaco } from '@monaco-editor/react';


const Editor: NextPage = () => {
  const [connected, setConnected] = useState<boolean>(false);
  const dispatch = useDispatch()
  const { data: session } = useSession()
  const router = useRouter()
  const monaco = useMonaco()
  const { id } = router.query
  const socket = useSocket(id, session?.user?.name ?? 'anonymous')

  const [value, setValue] = useState('')
  const [members, setMembers] = useState<string[]>([])
  const [otherCursor, setOtherCursor] = useState<Cursor>()

  console.log('members', members)
  console.log('value', value)
  
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
    socket?.on('cursor_position', (data) => {
      setOtherCursor(data)
    })

    return () => {
      socket?.off('code_change')
      socket?.off('joined_room')
      socket?.off('left_room')
      socket?.off('cursor_position')
    }
  }, [socket, members])

  return (
    <>
      <Header />
      <div>
        <MonacoEditor
          value={value}
          onCursorPositionChange={(e) => {
            socket?.emit('input_cursor_position', e)
          }}
          otherCursor={otherCursor}
          onChange={(val) => {
            setValue(val)
            socket?.emit('input_code_change', val)
          }}
        />
      </div>
    </>
  )
}

export default Editor
