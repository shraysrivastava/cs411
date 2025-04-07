import type { Metadata } from "next"
import { GameInterface, Question } from "@/components/game-interface"


export default function GamePage({ params }: { params: { categoryId: string } }) {
  const categoryId = Number.parseInt(params.categoryId)

  // This would normally be fetched from the backend based on the category
  const mockQuestions: Question[] = [
    {
      question_id: 1,
      question_text: "Which team won the NBA Championship in 2023?",
      correct_answer: "Denver Nuggets",
      option1: "Denver Nuggets",
      option2: "Miami Heat",
      option3: "Boston Celtics",
      category_id: 1,
      difficulty: "medium",
    },
    {
      question_id: 2,
      question_text: "Who holds the record for most points scored in an NBA game?",
      correct_answer: "Wilt Chamberlain",
      option1: "Wilt Chamberlain",
      option2: "Kobe Bryant",
      option3: "Michael Jordan",
      category_id: 1,
      difficulty: "medium",
    },
    {
      question_id: 3,
      question_text: "Which country won the 2022 FIFA World Cup?",
      correct_answer: "Argentina",
      option1: "Argentina",
      option2: "France",
      option3: "Brazil",
      category_id: 1,
      difficulty: "easy",
    },
    {
      question_id: 4,
      question_text: "In which year did the first modern Olympic Games take place?",
      correct_answer: "1896",
      option1: "1896",
      option2: "1900",
      option3: "1924",
      category_id: 1,
      difficulty: "hard",
    },
    {
      question_id: 5,
      question_text: "Which tennis player has won the most Grand Slam titles in men's singles?",
      correct_answer: "Novak Djokovic",
      option1: "Novak Djokovic",
      option2: "Rafael Nadal",
      option3: "Roger Federer",
      category_id: 1,
      difficulty: "medium",
    },
  ];
  

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

