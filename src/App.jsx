import { useState, useEffect, useCallback } from 'react'
import PinScreen from './components/PinScreen'
import TabView from './components/TabView'
import { getData, saveData } from './utils/firebase'

const STORAGE_KEY = 'wishlist-user'

export default function App() {
  const [user, setUser] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [syncing, setSyncing] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const d = await getData()
      setData(d)
      setError(null)
    } catch (err) {
      setError('Could not load data. Check your connection.')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setUser(saved)
    loadData()
  }, [loadData])

  function handleLogin(name) {
    localStorage.setItem(STORAGE_KEY, name)
    setUser(name)
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  async function updateData(newData) {
    setData(newData)
    setSyncing(true)
    try {
      await saveData(newData)
    } catch {
      setError('Failed to sync. Your changes may not be saved.')
    }
    setSyncing(false)
  }

  async function handleAddItem(item) {
    const newData = { ...data, [user]: [...(data[user] || []), item] }
    await updateData(newData)
  }

  async function handleDeleteItem(itemId) {
    const newData = {
      ...data,
      [user]: (data[user] || []).filter(i => i.id !== itemId),
    }
    await updateData(newData)
  }

  async function handleBoughtItem(item) {
    const partner = user === 'bhavya' ? 'aastha' : 'bhavya'
    const newData = {
      ...data,
      [partner]: (data[partner] || []).filter(i => i.id !== item.id),
      purchased: {
        ...data.purchased,
        [user]: [...(data.purchased?.[user] || []), { ...item, boughtAt: new Date().toISOString() }],
      },
    }
    await updateData(newData)
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader" />
        <p>Loading wishlist...</p>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="error-screen">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadData}>Retry</button>
      </div>
    )
  }

  if (!user || !data?.pins) {
    return data?.pins ? (
      <PinScreen pins={data.pins} onLogin={handleLogin} />
    ) : (
      <div className="loading-screen">
        <div className="loader" />
      </div>
    )
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🎁 Wishlist</h1>
        <div className="header-right">
          {syncing && <span className="sync-badge">Syncing...</span>}
          <button className="btn btn-ghost logout-btn" onClick={handleLogout}>
            Not {capitalize(user)}?
          </button>
        </div>
      </header>
      {error && <div className="error-banner">{error}</div>}
      <TabView
        user={user}
        data={data}
        onAddItem={handleAddItem}
        onDeleteItem={handleDeleteItem}
        onBoughtItem={handleBoughtItem}
      />
    </div>
  )
}
