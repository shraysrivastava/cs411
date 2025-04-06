import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, Trophy, History, Home, LogOut } from "lucide-react"

export function Navbar() {
  // This would normally be determined by authentication state
  const isLoggedIn = true
  const username = "triviaMaster"

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="h-6 w-6" />
              <span className="font-bold text-xl">Trivia Master</span>
            </Link>
            {isLoggedIn && (
              <nav className="hidden md:flex gap-6">
                <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                  Home
                </Link>
                <Link href="/categories" className="text-sm font-medium transition-colors hover:text-primary">
                  Categories
                </Link>
                <Link href="/history" className="text-sm font-medium transition-colors hover:text-primary">
                  History
                </Link>
                <Link href="/leaderboard" className="text-sm font-medium transition-colors hover:text-primary">
                  Leaderboard
                </Link>
              </nav>
            )}
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <span className="hidden md:inline-block text-sm font-medium">Welcome, {username}</span>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      {isLoggedIn && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4">
            <div className="flex justify-between py-2">
              <Link href="/" className="flex flex-col items-center px-2 py-1">
                <Home className="h-5 w-5" />
                <span className="text-xs">Home</span>
              </Link>
              <Link href="/categories" className="flex flex-col items-center px-2 py-1">
                <Brain className="h-5 w-5" />
                <span className="text-xs">Categories</span>
              </Link>
              <Link href="/history" className="flex flex-col items-center px-2 py-1">
                <History className="h-5 w-5" />
                <span className="text-xs">History</span>
              </Link>
              <Link href="/leaderboard" className="flex flex-col items-center px-2 py-1">
                <Trophy className="h-5 w-5" />
                <span className="text-xs">Leaderboard</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

