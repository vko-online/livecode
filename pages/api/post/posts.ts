import prisma from '../../lib/prisma-client'
import { getSession } from "next-auth/react"
import { NextApiRequest, NextApiResponse } from 'next'


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  const posts = await prisma.post.findMany({
    where: {
      authorId: session?.userId
    }
  })

  res.send(posts)
}