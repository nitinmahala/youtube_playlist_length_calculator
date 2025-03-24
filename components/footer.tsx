import { Github, Linkedin, Heart, Globe } from "lucide-react"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full py-6 mt-auto">
      <div className="container flex flex-col items-center justify-center gap-4 md:gap-3 text-center">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>Made with</span>
          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          <span>by</span>
          <span className="font-medium text-foreground">Nitin Mahala</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/nitinmahala"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="sr-only">GitHub</span>
            <Github className="h-5 w-5" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/mahalanitin/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="sr-only">LinkedIn</span>
            <Linkedin className="h-5 w-5" />
          </Link>
          <Link
            href="https://nitinmahala.netlify.app/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="sr-only">Website</span>
            <Globe className="h-5 w-5" />
          </Link>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} YouTube Playlist Calculator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
