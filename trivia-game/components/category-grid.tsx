import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, BookOpen } from "lucide-react"
import { Category } from "@/app/categories/page"


interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((category) => (
        <Card key={category.category_id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col items-start gap-4">
              <div>
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 px-6 py-3">
            <Button asChild variant="secondary" size="sm" className="w-full">
              <Link href={`/game/${category.category_id}`}>Start Game</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

