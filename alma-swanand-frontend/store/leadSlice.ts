import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Lead } from '@/types/lead'

interface LeadState {
  leads: Lead[]
  isLoading: boolean
}

const initialState: LeadState = {
  leads: [],
  isLoading: true
}

export const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setLeads: (state, action: PayloadAction<Lead[]>) => {
      state.leads = action.payload
      state.isLoading = false
    },
    addLead: (state, action: PayloadAction<Lead>) => {
      state.leads.push(action.payload)
    },
    updateLeadStatus: (state, action: PayloadAction<{ id: string, status: 'PENDING' | 'REACHED_OUT' }>) => {
      const lead = state.leads.find(lead => lead.id === action.payload.id)
      if (lead) {
        lead.status = action.payload.status
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    }
  }
})

export const { setLeads, addLead, updateLeadStatus, setLoading } = leadSlice.actions

export default leadSlice.reducer

