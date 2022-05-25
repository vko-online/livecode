import type { NextApiRequest, NextApiResponse } from 'next'
import { nanoid } from 'nanoid'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = nanoid(6)
  res.redirect(`/${id}`)
}
