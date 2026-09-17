import type { MealData } from '../types'

const BANNED = /\btuna\b/i

function walkStrings(value: unknown, visit: (text: string) => void): void {
  if (typeof value === 'string') {
    visit(value)
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) walkStrings(item, visit)
    return
  }
  if (value && typeof value === 'object') {
    for (const nested of Object.values(value)) walkStrings(nested, visit)
  }
}

export function validateMealData(data: MealData): string[] {
  const errors: string[] = []

  if (data.plan.length !== 10) {
    errors.push(`Expected 10 plan days, got ${data.plan.length}`)
  }

  walkStrings(data, (text) => {
    const withoutBan = text.replace(/no tuna/gi, '')
    if (BANNED.test(withoutBan)) errors.push(`Found banned food: "${text}"`)
  })

  const recipeIds = new Set(data.recipes.map((recipe) => recipe.id))
  const shopIds = new Set<string>()
  const mealIds = new Set<string>()

  for (const day of data.plan) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day.date)) {
      errors.push(`Invalid date: ${day.date}`)
    }
    if (day.meals.length === 0) {
      errors.push(`${day.date} has no meals`)
    }
    for (const meal of day.meals) {
      if (mealIds.has(meal.id)) errors.push(`Duplicate meal id: ${meal.id}`)
      mealIds.add(meal.id)
      if (!meal.name.trim()) errors.push(`Empty meal name on ${day.date}`)
      if (meal.recipeId && !recipeIds.has(meal.recipeId)) {
        errors.push(`Missing recipe ${meal.recipeId} for ${meal.name}`)
      }
    }
  }

  for (const aisle of data.shopping) {
    if (aisle.items.length === 0) errors.push(`Empty aisle: ${aisle.aisle}`)
    for (const item of aisle.items) {
      if (shopIds.has(item.id)) errors.push(`Duplicate shop id: ${item.id}`)
      shopIds.add(item.id)
    }
  }

  for (const recipe of data.recipes) {
    if (recipe.ingredients.length === 0) {
      errors.push(`Recipe ${recipe.id} has no ingredients`)
    }
    if (recipe.steps.length === 0) {
      errors.push(`Recipe ${recipe.id} has no steps`)
    }
  }

  const kidNotes = data.plan.flatMap((day) => day.meals.map((meal) => meal.kidNote.toLowerCase()))
  const hasPasta = kidNotes.some((note) => note.includes('pasta'))
  const hasFruit = kidNotes.some((note) => note.includes('fruit') || note.includes('apple') || note.includes('berr'))
  const hasNuggets = kidNotes.some((note) => note.includes('nugget'))
  if (!hasPasta) errors.push('Kid notes should include pasta')
  if (!hasFruit) errors.push('Kid notes should include fruit')
  if (!hasNuggets) errors.push('Kid notes should include nuggets')

  return errors
}
