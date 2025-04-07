import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryCard } from "@/components/category-card"
import { UserStats } from "@/components/user-stats"
import CategoriesPage from "./categories/page"

export default function Home() {

  return (
    <CategoriesPage/>
  )
}

