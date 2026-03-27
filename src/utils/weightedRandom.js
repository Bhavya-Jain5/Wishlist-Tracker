export function pickWeightedRandom(items) {
  if (!items.length) return null
  const totalWeight = items.reduce((sum, item) => sum + (item.wantScore || 1), 0)
  let random = Math.random() * totalWeight
  for (const item of items) {
    random -= item.wantScore || 1
    if (random <= 0) return item
  }
  return items[items.length - 1]
}
