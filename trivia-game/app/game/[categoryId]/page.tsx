import type { Metadata } from "next"
import { GameInterface } from "@/components/game-interface"

export const metadata: Metadata = {
  title: "Playing Game - Trivia Master",
  description: "Answer trivia questions and test your knowledge",
}

export default function GamePage({ params }: { params: { categoryId: string } }) {
  const categoryId = Number.parseInt(params.categoryId)

  // This would normally be fetched from the backend based on the category
  const mockQuestions = [
    {
      id: 1,
      text: "Which team won the NBA Championship in 2023?",
      correctAnswer: "Denver Nuggets",
      options: ["Denver Nuggets", "Miami Heat", "Boston Celtics", "Los Angeles Lakers"],
      difficulty: "medium",
    },
    {
      id: 2,
      text: "Who holds the record for most points scored in an NBA game?",
      correctAnswer: "Wilt Chamberlain",
      options: ["Wilt Chamberlain", "Kobe Bryant", "Michael Jordan", "LeBron James"],
      difficulty: "medium",
    },
    {
      id: 3,
      text: "Which country won the 2022 FIFA World Cup?",
      correctAnswer: "Argentina",
      options: ["Argentina", "France", "Brazil", "Germany"],
      difficulty: "easy",
    },
    {
      id: 4,
      text: "In which year did the first modern Olympic Games take place?",
      correctAnswer: "1896",
      options: ["1896", "1900", "1924", "1936"],
      difficulty: "hard",
    },
    {
      id: 5,
      text: "Which tennis player has won the most Grand Slam titles in men's singles?",
      correctAnswer: "Novak Djokovic",
      options: ["Novak Djokovic", "Rafael Nadal", "Roger Federer", "Pete Sampras"],
      difficulty: "medium",
    },
  ]

  // Get category name (would normally come from API)
  const categoryNames: Record<number, string> = {
    1: "Sports",
    2: "Music",
    3: "Movies",
    4: "Science",
  }

  const categoryName = categoryNames[categoryId] || "Unknown Category"

  return (
    <div className="container mx-auto px-4 py-8">
      <GameInterface categoryId={categoryId} categoryName={categoryName} questions={mockQuestions} />
    </div>
  )
}

