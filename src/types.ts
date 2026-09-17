export type MealSlot = 'breakfast' | 'lunch' | 'dinner'

export interface Meal {
  id: string
  slot: MealSlot
  name: string
  kidNote: string
  recipeId?: string
  note?: string
}

export interface DayPlan {
  date: string
  meals: Meal[]
}

export interface ShopItem {
  id: string
  name: string
  qty: string
  note?: string
}

export interface ShopAisle {
  aisle: string
  items: ShopItem[]
}

export interface Recipe {
  id: string
  name: string
  time: string
  serves: string
  kidNote: string
  tags: string[]
  ingredients: string[]
  steps: string[]
}

export interface MealData {
  family: string
  title: string
  weekOf: string
  through: string
  updatedAt: string
  notes: string
  plan: DayPlan[]
  shopping: ShopAisle[]
  recipes: Recipe[]
}
