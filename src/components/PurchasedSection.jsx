export default function PurchasedSection({ items, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal purchased-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🛍️ Bought Gifts</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="purchased-list">
          {items.length === 0 ? (
            <p className="empty-text">No gifts bought yet!</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="purchased-item">
                <div className="purchased-item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="item-placeholder small">🎁</div>
                  )}
                </div>
                <div className="purchased-item-info">
                  <span className="purchased-name">{item.name}</span>
                  {item.price && <span className="purchased-price">{item.price}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
