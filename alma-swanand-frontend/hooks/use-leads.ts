import { useState, useEffect } from 'react'
import type { Lead } from '@/types/lead'

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLeads()
  }, [])

  async function fetchLeads() {
    try {
      const response = await fetch('/api/leads')
      const data = await response.json()
      setLeads(data.leads)
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function updateLeadStatus(id: string, status: 'PENDING' | 'REACHED_OUT') {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error('Failed to update lead status')

      setLeads(leads.map(lead => 
        lead.id === id ? { ...lead, status } : lead
      ))
    } catch (error) {
      console.error('Error updating lead status:', error)
    }
  }

  return { leads, isLoading, updateLeadStatus }
}

