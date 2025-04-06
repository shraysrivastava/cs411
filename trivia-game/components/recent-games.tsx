import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function RecentGames() {
  // This would normally be fetched from the backend
  const recentGames = [
    {
      id: 1,
      date: new Date("2023-04-01T14:30:00Z"),
      category: "Sports",
      score: 450,
      correctAnswers: 9,
      totalQuestions: 10,
    },
    {
      id: 2,
      date: new Date("2023-04-02T16:45:00Z"),
      category: "Music",
      score: 350,
      correctAnswers: 7,
      totalQuestions: 10,
    },
    {
      id: 3,
      date: new Date("2023-04-03T10:15:00Z"),
      category: "Movies",
      score: 500,
      correctAnswers: 10,
      totalQuestions: 10,
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Games</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentGames.map((game) => (
            <div key={game.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{game.category}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatDistanceToNow(game.date, { addSuffix: true })}</span>
                  <span>•</span>
                  <span>
                    {game.correctAnswers}/{game.totalQuestions} correct
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{game.score}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
            </div>
          ))}
          <Button asChild variant="outline" size="sm" className="w-full mt-2">
            <Link href="/history">View All Games</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

