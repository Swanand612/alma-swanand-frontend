import { NextResponse } from 'next/server'
import type { Lead } from '@/types/lead'
import fs from 'fs/promises'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'db.json')

async function readDb() {
  const data = await fs.readFile(DB_PATH, 'utf-8')
  return JSON.parse(data)
}

async function writeDb(data: any) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    const newLead: Lead = {
      id: Date.now().toString(),
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      linkedin: formData.get('linkedin') as string,
      country: formData.get('country') as string,
      visas: JSON.parse(formData.get('visas') as string),
      message: formData.get('message') as string,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
    }

    const resume = formData.get('resume') as File
    if (resume) {
      newLead.resumeFilename = resume.name
      // In a real scenario, you'd save the file to a storage service
      console.log(`Received file: ${resume.name}, size: ${resume.size} bytes`)
    }

    const db = await readDb()
    db.leads.push(newLead)
    await writeDb(db)

    return NextResponse.json(newLead)
  } catch (error) {
    console.error('Error submitting lead:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to submit lead' },
      { status: 500 }
    )
  }
}

