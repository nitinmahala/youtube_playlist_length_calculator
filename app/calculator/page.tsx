"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { calculatePlaylistDuration } from "@/lib/youtube-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clipboard, Clock, List, Moon, Sun, Youtube, LogOut, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import PlaylistBreakdown from "@/components/playlist-breakdown"
import WatchTimeEstimator from "@/components/watch-time-estimator"
import LoadingSpinner from "@/components/loading-spinner"
import { formatDuration } from "@/lib/utils"
import { useApiKey } from "@/context/api-key-context"
import { useRouter } from "next/navigation"
import ApiKeySettings from "@/components/api-key-settings"
import Footer from "@/components/footer"

export default function CalculatorPage() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [playlistData, setPlaylistData] = useState<any>(null)
  const [error, setError] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const { toast } = useToast()
  const { apiKey, clearApiKey } = useApiKey()
  const router = useRouter()

  useEffect(() => {
    if (!apiKey) {
      router.push("/")
    }
  }, [apiKey, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.includes("youtube.com/playlist") && !url.includes("youtube.com/watch") && !url.includes("youtu.be")) {
      setError("Please enter a valid YouTube playlist URL")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const data = await calculatePlaylistDuration(url, apiKey as string)
      setPlaylistData(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch playlist data")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!playlistData) return

    const text = `YouTube Playlist: ${playlistData.title}
Total Duration: ${formatDuration(playlistData.totalDuration)}
Videos: ${playlistData.videos.length}
At ${playbackSpeed}x speed: ${formatDuration(playlistData.totalDuration / playbackSpeed)}`

    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Playlist information has been copied to your clipboard",
    })
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleLogout = () => {
    clearApiKey()
    router.push("/")
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "dark" : ""}`}>
      <main className="p-4 md:p-8 lg:p-12 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Youtube className="h-6 w-6 text-red-500" />
              <h1 className="text-2xl font-bold">YouTube Playlist Calculator</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {showSettings && <ApiKeySettings onClose={() => setShowSettings(false)} />}

          <Card>
            <CardHeader>
              <CardTitle>Calculate Playlist Duration</CardTitle>
              <CardDescription>Enter a YouTube playlist URL to calculate the total duration</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-2">
                  <Input
                    type="text"
                    placeholder="https://www.youtube.com/playlist?list=..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner /> : "Calculate"}
                  </Button>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </form>

              {isLoading && (
                <div className="flex justify-center items-center py-12">
                  <LoadingSpinner size="large" />
                </div>
              )}

              {playlistData && !isLoading && (
                <div className="mt-6 space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{playlistData.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Total Duration</p>
                            <p className="text-2xl font-bold">{formatDuration(playlistData.totalDuration)}</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Videos</p>
                            <p className="text-2xl font-bold">{playlistData.videos.length}</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">At {playbackSpeed}x Speed</p>
                            <p className="text-2xl font-bold">
                              {formatDuration(playlistData.totalDuration / playbackSpeed)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="playback-speed">Playback Speed: {playbackSpeed}x</Label>
                      </div>
                      <Select
                        value={playbackSpeed.toString()}
                        onValueChange={(value) => setPlaybackSpeed(Number.parseFloat(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select playback speed" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.5">0.5x</SelectItem>
                          <SelectItem value="0.75">0.75x</SelectItem>
                          <SelectItem value="1">1x (Normal)</SelectItem>
                          <SelectItem value="1.25">1.25x</SelectItem>
                          <SelectItem value="1.5">1.5x</SelectItem>
                          <SelectItem value="1.75">1.75x</SelectItem>
                          <SelectItem value="2">2x</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button variant="outline" className="w-full" onClick={copyToClipboard}>
                      <Clipboard className="mr-2 h-4 w-4" />
                      Copy to Clipboard
                    </Button>
                  </div>

                  <Tabs defaultValue="breakdown">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="breakdown">
                        <List className="mr-2 h-4 w-4" />
                        Breakdown
                      </TabsTrigger>
                      <TabsTrigger value="estimator">
                        <Clock className="mr-2 h-4 w-4" />
                        Watch Time Estimator
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="breakdown">
                      <PlaylistBreakdown videos={playlistData.videos} />
                    </TabsContent>
                    <TabsContent value="estimator">
                      <WatchTimeEstimator
                        totalDuration={playlistData.totalDuration}
                        playbackSpeed={playbackSpeed}
                        videos={playlistData.videos}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

