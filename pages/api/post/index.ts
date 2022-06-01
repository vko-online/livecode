import prisma from '../../../lib/prisma-client'
import { getSession } from "next-auth/react"
import { NextApiRequest, NextApiResponse } from 'next'


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id, content } = JSON.parse(req.body)
  
  if (content && id) {
    await prisma.post.update({
      data: {
        content: content
      },
      where: {
        id: id
      }
    })
  }
  res.end()
}