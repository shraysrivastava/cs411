import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, BookOpen } from "lucide-react"

interface CategoryCardProps {
  category: {
    id: number
    name: string
    description: string
    questionCount: number
  }
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-2">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{category.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <BookOpen className="h-3 w-3" />
              <span>{category.questionCount} possible questions</span>
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
  )
}

