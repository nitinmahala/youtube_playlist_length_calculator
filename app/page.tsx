"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useApiKey } from "@/context/api-key-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Youtube, Info, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import LoadingSpinner from "@/components/loading-spinner"
import Footer from "@/components/footer"

export default function WelcomePage() {
  const { apiKey, setApiKey, isLoading } = useApiKey()
  const [inputKey, setInputKey] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && apiKey) {
      router.push("/calculator")
    }
  }, [apiKey, isLoading, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputKey.trim()) {
      setError("Please enter a valid API key")
      return
    }

    setApiKey(inputKey.trim())
    router.push("/calculator")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex items-center justify-center p-4 md:p-8 lg:p-12 flex-grow">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Youtube className="h-6 w-6 text-red-500" />
              <CardTitle className="text-2xl">YouTube Playlist Calculator</CardTitle>
            </div>
            <CardDescription>Enter your YouTube API key to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">YouTube API Key</Label>
                <Input
                  id="api-key"
                  type="text"
                  placeholder="Enter your YouTube API key"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/50 p-3 rounded-md text-sm flex gap-2">
                <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-800 dark:text-amber-300">
                    You need a YouTube Data API key to use this application. Your API key is stored locally on your
                    device and is never sent to our servers.
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" onClick={handleSubmit}>
              Continue
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              <a
                href="https://developers.google.com/youtube/v3/getting-started"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 hover:underline"
              >
                How to get a YouTube API key <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

