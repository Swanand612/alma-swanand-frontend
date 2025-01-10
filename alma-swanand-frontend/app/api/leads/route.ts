import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'db.json')

async function readDb() {
  const data = await fs.readFile(DB_PATH, 'utf-8')
  return JSON.parse(data)
}

export async function GET() {
  try {
    const db = await readDb()
    return NextResponse.json({ leads: db.leads })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

