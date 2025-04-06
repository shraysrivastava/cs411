"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Question {
  id: number
  text: string
  correctAnswer: string
  options: string[]
  difficulty: string
}

interface GameInterfaceProps {
  categoryId: number
  categoryName: string
  questions: Question[]
}

export function GameInterface({ categoryId, categoryName, questions }: GameInterfaceProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameOver, setGameOver] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(Array(questions.length).fill(false))

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  useEffect(() => {
    if (gameOver) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          if (!answeredQuestions[currentQuestionIndex]) {
            handleAnswer(null)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestionIndex, gameOver, answeredQuestions])

  const handleAnswer = (option: string | null) => {
    if (answeredQuestions[currentQuestionIndex] || gameOver) return

    const isCorrect = option === currentQuestion.correctAnswer
    const newAnsweredQuestions = [...answeredQuestions]
    newAnsweredQuestions[currentQuestionIndex] = true
    setAnsweredQuestions(newAnsweredQuestions)

    if (isCorrect) {
      // Calculate score based on time left and difficulty
      const difficultyMultiplier =
        currentQuestion.difficulty === "easy" ? 1 : currentQuestion.difficulty === "medium" ? 1.5 : 2

      const timeBonus = Math.floor(timeLeft * difficultyMultiplier)
      const questionScore = 50 + timeBonus

      setScore((prev) => prev + questionScore)
      setCorrectAnswers((prev) => prev + 1)
    }

    setSelectedOption(option)
    setShowResult(true)

    // Move to next question after 2 seconds
    setTimeout(() => {
      setShowResult(false)
      setSelectedOption(null)

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
        setTimeLeft(30)
      } else {
        setGameOver(true)
      }
    }, 2000)
  }

  const handleFinishGame = () => {
    // In a real app, this would save the game session to the backend
    router.push("/")
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "hard":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {!gameOver ? (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{categoryName}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  Score: {score}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <Clock className="h-3 w-3" />
                  {timeLeft}s
                </Badge>
                <Badge className={`${getDifficultyColor(currentQuestion.difficulty)} text-white`}>
                  {currentQuestion.difficulty}
                </Badge>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-6">{currentQuestion.text}</h3>
              <div className="grid gap-3">
                {currentQuestion.options.map((option) => {
                  let optionClass = "border hover:bg-muted"

                  if (showResult) {
                    if (option === currentQuestion.correctAnswer) {
                      optionClass = "border-green-500 bg-green-50 dark:bg-green-900/20"
                    } else if (option === selectedOption) {
                      optionClass = "border-red-500 bg-red-50 dark:bg-red-900/20"
                    }
                  }

                  return (
                    <Button
                      key={option}
                      variant="outline"
                      className={`justify-start h-auto py-3 px-4 font-normal ${optionClass}`}
                      onClick={() => handleAnswer(option)}
                      disabled={showResult}
                    >
                      {option}
                    </Button>
                  )
                })}
              </div>
            </div>
            {showResult && selectedOption !== currentQuestion.correctAnswer && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {selectedOption
                    ? `Incorrect! The correct answer is: ${currentQuestion.correctAnswer}`
                    : `Time's up! The correct answer is: ${currentQuestion.correctAnswer}`}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Game Over!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">{score} points</h3>
              <p className="text-muted-foreground">
                You answered {correctAnswers} out of {questions.length} questions correctly.
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <Button onClick={handleFinishGame}>Finish</Button>
                <Button variant="outline" onClick={() => router.push(`/game/${categoryId}`)}>
                  Play Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

