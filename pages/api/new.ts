import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../lib/prisma-client'
import { nanoid } from 'nanoid'
import { getSession } from "next-auth/react"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const id = nanoid(6)
  await prisma.post.create({
    data: {
      id: id,
      content: '',
      authorId: session?.userId
    }
  })
  res.redirect(`/${id}`)
}
