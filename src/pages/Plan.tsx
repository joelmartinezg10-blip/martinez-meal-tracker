import { useEffect, useRef, useState } from 'react'
import { formatDayHeading, slotLabel, todayIso } from '../lib/dates'
import type { DayPlan, Meal, PersonPlate } from '../types'

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
                  isChecked={isChecked}
                  onToggle={onToggle}
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
      {meal.kidNote ? <p className="kid-note">{meal.kidNote}</p> : null}
      {meal.note ? <p className="event-note">{meal.note}</p> : null}
    </>
  )
}

function MealEvent({
  meal,
  isChecked,
  onToggle,
  onOpenRecipe,
}: {
  meal: Meal
  isChecked: (id: string) => boolean
  onToggle: (id: string) => void
  onOpenRecipe: (recipeId: string) => void
}) {
  const people = meal.people ?? []
  if (people.length > 0) {
    return (
      <article className="event split" data-slot={meal.slot}>
        <div className="event-body split-body">
          <div className="event-slot">{slotLabel(meal.slot)}</div>
          {meal.note ? <p className="event-note">{meal.note}</p> : null}
          <div className="people">
            {people.map((person) => (
              <PersonRow
                key={person.id}
                mealId={meal.id}
                person={person}
                checked={isChecked(`${meal.id}:${person.id}`)}
                onToggle={() => onToggle(`${meal.id}:${person.id}`)}
                onOpenRecipe={onOpenRecipe}
              />
            ))}
          </div>
        </div>
      </article>
    )
  }

  const checked = isChecked(meal.id)
  return (
    <article className={checked ? 'event done' : 'event'} data-slot={meal.slot}>
      <button
        type="button"
        className="check"
        onClick={() => onToggle(meal.id)}
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

function PersonRow({
  mealId,
  person,
  checked,
  onToggle,
  onOpenRecipe,
}: {
  mealId: string
  person: PersonPlate
  checked: boolean
  onToggle: () => void
  onOpenRecipe: (recipeId: string) => void
}) {
  const [open, setOpen] = useState(false)
  const panelId = `${mealId}-${person.id}-detail`

  return (
    <div className={checked ? 'person done' : 'person'}>
      <div className="person-line">
        <button
          type="button"
          className="check person-check"
          onClick={onToggle}
          aria-pressed={checked}
          aria-label={checked ? `Uncheck ${person.who}` : `Check off ${person.who}`}
        >
          <span className="check-dot">{checked ? '✓' : ''}</span>
        </button>
        <button
          type="button"
          className="person-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="person-copy">
            <span className="person-who">{person.who}</span>
            <span className="person-name">{person.name}</span>
          </span>
          <span className="person-chevron" aria-hidden="true">
            {open ? '▾' : '▸'}
          </span>
        </button>
      </div>
      {open ? (
        <div className="person-detail" id={panelId}>
          <p>{person.detail}</p>
          {person.recipeId ? (
            <button
              type="button"
              className="text-btn"
              onClick={() => {
                if (person.recipeId) onOpenRecipe(person.recipeId)
              }}
            >
              Open recipe
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
