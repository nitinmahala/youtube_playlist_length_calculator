import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ApiKeyProvider } from "@/context/api-key-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "YouTube Playlist Duration Calculator",
  description: "Calculate the total duration of any YouTube playlist",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ApiKeyProvider>
            {children}
            <Toaster />
          </ApiKeyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'