import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Clock, CheckCircle, XCircle } from "lucide-react"

interface GameSession {
  id: number
  date: string
  category: string
  score: number
  correctAnswers: number
  totalQuestions: number
  timeElapsed: number
}

interface GameHistoryListProps {
  gameHistory: GameSession[]
}

export function GameHistoryList({ gameHistory }: GameHistoryListProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-4">
      {gameHistory.map((game) => (
        <Card key={game.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              <div className="p-6 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{game.category}</h3>
                    <p className="text-sm text-muted-foreground">{format(new Date(game.date), "PPP 'at' p")}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(game.timeElapsed)}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {game.correctAnswers}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <XCircle className="h-3 w-3 text-red-500" />
                      {game.totalQuestions - game.correctAnswers}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(game.correctAnswers / game.totalQuestions) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round((game.correctAnswers / game.totalQuestions) * 100)}%
                  </span>
                </div>
              </div>
              <div className="bg-muted p-6 flex flex-col justify-center items-center sm:w-32">
                <div className="text-2xl font-bold">{game.score}</div>
                <div className="text-xs text-muted-foreground">points</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

