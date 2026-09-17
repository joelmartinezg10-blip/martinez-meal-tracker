import { useMemo, useState } from 'react'
import { BottomNav, type Tab } from './components/BottomNav'
import { useCheckoffs } from './hooks/useCheckoffs'
import { useMealData } from './hooks/useMealData'
import { formatRange } from './lib/dates'
import { Plan } from './pages/Plan'
import { RecipeDetail, Recipes } from './pages/Recipes'
import { Shop } from './pages/Shop'
import type { MealData } from './types'

export default function App() {
  const { data, error, loading } = useMealData()

  if (loading) {
    return (
      <div className="shell">
        <p className="status">Loading this week of meals…</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="shell">
        <p className="status">Could not load public/data.json. {error}</p>
      </div>
    )
  }

  return <LoadedApp key={data.weekOf} data={data} />
}

function LoadedApp({ data }: { data: MealData }) {
  const { isChecked, toggle, clearIds } = useCheckoffs(data.weekOf)
  const [tab, setTab] = useState<Tab>('plan')
  const [recipeId, setRecipeId] = useState<string | null>(null)

  const recipe = useMemo(
    () => data.recipes.find((item) => item.id === recipeId) ?? null,
    [data, recipeId],
  )

  const shopIds = useMemo(
    () => data.shopping.flatMap((aisle) => aisle.items.map((item) => item.id)),
    [data],
  )

  return (
    <div className="shell">
      <header className="top">
        <p className="kicker">{data.family} family</p>
        <h1>{data.title}</h1>
        <p className="range">{formatRange(data.weekOf, data.through)}</p>
      </header>

      <main className="main">
        {recipe ? (
          <RecipeDetail recipe={recipe} onBack={() => setRecipeId(null)} />
        ) : null}
        {!recipe && tab === 'plan' ? (
          <Plan
            days={data.plan}
            isChecked={isChecked}
            onToggle={toggle}
            onOpenRecipe={setRecipeId}
          />
        ) : null}
        {!recipe && tab === 'shop' ? (
          <Shop
            aisles={data.shopping}
            isChecked={isChecked}
            onToggle={toggle}
            onReset={() => clearIds(shopIds)}
          />
        ) : null}
        {!recipe && tab === 'recipes' ? (
          <Recipes recipes={data.recipes} onOpen={setRecipeId} />
        ) : null}
      </main>

      {recipe ? null : (
        <BottomNav
          tab={tab}
          onTab={(next) => {
            setRecipeId(null)
            setTab(next)
          }}
        />
      )}
    </div>
  )
}
