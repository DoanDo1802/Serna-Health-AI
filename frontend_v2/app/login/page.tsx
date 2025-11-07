"use client"

import type React from "react"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import DotGridShader from "@/components/DotGridShader"
import RevealOnView from "@/components/reveal-on-view"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/home")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="bg-neutral-950 text-white min-h-screen flex items-center justify-center p-4">
      <RevealOnView
        as="div"
        intensity="hero"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 p-8"
      >
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
        <h1 className="text-3xl font-black leading-tight tracking-tight mb-2">Welcome back</h1>
        <p className="text-white/70 mb-8">Sign in to your account to continue</p>

        {/* Login Form */}
        <form className="space-y-5" onSubmit={handleLogin}>
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

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full rounded-full" isLoading={isLoading}>
            Sign in
          </Button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-white/60">
          Don't have an account?{" "}
          <Link href="/register" className="text-white hover:underline">
            Create one
          </Link>
        </p>
      </RevealOnView>
    </main>
  )
}
