import { useState } from 'react'
import WishlistItem from './WishlistItem'
import AddItemForm from './AddItemForm'
import RandomGiftModal from './RandomGiftModal'
import PurchasedSection from './PurchasedSection'
import { pickWeightedRandom } from '../utils/weightedRandom'

export default function TabView({ user, data, onAddItem, onDeleteItem, onBoughtItem }) {
  const partner = user === 'bhavya' ? 'aastha' : 'bhavya'
  const [activeTab, setActiveTab] = useState(user)
  const [showAddForm, setShowAddForm] = useState(false)
  const [randomGift, setRandomGift] = useState(null)
  const [showPurchased, setShowPurchased] = useState(false)

  const viewingOwn = activeTab === user
  const items = data[activeTab] || []
  const purchasedItems = data.purchased?.[user] || []

  function handlePickRandom() {
    const pick = pickWeightedRandom(items)
    if (pick) setRandomGift(pick)
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  return (
    <div className="tab-view">
      <div className="tabs">
        <button
          className={`tab ${activeTab === user ? 'active' : ''}`}
          onClick={() => setActiveTab(user)}
        >
          {capitalize(user)}
        </button>
        <button
          className={`tab ${activeTab === partner ? 'active' : ''}`}
          onClick={() => setActiveTab(partner)}
        >
          {capitalize(partner)}
        </button>
      </div>

      <div className="tab-actions">
        {viewingOwn ? (
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            + Add to Wishlist
          </button>
        ) : (
          <button
            className="btn btn-secondary"
            onClick={handlePickRandom}
            disabled={items.length === 0}
          >
            🎲 Pick Random Gift
          </button>
        )}
        <button className="btn btn-ghost" onClick={() => setShowPurchased(true)}>
          🛍️ Bought
        </button>
      </div>

      <div className="item-list">
        {items.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">✨</span>
            <p>{viewingOwn ? 'Your wishlist is empty!' : `${capitalize(activeTab)} hasn't added anything yet`}</p>
            {viewingOwn && (
              <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
                Add your first wish
              </button>
            )}
          </div>
        ) : (
          items.map(item => (
            <WishlistItem
              key={item.id}
              item={item}
              isOwn={viewingOwn}
              onDelete={onDeleteItem}
              onBought={onBoughtItem}
            />
          ))
        )}
      </div>

      {showAddForm && (
        <AddItemForm
          onAdd={onAddItem}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {randomGift && (
        <RandomGiftModal
          item={randomGift}
          onClose={() => setRandomGift(null)}
        />
      )}

      {showPurchased && (
        <PurchasedSection
          items={purchasedItems}
          onClose={() => setShowPurchased(false)}
        />
      )}
    </div>
  )
}
