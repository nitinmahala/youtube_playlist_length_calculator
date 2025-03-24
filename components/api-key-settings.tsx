"use client"

import { useState } from "react"
import { useApiKey } from "@/context/api-key-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Save, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ApiKeySettingsProps {
  onClose: () => void
}

export default function ApiKeySettings({ onClose }: ApiKeySettingsProps) {
  const { apiKey, setApiKey } = useApiKey()
  const [inputKey, setInputKey] = useState(apiKey || "")
  const { toast } = useToast()

  const handleSave = () => {
    if (!inputKey.trim()) {
      toast({
        title: "Error",
        description: "API key cannot be empty",
        variant: "destructive",
      })
      return
    }

    setApiKey(inputKey.trim())
    toast({
      title: "Success",
      description: "API key updated successfully",
    })
    onClose()
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>API Key Settings</CardTitle>
          <CardDescription>Update your YouTube API key</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key-update">YouTube API Key</Label>
            <Input
              id="api-key-update"
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Enter your YouTube API key"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Your API key is stored locally on your device and is never sent to our servers.</p>
            <a
              href="https://developers.google.com/youtube/v3/getting-started"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center mt-2 gap-1 hover:underline w-fit"
            >
              How to get a YouTube API key <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save API Key
        </Button>
      </CardFooter>
    </Card>
  )
}

