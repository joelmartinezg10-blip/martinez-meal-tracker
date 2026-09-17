import type { Recipe } from '../types'

interface RecipesProps {
  recipes: Recipe[]
  onOpen: (id: string) => void
}

export function Recipes({ recipes, onOpen }: RecipesProps) {
  return (
    <div className="recipes">
      {recipes.map((recipe) => (
        <button
          key={recipe.id}
          type="button"
          className="recipe-card"
          onClick={() => onOpen(recipe.id)}
        >
          <div className="recipe-meta">
            {recipe.time} · {recipe.serves}
          </div>
          <h2 className="recipe-name">{recipe.name}</h2>
          <p className="kid-note">{recipe.kidNote}</p>
        </button>
      ))}
    </div>
  )
}

interface RecipeDetailProps {
  recipe: Recipe
  onBack: () => void
}

export function RecipeDetail({ recipe, onBack }: RecipeDetailProps) {
  return (
    <article className="recipe-detail">
      <button type="button" className="back" onClick={onBack}>
        ← Recipes
      </button>
      <p className="recipe-meta">
        {recipe.time} · {recipe.serves}
      </p>
      <h1 className="recipe-title">{recipe.name}</h1>
      <p className="kid-note">{recipe.kidNote}</p>
      <ul className="tag-row">
        {recipe.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <h2>Ingredients</h2>
      <ul className="plain-list">
        {recipe.ingredients.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <h2>Steps</h2>
      <ol className="steps">
        {recipe.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </article>
  )
}
