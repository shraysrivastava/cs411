import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trophy, Flame } from "lucide-react"

interface LeaderboardEntry {
  id: number
  username: string
  totalScore: number
  rank: number
  streak: number
}

interface LeaderboardTableProps {
  leaderboardData: LeaderboardEntry[]
}

export function LeaderboardTable({ leaderboardData }: LeaderboardTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead className="text-center w-24">Streak</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboardData.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="text-center font-medium">
                {entry.rank <= 3 ? (
                  <div className="flex justify-center">
                    <Trophy
                      className={`h-5 w-5 ${
                        entry.rank === 1 ? "text-yellow-500" : entry.rank === 2 ? "text-gray-400" : "text-amber-600"
                      }`}
                    />
                  </div>
                ) : (
                  entry.rank
                )}
              </TableCell>
              <TableCell className="font-medium">{entry.username}</TableCell>
              <TableCell className="text-right">{entry.totalScore.toLocaleString()}</TableCell>
              <TableCell className="text-center">
                {entry.streak > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1 mx-auto">
                    <Flame className="h-3 w-3 text-orange-500" />
                    {entry.streak}
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

