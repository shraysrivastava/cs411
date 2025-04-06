import type { Metadata } from "next"
import { GameHistoryList } from "@/components/game-history-list"

export const metadata: Metadata = {
  title: "Game History - Trivia Master",
  description: "View your past trivia game sessions",
}

export default function HistoryPage() {
  // This would normally be fetched from the backend
  const gameHistory = [
    {
      id: 1,
      date: "2023-04-01T14:30:00Z",
      category: "Sports",
      score: 450,
      correctAnswers: 9,
      totalQuestions: 10,
      timeElapsed: 120,
    },
    {
      id: 2,
      date: "2023-04-02T16:45:00Z",
      category: "Music",
      score: 350,
      correctAnswers: 7,
      totalQuestions: 10,
      timeElapsed: 180,
    },
    {
      id: 3,
      date: "2023-04-03T10:15:00Z",
      category: "Movies",
      score: 500,
      correctAnswers: 10,
      totalQuestions: 10,
      timeElapsed: 150,
    },
    {
      id: 4,
      date: "2023-04-04T19:20:00Z",
      category: "Science",
      score: 400,
      correctAnswers: 8,
      totalQuestions: 10,
      timeElapsed: 165,
    },
    {
      id: 5,
      date: "2023-04-05T11:30:00Z",
      category: "Sports",
      score: 300,
      correctAnswers: 6,
      totalQuestions: 10,
      timeElapsed: 200,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Game History</h1>
      <p className="text-muted-foreground mb-8">View your past game sessions, scores, and performance statistics.</p>
      <GameHistoryList gameHistory={gameHistory} />
    </div>
  )
}

