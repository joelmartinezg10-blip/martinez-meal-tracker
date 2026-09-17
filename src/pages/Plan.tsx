import { useEffect, useRef } from 'react'
import { formatDayHeading, slotLabel, todayIso } from '../lib/dates'
import type { DayPlan, Meal } from '../types'

interface PlanProps {
  days: DayPlan[]
  isChecked: (id: string) => boolean
  onToggle: (id: string) => void
  onOpenRecipe: (recipeId: string) => void
}

export function Plan({ days, isChecked, onToggle, onOpenRecipe }: PlanProps) {
  const today = todayIso()
  const todayRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    todayRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [])

  return (
    <div className="plan">
      {days.map((day) => {
        const heading = formatDayHeading(day.date)
        const isToday = day.date === today
        return (
          <section
            key={day.date}
            className={isToday ? 'day today' : 'day'}
            ref={isToday ? todayRef : undefined}
            aria-current={isToday ? 'date' : undefined}
          >
            <header className="day-head">
              <div>
                <div className="day-week">{heading.weekday}</div>
                <div className="day-num">{heading.monthDay}</div>
              </div>
              {isToday ? <span className="today-pill">Today</span> : null}
            </header>
            <div className="events">
              {day.meals.map((meal) => (
                <MealEvent
                  key={meal.id}
                  meal={meal}
                  checked={isChecked(meal.id)}
                  onToggle={() => onToggle(meal.id)}
                  onOpenRecipe={onOpenRecipe}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function MealCopy({ meal }: { meal: Meal }) {
  return (
    <>
      <div className="event-slot">{slotLabel(meal.slot)}</div>
      <h2 className="event-name">{meal.name}</h2>
      <p className="kid-note">{meal.kidNote}</p>
      {meal.note ? <p className="event-note">{meal.note}</p> : null}
    </>
  )
}

function MealEvent({
  meal,
  checked,
  onToggle,
  onOpenRecipe,
}: {
  meal: Meal
  checked: boolean
  onToggle: () => void
  onOpenRecipe: (recipeId: string) => void
}) {
  return (
    <article className={checked ? 'event done' : 'event'} data-slot={meal.slot}>
      <button
        type="button"
        className="check"
        onClick={onToggle}
        aria-pressed={checked}
        aria-label={checked ? `Uncheck ${meal.name}` : `Check off ${meal.name}`}
      >
        <span className="check-dot">{checked ? '✓' : ''}</span>
      </button>
      {meal.recipeId ? (
        <button
          type="button"
          className="event-body"
          onClick={() => {
            if (meal.recipeId) onOpenRecipe(meal.recipeId)
          }}
        >
          <MealCopy meal={meal} />
        </button>
      ) : (
        <div className="event-body">
          <MealCopy meal={meal} />
        </div>
      )}
    </article>
  )
}
