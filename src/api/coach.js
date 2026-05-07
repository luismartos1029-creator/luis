export async function generateCoachNote({ habits, metrics }) {
  const response = await fetch('/api/coach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ habits, metrics })
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || 'Unable to generate coaching note')
  }

  if (typeof payload.note !== 'string') {
    throw new Error('AI coach endpoint is not available in this local server. Use Vercel or configure a local API route.')
  }

  return payload.note
}
