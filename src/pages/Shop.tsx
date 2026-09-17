import type { ShopAisle } from '../types'

interface ShopProps {
  aisles: ShopAisle[]
  isChecked: (id: string) => boolean
  onToggle: (id: string) => void
  onReset: () => void
}

export function Shop({ aisles, isChecked, onToggle, onReset }: ShopProps) {
  const items = aisles.flatMap((aisle) => aisle.items)
  const done = items.filter((item) => isChecked(item.id)).length

  return (
    <div className="shop">
      <div className="shop-bar">
        <p className="shop-progress">
          {done} of {items.length} checked
        </p>
        <button type="button" className="text-btn" onClick={onReset}>
          Clear checks
        </button>
      </div>
      {aisles.map((aisle) => (
        <section key={aisle.aisle} className="aisle">
          <h2 className="aisle-title">{aisle.aisle}</h2>
          <ul className="shop-list">
            {aisle.items.map((item) => {
              const checked = isChecked(item.id)
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={checked ? 'shop-item done' : 'shop-item'}
                    onClick={() => onToggle(item.id)}
                    aria-pressed={checked}
                  >
                    <span className="check-dot">{checked ? '✓' : ''}</span>
                    <span className="shop-copy">
                      <span className="shop-name">{item.name}</span>
                      <span className="shop-meta">
                        {item.qty}
                        {item.note ? ` · ${item.note}` : ''}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
