"use client"

import type React from "react"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import DotGridShader from "@/components/DotGridShader"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/home`,
        },
      })
      if (error) throw error
      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <main
        className="bg-neutral-950 text-white min-h-screen flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: 'url(/images/bacground_serna_v2-2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay to make background lighter */}
        <div className="absolute inset-0 bg-neutral-950/40 pointer-events-none"></div>

        <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/5 bg-neutral-900/40 p-8 z-10 backdrop-blur-sm">
          <div className="pointer-events-none absolute inset-0 opacity-5 mix-blend-soft-light">
            <DotGridShader />
          </div>

          <div className="mb-8 flex items-center gap-2">
            <div className="text-2xl font-extrabold tracking-tight">Serna Health AI</div>
            <div className="h-2 w-2 rounded-full bg-white/60" aria-hidden="true" />
          </div>

          <h1 className="text-3xl font-black leading-tight tracking-tight mb-2">Check your email</h1>
          <p className="text-white/70 mb-8">
            We've sent you a confirmation link to <strong>{email}</strong>. Please check your email to verify your
            account.
          </p>

          <Button asChild size="lg" className="w-full rounded-full">
            <Link href="/login">Go to login</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main
      className="bg-neutral-950 text-white min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(/images/bacground_serna_v2-2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay to make background lighter */}
      <div className="absolute inset-0 bg-neutral-950/40 pointer-events-none"></div>

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/5 bg-neutral-900/40 p-8 z-10 backdrop-blur-sm">
        {/* Texture background */}
        <div className="pointer-events-none absolute inset-0 opacity-5 mix-blend-soft-light">
          <DotGridShader />
        </div>

        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white/90 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Wordmark */}
        <div className="mb-8 flex items-center gap-2">
          <div className="text-2xl font-extrabold tracking-tight">Serna Health AI</div>
          <div className="h-2 w-2 rounded-full bg-white/60" aria-hidden="true" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-black leading-tight tracking-tight mb-2">Create account</h1>
        <p className="text-white/70 mb-8">Together, we redefine how AI supports clinicians.</p>

        {/* Register Form */}
        <form className="space-y-5" onSubmit={handleRegister}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-white/90">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="SernaAI@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-neutral-900/80 px-4 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-white/90">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-neutral-900/80 px-4 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium text-white/90">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-neutral-900/80 px-4 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full rounded-full" isLoading={isLoading}>
            Create account
          </Button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
