import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { toggleId } from './checkoffs'
import { formatRange, parseIsoDate } from './dates'
import type { MealData } from '../types'
import { validateMealData } from './validateData'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const data = JSON.parse(
  readFileSync(resolve(root, 'public/data.json'), 'utf8'),
) as MealData

describe('Martinez meal data', () => {
  it('is a valid 10-day family plan without tuna', () => {
    expect(validateMealData(data)).toEqual([])
  })

  it('covers Sep 17–26 2026', () => {
    expect(data.weekOf).toBe('2026-09-17')
    expect(data.through).toBe('2026-09-26')
    expect(data.plan[0]?.date).toBe('2026-09-17')
    expect(data.plan.at(-1)?.date).toBe('2026-09-26')
  })

  it('splits breakfast by person with expand details', () => {
    const breakfast = data.plan[0]?.meals.find((meal) => meal.slot === 'breakfast')
    expect(breakfast?.people?.map((person) => person.who)).toEqual([
      'Dad',
      'Mommy',
      'Noa & Olive',
    ])
    expect(breakfast?.people?.[0]?.name).toBe('Egg plate')
    expect(breakfast?.people?.[0]?.detail).toMatch(/cottage cheese/i)
    expect(breakfast?.people?.[1]?.name).toBe("Mommy's eggs")
    expect(breakfast?.people?.[2]?.detail).toMatch(/Olive/i)
  })

  it('includes Casie Pinterest recipes and nice-to-have groceries', () => {
    const names = data.recipes.map((recipe) => recipe.name)
    expect(names).toEqual(expect.arrayContaining([
      'Cottage Cheese Egg Bake',
      'Cottage Cheese Pancakes + berries',
      'Chicken Caprese Pasta Salad',
      'Taco Salad',
      'Mediterranean Chopped Salad',
    ]))
    const shop = data.shopping.flatMap((aisle) => aisle.items.map((item) => item.id))
    expect(shop).toEqual(
      expect.arrayContaining(['spinach', 'rolled-oats', 'lemon', 'red-onion', 'olive-oil']),
    )
  })
})

describe('checkoffs', () => {
  it('toggles ids on and off', () => {
    const once = toggleId({}, 'apples')
    expect(once).toEqual({ apples: true })
    expect(toggleId(once, 'apples')).toEqual({})
  })
})

describe('dates', () => {
  it('formats a same-month range', () => {
    expect(formatRange('2026-09-17', '2026-09-26')).toBe('Sep 17–26')
    expect(parseIsoDate('2026-09-17').getDate()).toBe(17)
  })
})
