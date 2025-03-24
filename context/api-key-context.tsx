"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type ApiKeyContextType = {
  apiKey: string | null
  setApiKey: (key: string) => void
  clearApiKey: () => void
  isLoading: boolean
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined)

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load API key from localStorage on initial render
    const storedKey = localStorage.getItem("youtube_api_key")
    setApiKeyState(storedKey)
    setIsLoading(false)
  }, [])

  const setApiKey = (key: string) => {
    localStorage.setItem("youtube_api_key", key)
    setApiKeyState(key)
  }

  const clearApiKey = () => {
    localStorage.removeItem("youtube_api_key")
    setApiKeyState(null)
  }

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey, isLoading }}>{children}</ApiKeyContext.Provider>
  )
}

export function useApiKey() {
  const context = useContext(ApiKeyContext)
  if (context === undefined) {
    throw new Error("useApiKey must be used within an ApiKeyProvider")
  }
  return context
}

