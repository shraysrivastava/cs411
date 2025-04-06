import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryCard } from "@/components/category-card"
import { RecentGames } from "@/components/recent-games"
import { UserStats } from "@/components/user-stats"

export default function Home() {
  // This would normally be fetched from the backend
  const categories = [
    { id: 1, name: "Sports", description: "Questions about various sports and athletes", questionCount: 25 },
    { id: 2, name: "Music", description: "Test your knowledge of songs, artists, and albums", questionCount: 30 },
    { id: 3, name: "Movies", description: "Questions about films, directors, and actors", questionCount: 40 },
    { id: 4, name: "Science", description: "Explore the world of scientific discoveries", questionCount: 20 },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Trivia Master</CardTitle>
              <CardDescription>Test your knowledge across various categories and compete with others!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Popular Categories</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/categories">View All Categories</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="space-y-6">
          <UserStats />
          <RecentGames />
        </div>
      </div>
    </div>
  )
}

