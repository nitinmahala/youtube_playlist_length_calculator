"use server"

import { isValidYouTubeUrl, extractPlaylistId, extractVideoId } from "./utils"

export async function calculatePlaylistDuration(url: string, apiKey: string) {
  if (!apiKey) {
    throw new Error("YouTube API key is not configured")
  }

  if (!isValidYouTubeUrl(url)) {
    throw new Error("Invalid YouTube URL")
  }

  let playlistId = extractPlaylistId(url)

  // If it's a video URL, try to get the playlist it belongs to
  if (!playlistId) {
    const videoId = extractVideoId(url)
    if (videoId) {
      // Try to get playlist from video
      const videoResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`,
      )
      const videoData = await videoResponse.json()

      if (videoData.error) {
        throw new Error(videoData.error.message || "YouTube API Error")
      }

      if (videoData.items && videoData.items.length > 0) {
        // If video is part of a playlist, the playlist ID might be in the snippet
        playlistId = videoData.items[0].snippet?.playlistId

        // If no playlist found, create a single-video "playlist"
        if (!playlistId) {
          const durationResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoId}&key=${apiKey}`,
          )
          const durationData = await durationResponse.json()

          if (durationData.error) {
            throw new Error(durationData.error.message || "YouTube API Error")
          }

          if (durationData.items && durationData.items.length > 0) {
            const video = durationData.items[0]
            const duration = parseIsoDuration(video.contentDetails.duration)

            return {
              title: video.snippet.title,
              totalDuration: duration,
              videos: [
                {
                  id: video.id,
                  title: video.snippet.title,
                  duration: duration,
                  thumbnail: video.snippet.thumbnails.medium.url,
                },
              ],
            }
          } else {
            throw new Error("Video not found")
          }
        }
      }
    }
  }

  if (!playlistId) {
    throw new Error("Could not find a valid playlist ID")
  }

  // Get playlist details
  const playlistResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`,
  )
  const playlistData = await playlistResponse.json()

  if (playlistData.error) {
    throw new Error(playlistData.error.message || "YouTube API Error")
  }

  if (!playlistData.items || playlistData.items.length === 0) {
    throw new Error("Playlist not found or is private")
  }

  const playlistTitle = playlistData.items[0].snippet.title

  // Get all playlist items
  let allItems: any[] = []
  let nextPageToken: string | null = null

  do {
    const playlistItemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}${
      nextPageToken ? `&pageToken=${nextPageToken}` : ""
    }`

    const playlistItemsResponse = await fetch(playlistItemsUrl)
    const playlistItemsData = await playlistItemsResponse.json()

    if (playlistItemsData.error) {
      throw new Error(playlistItemsData.error.message || "YouTube API Error")
    }

    if (!playlistItemsData.items) {
      throw new Error("Failed to fetch playlist items")
    }

    allItems = [...allItems, ...playlistItemsData.items]
    nextPageToken = playlistItemsData.nextPageToken || null
  } while (nextPageToken)

  // Extract video IDs
  const videoIds = allItems
    .map((item) => item.snippet.resourceId.videoId)
    .filter(Boolean)
    .join(",")

  // Get video durations
  const videoDurationsResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${apiKey}`,
  )
  const videoDurationsData = await videoDurationsResponse.json()

  if (videoDurationsData.error) {
    throw new Error(videoDurationsData.error.message || "YouTube API Error")
  }

  if (!videoDurationsData.items) {
    throw new Error("Failed to fetch video durations")
  }

  // Process videos and calculate total duration
  const videos = videoDurationsData.items.map((video: any) => {
    const duration = parseIsoDuration(video.contentDetails.duration)
    return {
      id: video.id,
      title: video.snippet.title,
      duration: duration,
      thumbnail: video.snippet.thumbnails.medium.url,
    }
  })

  const totalDuration = videos.reduce((total: number, video: any) => total + video.duration, 0)

  return {
    title: playlistTitle,
    totalDuration,
    videos,
  }
}

// Parse ISO 8601 duration format (PT1H30M15S)
function parseIsoDuration(isoDuration: string): number {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
  const matches = isoDuration.match(regex)

  if (!matches) {
    return 0
  }

  const hours = Number.parseInt(matches[1] || "0")
  const minutes = Number.parseInt(matches[2] || "0")
  const seconds = Number.parseInt(matches[3] || "0")

  return hours * 3600 + minutes * 60 + seconds
}

