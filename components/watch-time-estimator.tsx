"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatDuration } from "@/lib/utils"

interface Video {
  id: string
  title: string
  duration: number
}

interface WatchTimeEstimatorProps {
  totalDuration: number
  playbackSpeed: number
  videos: Video[]
}

export default function WatchTimeEstimator({ totalDuration, playbackSpeed, videos }: WatchTimeEstimatorProps) {
  const [dailyWatchTime, setDailyWatchTime] = useState(60) // Default: 60 minutes per day

  const adjustedDuration = totalDuration / playbackSpeed

  // Calculate days needed
  const minutesPerDay = dailyWatchTime
  const totalMinutes = adjustedDuration / 60
  const daysNeeded = Math.ceil(totalMinutes / minutesPerDay)

  // Calculate completion date
  const completionDate = new Date()
  completionDate.setDate(completionDate.getDate() + daysNeeded)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="daily-watch-time">Daily watch time (minutes)</Label>
        <Input
          id="daily-watch-time"
          type="number"
          min={1}
          value={dailyWatchTime}
          onChange={(e) => setDailyWatchTime(Number.parseInt(e.target.value) || 1)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Completion Estimate</h3>
            <div className="space-y-1">
              <p className="text-sm flex justify-between">
                <span>Total watch time:</span>
                <span className="font-medium">{formatDuration(adjustedDuration)}</span>
              </p>
              <p className="text-sm flex justify-between">
                <span>At {playbackSpeed}x speed:</span>
                <span className="font-medium">{formatDuration(adjustedDuration)}</span>
              </p>
              <p className="text-sm flex justify-between">
                <span>Daily watch time:</span>
                <span className="font-medium">{minutesPerDay} minutes</span>
              </p>
              <p className="text-sm flex justify-between">
                <span>Days needed:</span>
                <span className="font-medium">{daysNeeded} days</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Completion Date</h3>
            <div className="space-y-1">
              <p className="text-sm flex justify-between">
                <span>Start date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </p>
              <p className="text-sm flex justify-between">
                <span>Completion date:</span>
                <span className="font-medium">{completionDate.toLocaleDateString()}</span>
              </p>
              <p className="text-sm flex justify-between">
                <span>Videos per day:</span>
                <span className="font-medium">~{Math.ceil(videos.length / daysNeeded)}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>
          Based on your settings, you'll need to watch about {Math.round(totalMinutes / daysNeeded)} minutes (
          {formatDuration((totalMinutes / daysNeeded) * 60)}) per day to complete this playlist in {daysNeeded} days.
        </p>
      </div>
    </div>
  )
}

