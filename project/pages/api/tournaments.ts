// /pages/api/tournaments.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllTournaments } from '../../src/api/pandascoreAPI'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getAllTournaments()
    res.status(200).json(data)
  } catch (error) {
    console.error("Failed to load tournaments:", error)
    res.status(500).json({ error: "Failed to load tournaments" })
  }
}
