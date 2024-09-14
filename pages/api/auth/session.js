// pages/api/auth/session.js

import { getSession } from "next-auth/react"

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  try {
    console.log("[API] Attempting to get session")
    const session = await getSession({ req })
    console.log("[API] Session retrieved", session)
    
    if (session) {
      res.status(200).json(session)
    } else {
      console.log("[API] No session found")
      res.status(200).json(null)
    }
  } catch (error) {
    console.error("[API] Error getting session:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}