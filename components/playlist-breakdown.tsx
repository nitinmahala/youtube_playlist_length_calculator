"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { formatDuration } from "@/lib/utils"

interface Video {
  id: string
  title: string
  duration: number
  thumbnail: string
}

interface PlaylistBreakdownProps {
  videos: Video[]
}

export default function PlaylistBreakdown({ videos }: PlaylistBreakdownProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [excludedVideos, setExcludedVideos] = useState<string[]>([])

  const filteredVideos = videos.filter((video) => video.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const toggleVideoExclusion = (videoId: string) => {
    setExcludedVideos((prev) => (prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]))
  }

  const totalIncludedDuration = videos
    .filter((video) => !excludedVideos.includes(video.id))
    .reduce((total, video) => total + video.duration, 0)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Video Breakdown</h3>
        <p className="text-sm text-muted-foreground">
          Showing {filteredVideos.length} of {videos.length} videos
        </p>
      </div>

      <Input
        placeholder="Search videos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {excludedVideos.length > 0 && (
        <div className="text-sm text-muted-foreground mb-2">
          {excludedVideos.length} videos excluded • Adjusted duration: {formatDuration(totalIncludedDuration)}
        </div>
      )}

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Video</TableHead>
              <TableHead className="w-24 text-right">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video) => (
                <TableRow key={video.id} className={excludedVideos.includes(video.id) ? "opacity-50" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={!excludedVideos.includes(video.id)}
                      onCheckedChange={() => toggleVideoExclusion(video.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-16 h-9 rounded object-cover"
                      />
                      <span className="line-clamp-1">{video.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{formatDuration(video.duration)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No videos found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

