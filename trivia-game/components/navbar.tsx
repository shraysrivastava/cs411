import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain, Trophy, History, Home, LogOut } from "lucide-react";

export function Navbar() {
  const isLoggedIn = true;
  const username = "user";

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-xl">Guess Dat</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <span className="hidden md:inline-block text-sm font-medium">
                  Welcome, {username}
                </span>
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
    </header>
  );
}
