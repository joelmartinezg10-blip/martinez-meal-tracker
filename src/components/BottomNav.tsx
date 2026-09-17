export type Tab = 'plan' | 'shop' | 'recipes'

interface BottomNavProps {
  tab: Tab
  onTab: (tab: Tab) => void
}

const ITEMS: { id: Tab; label: string; icon: string }[] = [
  { id: 'plan', label: 'Plan', icon: '📅' },
  { id: 'shop', label: 'Shop', icon: '🛒' },
  { id: 'recipes', label: 'Recipes', icon: '🍽️' },
]

export function BottomNav({ tab, onTab }: BottomNavProps) {
  return (
    <nav className="nav" aria-label="Main">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={tab === item.id ? 'nav-btn active' : 'nav-btn'}
          onClick={() => onTab(item.id)}
          aria-current={tab === item.id ? 'page' : undefined}
        >
          <span className="nav-icon" aria-hidden="true">
            {item.icon}
          </span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}
