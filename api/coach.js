const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses'
const DEFAULT_MODEL = 'gpt-5.4-mini'

function summarizeHabits(habits = []) {
  return habits.slice(0, 20).map((habit) => ({
    title: String(habit.title || '').slice(0, 120),
    category: String(habit.category || 'Uncategorized').slice(0, 60),
    streak: Number(habit.streak || 0),
    impact: Number(habit.impact || 0),
    completedDays: Array.isArray(habit.done) ? habit.done.filter(Boolean).length : 0
  }))
}

function extractOutputText(response) {
  if (response.output_text) return response.output_text

  return (response.output || [])
    .flatMap((item) => item.content || [])
    .filter((content) => content.type === 'output_text' && content.text)
    .map((content) => content.text)
    .join('\n')
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      error: 'OpenAI is not configured. Add OPENAI_API_KEY to your Vercel environment variables.'
    })
  }

  try {
    const { habits = [], metrics = {} } = req.body || {}
    const habitSummary = summarizeHabits(habits)

    const openaiResponse = await fetch(OPENAI_RESPONSES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
        max_output_tokens: 280,
        instructions: [
          'You are the AI coach inside Behavior Tools, a habit and routine analytics app.',
          'Give concise, practical coaching based only on the supplied habit data.',
          'Do not make medical, diagnostic, legal, or clinical treatment claims.',
          'Return 2 short observations and 1 specific next action. Keep it under 120 words.'
        ].join(' '),
        input: JSON.stringify({
          weeklyMetrics: {
            consistency: metrics.consistency,
            avgImpact: metrics.avgImpact,
            totalStreaks: metrics.streaks,
            completedActions: metrics.completed
          },
          habits: habitSummary
        })
      })
    })

    const payload = await openaiResponse.json()

    if (!openaiResponse.ok) {
      return res.status(openaiResponse.status).json({
        error: payload.error?.message || 'OpenAI request failed'
      })
    }

    return res.status(200).json({
      note: extractOutputText(payload).trim() || 'No coaching note was generated.'
    })
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unable to generate coaching note' })
  }
}
