import { useState, useRef } from 'react'

export default function PinScreen({ pins, onLogin }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [shaking, setShaking] = useState(false)
  const inputRef = useRef(null)

  function tryLogin(value) {
    const entry = Object.entries(pins).find(([, p]) => p === value)
    if (entry) {
      onLogin(entry[0])
    } else {
      setError('Wrong PIN')
      setShaking(true)
      setTimeout(() => {
        setShaking(false)
        setPin('')
        inputRef.current?.focus()
      }, 500)
    }
  }

  function handleChange(e) {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
    setPin(value)
    setError('')
    if (value.length === 4) {
      tryLogin(value)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (pin.length === 4) tryLogin(pin)
  }

  const dots = Array.from({ length: 4 }, (_, i) => (
    <div key={i} className={`pin-dot ${i < pin.length ? 'filled' : ''}`} />
  ))

  return (
    <div className="pin-screen" onClick={() => inputRef.current?.focus()}>
      <div className="pin-content">
        <div className="pin-icon">🎁</div>
        <h1>Wishlist</h1>
        <p className="pin-subtitle">Enter your PIN</p>
        <form onSubmit={handleSubmit}>
          <div className={`pin-dots ${shaking ? 'shake' : ''}`}>
            {dots}
          </div>
          <input
            ref={inputRef}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={pin}
            onChange={handleChange}
            className="pin-hidden-input"
            autoFocus
          />
        </form>
        {error && <p className="pin-error">{error}</p>}
        <p className="pin-hint">Tap anywhere to type</p>
      </div>
    </div>
  )
}
