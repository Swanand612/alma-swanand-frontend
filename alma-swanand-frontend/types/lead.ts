export type LeadStatus = 'PENDING' | 'REACHED_OUT'

export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  linkedin: string
  visas: string[]
  country: string
  message: string
  status: LeadStatus
  submittedAt: string
  resume?: File
}

