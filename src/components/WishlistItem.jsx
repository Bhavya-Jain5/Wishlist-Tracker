const WANT_EMOJIS = { 1: '🙂', 2: '😊', 3: '😍', 4: '🤩', 5: '🥵' }

export default function WishlistItem({ item, isOwn, onDelete, onBought }) {
  function handleClick() {
    if (item.link) window.open(item.link, '_blank', 'noopener')
  }

  return (
    <div className="wishlist-item" onClick={handleClick}>
      <div className="item-image">
        {item.image ? (
          <img src={item.image} alt={item.name} loading="lazy" />
        ) : (
          <div className="item-placeholder">🎁</div>
        )}
      </div>
      <div className="item-info">
        <h3 className="item-name">{item.name}</h3>
        <div className="item-meta">
          {item.price && <span className="item-price">{item.price}</span>}
          <span className="item-want">{WANT_EMOJIS[item.wantScore] || '😍'}</span>
        </div>
      </div>
      <div className="item-actions" onClick={e => e.stopPropagation()}>
        {isOwn ? (
          <button className="btn-icon btn-delete" onClick={() => onDelete(item.id)} title="Remove">
            🗑️
          </button>
        ) : (
          <button className="btn-icon btn-bought" onClick={() => onBought(item)} title="I bought this!">
            🛍️
          </button>
        )}
      </div>
    </div>
  )
}
