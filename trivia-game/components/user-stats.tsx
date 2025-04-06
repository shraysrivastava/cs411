import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Award, Clock, CheckCircle } from "lucide-react"

export function UserStats() {
  // This would normally be fetched from the backend
  const stats = {
    totalScore: 2450,
    rank: 15,
    streak: 3,
    gamesPlayed: 25,
    correctAnswers: 185,
    accuracy: 74,
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Total Score</p>
              <p className="text-xl font-bold">{stats.totalScore}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Rank</p>
              <p className="text-xl font-bold">#{stats.rank}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Games Played</p>
              <p className="text-xl font-bold">{stats.gamesPlayed}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Current Streak</p>
              <p className="text-xl font-bold">{stats.streak}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

