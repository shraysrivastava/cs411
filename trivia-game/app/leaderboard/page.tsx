import type { Metadata } from "next"
import { LeaderboardTable } from "@/components/leaderboard-table"

export const metadata: Metadata = {
  title: "Leaderboard - Trivia Master",
  description: "See the top players in Trivia Master",
}

export default function LeaderboardPage() {
  // This would normally be fetched from the backend
  const leaderboardData = [
    { id: 1, username: "triviaMaster", totalScore: 12500, rank: 1, streak: 15 },
    { id: 2, username: "quizWizard", totalScore: 11200, rank: 2, streak: 8 },
    { id: 3, username: "knowledgeKing", totalScore: 10800, rank: 3, streak: 12 },
    { id: 4, username: "brainiac42", totalScore: 9500, rank: 4, streak: 6 },
    { id: 5, username: "quizQueen", totalScore: 9200, rank: 5, streak: 9 },
    { id: 6, username: "factFinder", totalScore: 8700, rank: 6, streak: 4 },
    { id: 7, username: "triviaChamp", totalScore: 8300, rank: 7, streak: 7 },
    { id: 8, username: "smartypants", totalScore: 7900, rank: 8, streak: 3 },
    { id: 9, username: "geniusGamer", totalScore: 7600, rank: 9, streak: 5 },
    { id: 10, username: "quizMaster", totalScore: 7200, rank: 10, streak: 2 },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      <p className="text-muted-foreground mb-8">
        See how you rank against other players. The leaderboard is updated after each completed game.
      </p>
      <LeaderboardTable leaderboardData={leaderboardData} />
    </div>
  )
}

