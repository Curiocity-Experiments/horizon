// pages/api/auth/session.js

import { getSession } from "next-auth/react"

export default async function handler(req, res) {
  console.log("[API] Session request received", {
    method: req.method,
    url: req.url,
    headers: req.headers
  })
  
  // Add this check to handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  try {
    const session = await getSession({ req })
    console.log("[API] Session retrieved", session)
    
    if (session) {
      res.status(200).json(session)
    } else {
      res.status(401).json({ error: "Unauthorized" })
    }
  } catch (error) {
    console.error("[API] Session error", error)
    res.status(500).json({ error: "Internal Server Error", details: error.message })
  }
}