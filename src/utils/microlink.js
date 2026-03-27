export async function fetchLinkData(url) {
  try {
    const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`)
    const json = await res.json()
    if (json.status !== 'success') return null
    const { title, image, description } = json.data
    // Try to extract price from description
    let price = null
    if (description) {
      const priceMatch = description.match(/[₹$€£]\s?[\d,]+(?:\.\d{2})?/)
      if (priceMatch) price = priceMatch[0]
    }
    return {
      name: title || '',
      image: image?.url || '',
      price: price || '',
    }
  } catch {
    return null
  }
}
