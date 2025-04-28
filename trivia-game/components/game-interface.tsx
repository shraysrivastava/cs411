"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export interface Question {
  question_id: number
  question_text: string
  correct_answer: string
  option1: string
  option2: string
  option3: string
  category_id: number
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
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])

  const [splitUsed, setSplitUsed] = useState(false)
  const [doubleUsed, setDoubleUsed] = useState(false)
  const [isDoubleActive, setIsDoubleActive] = useState(false)

  const [recordedAnswers, setRecordedAnswers] = useState<{ question_id: number, is_correct: number }[]>([])
  const [startTime, setStartTime] = useState<number>(0)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  useEffect(() => {
    if (!currentQuestion) return

    const rawOptions = [
      currentQuestion.correct_answer,
      currentQuestion.option1,
      currentQuestion.option2,
      currentQuestion.option3,
    ]

    const uniqueOptions = Array.from(new Set(rawOptions))
    const shuffled = [...uniqueOptions].sort(() => Math.random() - 0.5)
    setShuffledOptions(shuffled)
  }, [currentQuestionIndex])

  useEffect(() => {
    setStartTime(Date.now())
  }, [])

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

  const handleAnswer = async (option: string | null) => {
    if (answeredQuestions[currentQuestionIndex] || gameOver) return

    const isCorrect = option === currentQuestion.correct_answer
    const newAnsweredQuestions = [...answeredQuestions]
    newAnsweredQuestions[currentQuestionIndex] = true
    setAnsweredQuestions(newAnsweredQuestions)

    setRecordedAnswers(prev => [...prev, {
      question_id: currentQuestion.question_id,
      is_correct: isCorrect ? 1 : 0
    }])

    if (isCorrect) {
      const difficultyMultiplier =
        currentQuestion.difficulty === "easy" ? 1 : currentQuestion.difficulty === "medium" ? 1.5 : 2
      const timeBonus = Math.floor(timeLeft * difficultyMultiplier)
      let questionScore = 50 + timeBonus

      if (isDoubleActive) {
        questionScore *= 2
        setIsDoubleActive(false)
      }

      setScore((prev) => prev + questionScore)
      setCorrectAnswers((prev) => prev + 1)
    }

    setSelectedOption(option)
    setShowResult(true)

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

  const handleDownvote = async () => {
    if (answeredQuestions[currentQuestionIndex] || gameOver) return

    const questionId = currentQuestion.question_id

    await fetch("http://localhost:8080/downvote-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: questionId })
    })

    const newAnsweredQuestions = [...answeredQuestions]
    newAnsweredQuestions[currentQuestionIndex] = true
    setAnsweredQuestions(newAnsweredQuestions)

    setRecordedAnswers(prev => [...prev, {
      question_id: questionId,
      is_correct: 0
    }])

    setSelectedOption(null)
    setShowResult(false)

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
        setTimeLeft(30)
      } else {
        setGameOver(true)
      }
    }, 200)
  }

  const handleFinishGame = async () => {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
    const curr_user = localStorage.getItem("username")
    // const id = await fetch (`http://localhost:8080/get-user?username=${curr_user}`)

    

    const res = await fetch(`http://localhost:8080/get-user?username=${curr_user}`);
    const userData = await res.json();
    const userId = userData.user_id;

    console.log("curr_user from localStorage:", curr_user);
    console.log("userData from get-user API:", userId);

    await fetch("http://localhost:8080/session-complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId, //pranav changes this to current user
        score: score,
        num_correct: correctAnswers,
        attempts: questions.length,
        time_elapsed: timeElapsed,
        answers: recordedAnswers
      })
    })

    router.push("/")
  }

  const handleSplitDat = () => {
    if (splitUsed || gameOver || showResult) return

    const correct = currentQuestion.correct_answer
    const incorrectOptions = shuffledOptions.filter(opt => opt !== correct)
    const randomIncorrect = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)]

    const newOptions = [correct, randomIncorrect].sort(() => Math.random() - 0.5)
    setShuffledOptions(newOptions)
    setSplitUsed(true)
  }

  const handleDoubleDat = () => {
    if (doubleUsed || gameOver || showResult) return

    setIsDoubleActive(true)
    setDoubleUsed(true)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500"
      case "medium": return "bg-yellow-500"
      case "hard": return "bg-red-500"
      default: return "bg-blue-500"
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
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
                <Badge variant="outline" className="text-sm">Score: {score}</Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <Clock className="h-3 w-3" /> {timeLeft}s
                </Badge>
                <Badge className={`${getDifficultyColor(currentQuestion.difficulty)} text-white`}>
                  {currentQuestion.difficulty}
                </Badge>
              </div>
            </div>
            <Progress value={progress} className="h-2 mt-2" />
            <div className="flex gap-2 mt-4">
              <Button variant="secondary" onClick={handleSplitDat} disabled={splitUsed || showResult}>
                Split Dat (50/50)
              </Button>
              <Button variant="secondary" onClick={handleDoubleDat} disabled={doubleUsed || showResult}>
                Double Dat (2x Points)
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center">{currentQuestion.question_text}</h3>

              <div className="grid gap-3">
                {shuffledOptions.map((option) => {
                  let optionClass = "border hover:bg-muted"

                  if (showResult) {
                    if (option === currentQuestion.correct_answer) {
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

              <div className="border-t pt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownvote}
                  disabled={showResult}
                  className="text-red-500 border-red-300 hover:bg-red-100"
                >
                  👎 Downvote
                </Button>
              </div>

              {showResult && selectedOption !== currentQuestion.correct_answer && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {selectedOption
                      ? `Incorrect! The correct answer is: ${currentQuestion.correct_answer}`
                      : `Time's up! The correct answer is: ${currentQuestion.correct_answer}`}
                  </AlertDescription>
                </Alert>
              )}
            </div>
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
