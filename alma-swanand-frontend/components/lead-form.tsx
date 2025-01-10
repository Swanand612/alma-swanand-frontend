'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useDispatch } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { addLead } from '@/store/leadSlice'
import { AppDispatch } from '@/store/store'

const visaTypes = [
  { id: 'o1', label: 'O-1' },
  { id: 'eb1a', label: 'EB1-A' },
  { id: 'eb2niw', label: 'EB-2 NIW' },
  { id: 'unknown', label: "I don't know" },
] as const

// Common countries list - can be expanded
const countries = [
  'United States', 'Mexico', 'Canada', 'Brazil', 'China', 'India', 
  'Russia', 'United Kingdom', 'France', 'Germany', 'Japan', 'South Korea',
  'Australia', 'Spain', 'Italy'
].sort()

const formSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  linkedin: z.string().url('Invalid LinkedIn URL'),
  country: z.string().min(2, 'Country is required'),
  visas: z.array(z.string()).min(1, 'Please select at least one visa type'),
  resume: z.instanceof(File).optional(),
  message: z.string().min(10, 'Please provide more details about your case'),
})

type FormValues = z.infer<typeof formSchema>

export default function LeadForm() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      linkedin: '',
      country: '',
      visas: [],
      message: '',
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'visas') {
          formData.append(key, JSON.stringify(value))
        } else if (key === 'resume' && value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, value as string)
        }
      })

      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Submission failed')
      }

      const newLead = await response.json()
      dispatch(addLead(newLead))

      router.push('/thank-you')
    } catch (error) {
      console.error('Submission error:', error)
      // Here you might want to show an error message to the user
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="bg-[#C5D86D] rounded-t-lg relative overflow-hidden">
        <div className="absolute -left-12 -top-12">
          <div className="w-32 h-32 bg-[#C5D86D] rounded-full opacity-80 absolute" />
          <div className="w-24 h-24 bg-[#C5D86D] rounded-full opacity-60 absolute top-12 left-12" />
          <div className="w-16 h-16 bg-[#C5D86D] rounded-full opacity-40 absolute top-20 left-20" />
        </div>
        <CardTitle className="text-3xl font-bold text-black relative z-10">
          Get An Assessment Of Your Immigration Case
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-gray-700 mb-6 justify-center">
          Want to understand your visa options? Submit the form below and our team of experienced attorneys will review your information and send a preliminary assessment of your case based on your goals.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country of Citizenship</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile</FormLabel>
                  <FormControl>
                    <Input 
                      type="url" 
                      placeholder="https://linkedin.com/in/johndoe" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visas"
              render={() => (
                <FormItem>
                  <FormLabel>Visa categories of interest</FormLabel>
                  <div className="grid gap-4 mt-2">
                    {visaTypes.map((visa) => (
                      <FormField
                        key={visa.id}
                        control={form.control}
                        name="visas"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(visa.id)}
                                onCheckedChange={(checked) => {
                                  const value = field.value || []
                                  if (checked) {
                                    field.onChange([...value, visa.id])
                                  } else {
                                    field.onChange(value.filter((v) => v !== visa.id))
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {visa.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume / CV</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How can we help you?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your immigration goals and background..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

