import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, BookOpen } from "lucide-react"

interface Category {
  id: number
  name: string
  description: string
  questionCount: number
}

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((category) => (
        <Card key={category.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3" />
                  <span>{category.questionCount} questions</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 px-6 py-3">
            <Button asChild variant="secondary" size="sm" className="w-full">
              <Link href={`/game/${category.id}`}>Start Game</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

