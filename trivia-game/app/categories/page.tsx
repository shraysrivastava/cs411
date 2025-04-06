import type { Metadata } from "next"
import { CategoryGrid } from "@/components/category-grid"

export const metadata: Metadata = {
  title: "Categories - Trivia Master",
  description: "Browse trivia categories",
}

export default function CategoriesPage() {
  // This would normally be fetched from the backend
  const categories = [
    { id: 1, name: "Sports", description: "Questions about various sports and athletes", questionCount: 25 },
    { id: 2, name: "Music", description: "Test your knowledge of songs, artists, and albums", questionCount: 30 },
    { id: 3, name: "Movies", description: "Questions about films, directors, and actors", questionCount: 40 },
    { id: 4, name: "Science", description: "Explore the world of scientific discoveries", questionCount: 20 },
    { id: 5, name: "History", description: "Test your knowledge of historical events", questionCount: 35 },
    { id: 6, name: "Geography", description: "Questions about countries, capitals, and landmarks", questionCount: 28 },
    { id: 7, name: "Literature", description: "Explore famous books and authors", questionCount: 22 },
    {
      id: 8,
      name: "Technology",
      description: "Questions about gadgets, software, and tech companies",
      questionCount: 18,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      <p className="text-muted-foreground mb-8">
        Choose a category to start a new game. Each category contains different questions with varying difficulty
        levels.
      </p>
      <CategoryGrid categories={categories} />
    </div>
  )
}

