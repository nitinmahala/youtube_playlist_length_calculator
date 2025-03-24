import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large"
  className?: string
}

export default function LoadingSpinner({ size = "medium", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-5 w-5",
    large: "h-8 w-8",
  }

  return <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
}

