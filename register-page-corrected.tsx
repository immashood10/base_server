// 'use client'

// import React, { ChangeEvent, FormEvent, useState } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { useAuth } from '@/context/AuthContext'
// import Input from '@/components/ui/Input'
// import Button from '@/components/ui/Button'

// // Phone country data
// const COUNTRIES = [
//     { label: 'United States', isoCode: 'US', countryCode: '+1' },
//     { label: 'United Kingdom', isoCode: 'GB', countryCode: '+44' },
//     { label: 'Canada', isoCode: 'CA', countryCode: '+1' },
//     { label: 'India', isoCode: 'IN', countryCode: '+91' }
//     // Add more countries as needed
// ]

// const TIMEZONES = [
//     'UTC',
//     'America/New_York',
//     'America/Chicago',
//     'America/Denver',
//     'America/Los_Angeles',
//     'Europe/London',
//     'Europe/Paris',
//     'Asia/Dubai',
//     'Asia/Kolkata',
//     'Asia/Bangkok',
//     'Asia/Tokyo',
//     'Australia/Sydney'
// ]

// type RegisterFormData = {
//     name: string
//     email: string
//     password: string
//     confirmPassword: string
//     phoneNumber: {
//         isoCode: string
//         countryCode: string
//         internationalNumber: string
//     }
//     timezone: string
//     role: 'user' | 'seller'
//     consent: boolean
// }

// type RegisterResponse = {
//     message?: string
//     data?: {
//         user?: unknown
//         accessToken?: string
//         refreshToken?: string
//         tokens?: {
//             accessToken?: string
//             refreshToken?: string
//         }
//     }
// }

// export default function RegisterPage() {
//     const router = useRouter()
//     const { register } = useAuth()
//     const [formData, setFormData] = useState<RegisterFormData>({
//         name: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         phoneNumber: {
//             isoCode: 'US',
//             countryCode: '+1',
//             internationalNumber: ''
//         },
//         timezone: 'UTC',
//         role: 'user', // Changed from 'buyer' to 'user'
//         consent: false
//     })
//     const [error, setError] = useState('')
//     const [loading, setLoading] = useState(false)

//     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value, checked } = e.target

//         if (name === 'consent') {
//             setFormData({ ...formData, consent: checked })
//         } else if (name === 'role') {
//             setFormData({ ...formData, role: value as RegisterFormData['role'] })
//         } else if (name === 'timezone') {
//             setFormData({ ...formData, timezone: value })
//         } else if (name === 'country') {
//             const country = COUNTRIES.find((c) => c.isoCode === value)
//             if (country) {
//                 setFormData({
//                     ...formData,
//                     phoneNumber: {
//                         ...formData.phoneNumber,
//                         isoCode: country.isoCode,
//                         countryCode: country.countryCode
//                     }
//                 })
//             }
//         } else if (name === 'phone') {
//             setFormData({
//                 ...formData,
//                 phoneNumber: {
//                     ...formData.phoneNumber,
//                     internationalNumber: value
//                 }
//             })
//         } else {
//             setFormData({ ...formData, [name]: value })
//         }
//     }

//     const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault()
//         setError('')

//         // Validation
//         if (!formData.name.trim()) {
//             setError('Full name is required')
//             return
//         }

//         if (!formData.email.trim()) {
//             setError('Email is required')
//             return
//         }

//         if (formData.password !== formData.confirmPassword) {
//             setError('Passwords do not match')
//             return
//         }

//         if (formData.password.length < 6) {
//             setError('Password must be at least 6 characters')
//             return
//         }

//         if (!formData.phoneNumber.internationalNumber.trim()) {
//             setError('Phone number is required')
//             return
//         }

//         if (!formData.consent) {
//             setError('Please accept the terms and conditions')
//             return
//         }

//         setLoading(true)

//         try {
//             const response = await fetch('/api/auth/register', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     name: formData.name,
//                     email: formData.email,
//                     password: formData.password,
//                     phoneNumber: formData.phoneNumber,
//                     timezone: formData.timezone,
//                     role: formData.role,
//                     consent: formData.consent
//                 })
//             })

//             const data: RegisterResponse = await response.json()

//             if (!response.ok) {
//                 setError(data.message || 'Something went wrong')
//                 return
//             }

//             const accessToken = data.data?.tokens?.accessToken ?? data.data?.accessToken
//             const refreshToken = data.data?.tokens?.refreshToken ?? data.data?.refreshToken

//             if (!accessToken) {
//                 setError('Registration succeeded, but no access token was returned.')
//                 return
//             }

//             // Support both nested and top-level token response shapes.
//             localStorage.setItem('accessToken', accessToken)
//             if (refreshToken) {
//                 localStorage.setItem('refreshToken', refreshToken)
//             }

//             register(data.data?.user, accessToken)
//             router.push('/dashboard')
//         } catch (err) {
//             setError('Network error. Please try again.')
//             console.error(err)
//         } finally {
//             setLoading(false)
//         }
//     }

//     return (
//         <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
//             <div className="w-full max-w-md">
//                 <div className="bg-white rounded-2xl shadow-xl p-8">
//                     <div className="text-center mb-8">
//                         <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
//                         <p className="text-slate-500">Join our marketplace</p>
//                     </div>
//                     <form onSubmit={handleSubmit}>
//                         {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}

//                         <Input
//                             label="Full Name"
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             placeholder="Enter your full name"
//                             required
//                         />

//                         <Input
//                             label="Email"
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             placeholder="Enter your email"
//                             required
//                         />

//                         {/* Phone Number */}
//                         <div className="mb-4">
//                             <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
//                             <div className="flex gap-2">
//                                 <select
//                                     name="country"
//                                     value={formData.phoneNumber.isoCode}
//                                     onChange={handleChange}
//                                     className="flex-shrink-0 w-20 px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
//                                     {COUNTRIES.map((country) => (
//                                         <option
//                                             key={country.isoCode}
//                                             value={country.isoCode}>
//                                             {country.countryCode}
//                                         </option>
//                                     ))}
//                                 </select>
//                                 <input
//                                     type="tel"
//                                     name="phone"
//                                     value={formData.phoneNumber.internationalNumber}
//                                     onChange={handleChange}
//                                     placeholder="Phone number"
//                                     className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                     required
//                                 />
//                             </div>
//                         </div>

//                         {/* Timezone */}
//                         <div className="mb-4">
//                             <label className="block text-sm font-medium text-slate-700 mb-2">Timezone *</label>
//                             <select
//                                 name="timezone"
//                                 value={formData.timezone}
//                                 onChange={handleChange}
//                                 className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 required>
//                                 {TIMEZONES.map((tz) => (
//                                     <option
//                                         key={tz}
//                                         value={tz}>
//                                         {tz}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <Input
//                             label="Password"
//                             type="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             placeholder="Create a password"
//                             required
//                         />

//                         <Input
//                             label="Confirm Password"
//                             type="password"
//                             name="confirmPassword"
//                             value={formData.confirmPassword}
//                             onChange={handleChange}
//                             placeholder="Confirm your password"
//                             required
//                         />

//                         {/* Role Selection */}
//                         <div className="mb-6">
//                             <label className="block text-sm font-medium text-slate-700 mb-2">I want to *</label>
//                             <div className="grid grid-cols-2 gap-3">
//                                 <label
//                                     className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
//                                         formData.role === 'user' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'
//                                     }`}>
//                                     <input
//                                         type="radio"
//                                         name="role"
//                                         value="user"
//                                         checked={formData.role === 'user'}
//                                         onChange={handleChange}
//                                         className="sr-only"
//                                     />
//                                     <svg
//                                         className="w-6 h-6 mb-1 text-indigo-600"
//                                         fill="none"
//                                         viewBox="0 0 24 24"
//                                         stroke="currentColor">
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             strokeWidth={2}
//                                             d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//                                         />
//                                     </svg>
//                                     <span className={`text-sm font-medium ${formData.role === 'user' ? 'text-indigo-600' : 'text-slate-600'}`}>
//                                         Buy Products
//                                     </span>
//                                 </label>
//                                 <label
//                                     className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
//                                         formData.role === 'seller' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'
//                                     }`}>
//                                     <input
//                                         type="radio"
//                                         name="role"
//                                         value="seller"
//                                         checked={formData.role === 'seller'}
//                                         onChange={handleChange}
//                                         className="sr-only"
//                                     />
//                                     <svg
//                                         className="w-6 h-6 mb-1 text-indigo-600"
//                                         fill="none"
//                                         viewBox="0 0 24 24"
//                                         stroke="currentColor">
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             strokeWidth={2}
//                                             d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
//                                         />
//                                     </svg>
//                                     <span className={`text-sm font-medium ${formData.role === 'seller' ? 'text-indigo-600' : 'text-slate-600'}`}>
//                                         Sell Products
//                                     </span>
//                                 </label>
//                             </div>
//                         </div>

//                         {/* Consent Checkbox */}
//                         <div className="mb-6">
//                             <label className="flex items-center">
//                                 <input
//                                     type="checkbox"
//                                     name="consent"
//                                     checked={formData.consent}
//                                     onChange={handleChange}
//                                     className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
//                                     required
//                                 />
//                                 <span className="ml-2 text-sm text-slate-600">
//                                     I agree to the{' '}
//                                     <Link
//                                         href="/terms"
//                                         className="text-indigo-600 hover:text-indigo-700 font-medium">
//                                         terms and conditions
//                                     </Link>
//                                 </span>
//                             </label>
//                         </div>

//                         <Button
//                             type="submit"
//                             className="w-full"
//                             disabled={loading}>
//                             {loading ? 'Creating account...' : 'Create Account'}
//                         </Button>
//                     </form>

//                     <div className="mt-6 text-center">
//                         <p className="text-sm text-slate-500">
//                             Already have an account?{' '}
//                             <Link
//                                 href="/login"
//                                 className="text-indigo-600 hover:text-indigo-700 font-medium">
//                                 Sign in
//                             </Link>
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
