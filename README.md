# Martinez Meals

Phone-first meal plan, shopping list, and recipes for the Martinez family.

The app is a static Vite + React + TypeScript site. **All weekly content lives in one file:** [`public/data.json`](public/data.json). Checkoffs (cooked meals and grocery items) stay on the phone in `localStorage`, keyed to the plan’s `weekOf` date so a new week starts clean.

## Use it on a phone

1. Open the site and add it to the Home Screen (Share → Add to Home Screen).
2. **Plan** looks like a phone calendar: big food names, tiny kid notes. Breakfast is split by person (Dad, Mommy, Noa & Olive) — tap a row to expand the plate details.
3. Tap the circle to check off a cooked meal (or a breakfast plate). Tap a dinner name to open the recipe.
4. **Shop** is aisle groups with the same checkoffs. **Clear checks** only clears groceries, not cooked meals.
5. **Recipes** include weeknight dinners plus Casie’s Costco-aligned Pinterest plates.

Kids default to pasta, fruit, or nuggets. There is no tuna in the plan, list, or recipes.

## Weekly JSON update path

Each week, replace the plan in `public/data.json` and push. You do not need to change React code.

1. Copy `public/data.json` (or edit it in place).
2. Set `weekOf` to the first day (`YYYY-MM-DD`) and `through` to the last day.
3. Fill `plan` (usually 10 days). Every meal needs a unique `id` (use `{date}-{slot}`).
4. Put a **big food name** in `name` and a **tiny kid note** in `kidNote` (`kids: pasta + fruit`).
5. Breakfast is **not** one bunched meal. Add a `people` array (Dad, Mommy, Noa & Olive) with `who`, `name`, and tap-to-expand `detail`.
6. Point dinners at a `recipeId` that exists in `recipes`.
7. Rebuild `shopping` by aisle. Keep item `id`s stable during the week so in-progress checkoffs still match. New `weekOf` → new checkoff bucket. Keep nice-to-haves: spinach, rolled oats, lemons, red onion, olive oil if out.
8. Keep recipes practical: ingredients + steps, plus the kid plate.
9. Commit and push to `main`. GitHub Pages publishes `/data.json` with the rest of the site.

Do not put tuna anywhere in the JSON. Keep kid fallbacks to pasta, fruit, or nuggets.

### `data.json` shape

```json
{
  "family": "Martinez",
  "title": "Martinez Meals",
  "weekOf": "2026-09-17",
  "through": "2026-09-26",
  "updatedAt": "2026-09-17",
  "notes": "No tuna. Kids: pasta / fruit / nuggets.",
  "plan": [
    {
      "date": "2026-09-17",
      "meals": [
        {
          "id": "2026-09-17-breakfast",
          "slot": "breakfast",
          "name": "Breakfast",
          "kidNote": "Noa & Olive: fruit + toast; Olive soft pieces",
          "people": [
            {
              "id": "dad",
              "who": "Dad",
              "name": "Egg plate",
              "detail": "1 whole egg + 2 egg whites with peppers + 1 serving cottage cheese"
            },
            {
              "id": "mommy",
              "who": "Mommy",
              "name": "Mommy's eggs",
              "detail": "Placeholder until Casie's exact plate is known"
            },
            {
              "id": "noa-olive",
              "who": "Noa & Olive",
              "name": "Egg scramble",
              "detail": "1 scrambled egg each with a little cheese, fruit, and toast. Olive: soft pieces."
            }
          ]
        },
        {
          "id": "2026-09-17-dinner",
          "slot": "dinner",
          "name": "Chicken fajitas",
          "kidNote": "kids: pasta + fruit",
          "recipeId": "chicken-fajitas"
        }
      ]
    }
  ],
  "shopping": [
    {
      "aisle": "Produce",
      "items": [{ "id": "apples", "name": "Apples", "qty": "8", "note": "kids" }]
    }
  ],
  "recipes": [
    {
      "id": "chicken-fajitas",
      "name": "Chicken fajitas",
      "time": "35 min",
      "serves": "4 + kids plate",
      "kidNote": "kids: buttered pasta + fruit",
      "tags": ["weeknight"],
      "ingredients": ["chicken thighs", "peppers"],
      "steps": ["Sear chicken.", "Char peppers."]
    }
  ]
}
```

## Local dev

```bash
npm install
npm run dev
```

Phone-sized layout is easiest in Chrome DevTools device mode (390×844).

```bash
npm test
npm run build
npm run preview
```

## Deploy

GitHub Pages is set up via `.github/workflows/pages.yml`. After Pages is enabled on the repo (Settings → Pages → GitHub Actions), every push to `main` publishes:

`https://joelmartinezg10-blip.github.io/martinez-meal-tracker/`

The workflow sets `GITHUB_PAGES=true` so the app is built with that base path.
