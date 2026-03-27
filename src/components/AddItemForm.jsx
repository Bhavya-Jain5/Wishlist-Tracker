import { useState } from 'react'
import { fetchLinkData } from '../utils/microlink'

const WANT_LABELS = {
  1: { emoji: '🙂', text: 'would be nice' },
  2: { emoji: '😊', text: 'want it' },
  3: { emoji: '😍', text: 'really want' },
  4: { emoji: '🤩', text: 'need it' },
  5: { emoji: '🥵', text: 'OBSESSED' },
}

export default function AddItemForm({ onAdd, onClose, editItem }) {
  const [link, setLink] = useState(editItem?.link || '')
  const [name, setName] = useState(editItem?.name || '')
  const [image, setImage] = useState(editItem?.image || '')
  const [price, setPrice] = useState(editItem?.price || '')
  const [wantScore, setWantScore] = useState(editItem?.wantScore || 3)
  const [fetching, setFetching] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const isEditing = !!editItem

  async function handleLinkPaste(value) {
    setLink(value)
    if (!value.startsWith('http')) return
    setFetching(true)
    const data = await fetchLinkData(value)
    setFetching(false)
    if (data) {
      if (data.name && !name) setName(data.name)
      if (data.image && !image) setImage(data.image)
      if (data.price && !price) setPrice(data.price)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    await onAdd({
      id: editItem?.id || crypto.randomUUID(),
      name: name.trim(),
      link: link.trim() || null,
      image: image.trim() || null,
      price: price.trim() || null,
      wantScore,
      addedAt: editItem?.addedAt || new Date().toISOString(),
    })
    setSubmitting(false)
    onClose()
  }

  const want = WANT_LABELS[wantScore]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal add-form" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Item' : 'Add to Wishlist'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Link (optional)</label>
            <input
              type="url"
              placeholder="Paste a product URL..."
              value={link}
              onChange={e => handleLinkPaste(e.target.value)}
            />
            {fetching && <span className="fetch-status">Fetching details...</span>}
          </div>
          <div className="field">
            <label>Name *</label>
            <input
              type="text"
              placeholder="What do you want?"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Image URL (optional)</label>
            <input
              type="url"
              placeholder="Image link..."
              value={image}
              onChange={e => setImage(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Price (optional)</label>
            <input
              type="text"
              placeholder="₹0"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </div>
          <div className="field want-field">
            <label>How much do you want it?</label>
            <input
              type="range"
              min="1"
              max="5"
              value={wantScore}
              onChange={e => setWantScore(Number(e.target.value))}
            />
            <div className="want-display">
              <span className="want-emoji">{want.emoji}</span>
              <span className="want-text">{want.text}</span>
            </div>
          </div>
          <button type="submit" className="btn btn-primary submit-btn" disabled={!name.trim() || submitting}>
            {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add to Wishlist'}
          </button>
        </form>
      </div>
    </div>
  )
}
