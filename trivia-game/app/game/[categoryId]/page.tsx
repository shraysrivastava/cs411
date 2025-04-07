"use client"

import { useEffect, useState } from "react"
import { GameInterface, Question } from "@/components/game-interface"

export default function GamePage({ params }: { params: { categoryId: string } }) {
  const categoryId = Number.parseInt(params.categoryId)

  const mockQuestions: Question[] = [
    {
      question_id: 1,
      question_text: "Which team won the NBA Championship in 2023?",
      correct_answer: "Denver Nuggets",
      option1: "Chicago Bulls",
      option2: "Miami Heat",
      option3: "Boston Celtics",
      category_id: 1,
      difficulty: "medium",
    },
    {
      question_id: 2,
      question_text: "Who holds the record for most points scored in an NBA game?",
      correct_answer: "Wilt Chamberlain",
      option1: "Kareem Abdul Jabbar",
      option2: "Kobe Bryant",
      option3: "Michael Jordan",
      category_id: 1,
      difficulty: "medium",
    },
    {
      question_id: 3,
      question_text: "Which country won the 2022 FIFA World Cup?",
      correct_answer: "Argentina",
      option1: "Germany",
      option2: "France",
      option3: "Brazil",
      category_id: 1,
      difficulty: "easy",
    },
    {
      question_id: 4,
      question_text: "In which year did the first modern Olympic Games take place?",
      correct_answer: "1896",
      option1: "1904",
      option2: "1900",
      option3: "1924",
      category_id: 1,
      difficulty: "hard",
    },
    {
      question_id: 5,
      question_text: "Which tennis player has won the most Grand Slam titles in men's singles?",
      correct_answer: "Novak Djokovic",
      option1: "Carlos Alcarez",
      option2: "Rafael Nadal",
      option3: "Roger Federer",
      category_id: 1,
      difficulty: "medium",
    },
  ]

  const [questions, setQuestions] = useState<Question[] | null>(null)

  useEffect(() => {
    fetch(`http://localhost:8080/get-questions?category=${categoryId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then((data: Question[]) => {
        setQuestions(data)
      })
      .catch((err) => {
        console.error("❌ Failed to fetch from backend. Using mock data.", err)
        setQuestions(mockQuestions)
      })
  }, [categoryId])

  const categoryNames: Record<number, string> = {
    1: "Sports",
    2: "Video Games",
    3: "Music",
    4: "Movies",
  }

  const categoryName = categoryNames[categoryId] || "Unknown Category"

  return (
    <div className="container mx-auto px-4 py-8">
      {questions ? (
        <GameInterface categoryId={categoryId} categoryName={categoryName} questions={questions} />
      ) : (
        <p className="text-center text-gray-500">Loading questions...</p>
      )}
    </div>
  )
}
