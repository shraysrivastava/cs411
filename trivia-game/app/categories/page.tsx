"use client"

import type { Metadata } from "next"
import { useEffect, useState } from "react"
import { CategoryGrid } from "@/components/category-grid"


export interface Category {
  category_id: number
  name: string
  description?: string
}

const fallbackCategories: Category[] = [
  { category_id: 1, name: "Sports", description: "Questions about various sports and athletes"},
  { category_id: 2, name: "Music", description: "Test your knowledge of songs, artists, and albums"},
  { category_id: 3, name: "Movies", description: "Questions about films, directors, and actors"},
  { category_id: 4, name: "Science", description: "Explore the world of scientific discoveries"},
  { category_id: 5, name: "History", description: "Test your knowledge of historical events" },
  { category_id: 6, name: "Geography", description: "Questions about countries, capitals, and landmarks"},
  { category_id: 7, name: "Literature", description: "Explore famous books and authors" },
  {
    category_id: 8,
    name: "Technology",
    description: "Questions about gadgets, software, and tech companies"
  },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8080/get-categories")
        if (!res.ok) throw new Error("failed to fetch")

        const data: Category[] = await res.json()
        setCategories(data)
      } catch (error) {
        console.error("fetch failed, using fallback categories:", error)
        setCategories(fallbackCategories)
      }
    }

    fetchCategories()
  }, [])

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
