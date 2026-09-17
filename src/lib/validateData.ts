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
      if (meal.slot === 'breakfast') {
        const people = meal.people ?? []
        if (people.length < 3) {
          errors.push(`${meal.id} must split breakfast by person`)
        }
        const whos = people.map((person) => person.who)
        if (!whos.includes('Dad')) errors.push(`${meal.id} missing Dad`)
        if (!whos.includes('Mommy')) errors.push(`${meal.id} missing Mommy`)
        if (!whos.some((who) => who.includes('Noa') && who.includes('Olive'))) {
          errors.push(`${meal.id} missing Noa & Olive`)
        }
        for (const person of people) {
          if (!person.name.trim() || !person.detail.trim()) {
            errors.push(`${meal.id} person ${person.id} needs name and detail`)
          }
          if (person.recipeId && !recipeIds.has(person.recipeId)) {
            errors.push(`Missing recipe ${person.recipeId} for ${person.who}`)
          }
        }
      }
    }
  }

  const breakfastCount = data.plan.filter((day) =>
    day.meals.some((meal) => meal.slot === 'breakfast'),
  ).length
  if (breakfastCount !== 10) {
    errors.push(`Expected breakfast on all 10 days, got ${breakfastCount}`)
  }

  for (const id of [
    'cottage-cheese-egg-bake',
    'cottage-cheese-pancakes',
    'chicken-caprese-pasta-salad',
    'taco-salad',
    'mediterranean-chopped-salad',
  ]) {
    if (!recipeIds.has(id)) errors.push(`Missing Casie recipe: ${id}`)
  }

  for (const aisle of data.shopping) {
    if (aisle.items.length === 0) errors.push(`Empty aisle: ${aisle.aisle}`)
    for (const item of aisle.items) {
      if (shopIds.has(item.id)) errors.push(`Duplicate shop id: ${item.id}`)
      shopIds.add(item.id)
    }
  }

  for (const id of ['spinach', 'rolled-oats', 'lemon', 'red-onion', 'olive-oil']) {
    if (!shopIds.has(id)) errors.push(`Missing nice-to-have shop item: ${id}`)
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
