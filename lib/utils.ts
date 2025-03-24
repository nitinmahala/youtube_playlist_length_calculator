import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format seconds to HH:MM:SS
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }
}

// Check if URL is a valid YouTube URL
export function isValidYouTubeUrl(url: string): boolean {
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
  return regex.test(url)
}

// Extract playlist ID from YouTube URL
export function extractPlaylistId(url: string): string | null {
  const regex = /[?&]list=([^&]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

// Extract video ID from YouTube URL
export function extractVideoId(url: string): string | null {
  // Handle youtu.be format
  if (url.includes("youtu.be/")) {
    const regex = /youtu\.be\/([^?&]+)/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  // Handle youtube.com format
  const regex = /[?&]v=([^&]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

