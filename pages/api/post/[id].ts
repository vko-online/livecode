import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma-client'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const postId = req.query.id as string

  if (req.method === 'GET') {
    handleGET(postId, res)
  } else if (req.method === 'DELETE') {
    handleDELETE(postId, res)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}

// GET /api/post/:id
async function handleGET(postId: string, res) {
  const post = await prisma.post.findFirst({
    where: { id: postId },
  })
  res.json(post)
}

// DELETE /api/post/:id
async function handleDELETE(postId, res) {
  const post = await prisma.post.delete({
    where: { id: postId },
  })
  res.json(post)
}