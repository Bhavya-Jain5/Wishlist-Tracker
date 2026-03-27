const WANT_EMOJIS = { 1: '🙂', 2: '😊', 3: '😍', 4: '🤩', 5: '🥵' }

export default function RandomGiftModal({ item, onClose }) {
  if (!item) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal random-gift-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎲 Gift Idea!</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="random-gift-content">
          {item.image && (
            <div className="random-gift-image">
              <img src={item.image} alt={item.name} />
            </div>
          )}
          <h3>{item.name}</h3>
          <div className="random-gift-meta">
            {item.price && <span className="item-price">{item.price}</span>}
            <span className="want-badge">
              {WANT_EMOJIS[item.wantScore]} wants it {item.wantScore}/5
            </span>
          </div>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              View Product →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
