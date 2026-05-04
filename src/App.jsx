import React, { useEffect, useMemo, useState } from 'react'
import './styles.css'

const starterHabits = [
  { id: 1, name: 'Morning focus session', area: 'Productivity', target: 5, done: [true, true, false, true, true, false, true] },
  { id: 2, name: '10 minute reflection', area: 'Mindset', target: 4, done: [true, false, true, true, false, true, false] },
  { id: 3, name: 'Move your body', area: 'Health', target: 6, done: [true, true, true, false, true, true, false] }
]

export default function App() {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('behavior-tools-habits')
    return saved ? JSON.parse(saved) : starterHabits
  })
  const [name, setName] = useState('')
  const [area, setArea] = useState('Productivity')

  useEffect(() => {
    localStorage.setItem('behavior-tools-habits', JSON.stringify(habits))
  }, [habits])

  const stats = useMemo(() => {
    const totalChecks = habits.reduce((sum, habit) => sum + habit.done.filter(Boolean).length, 0)
    const possible = habits.length * 7 || 1
    const score = Math.round((totalChecks / possible) * 100)
    const activeToday = habits.filter((habit) => habit.done[6]).length
    return { totalChecks, score, activeToday }
  }, [habits])

  const addHabit = (event) => {
    event.preventDefault()
    if (!name.trim()) return
    setHabits([
      ...habits,
      {
        id: Date.now(),
        name: name.trim(),
        area,
        target: 5,
        done: [false, false, false, false, false, false, false]
      }
    ])
    setName('')
  }

  const toggleDay = (habitId, dayIndex) => {
    setHabits(habits.map((habit) => {
      if (habit.id !== habitId) return habit
      const done = [...habit.done]
      done[dayIndex] = !done[dayIndex]
      return { ...habit, done }
    }))
  }

  const deleteHabit = (habitId) => {
    setHabits(habits.filter((habit) => habit.id !== habitId))
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Behavior Tools</p>
          <h1>Build better patterns, one week at a time.</h1>
          <p className="hero-copy">Track habits, review your behavior, and turn small actions into consistent routines.</p>
        </div>
        <div className="score-card">
          <span>Weekly score</span>
          <strong>{stats.score}%</strong>
          <p>{stats.totalChecks} completed actions this week</p>
        </div>
      </section>

      <section className="stats-grid">
        <article><span>Active habits</span><strong>{habits.length}</strong></article>
        <article><span>Done today</span><strong>{stats.activeToday}</strong></article>
        <article><span>Focus level</span><strong>{stats.score >= 70 ? 'Strong' : stats.score >= 40 ? 'Building' : 'Starting'}</strong></article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Add a behavior</h2>
            <p>Create a habit and mark progress across the week.</p>
          </div>
        </div>
        <form className="habit-form" onSubmit={addHabit}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Example: Drink water before coffee" />
          <select value={area} onChange={(e) => setArea(e.target.value)}>
            <option>Productivity</option>
            <option>Health</option>
            <option>Mindset</option>
            <option>Relationships</option>
            <option>Learning</option>
          </select>
          <button type="submit">Add habit</button>
        </form>
      </section>

      <section className="habits-list">
        {habits.map((habit) => {
          const complete = habit.done.filter(Boolean).length
          return (
            <article className="habit-card" key={habit.id}>
              <div className="habit-top">
                <div>
                  <span className="tag">{habit.area}</span>
                  <h3>{habit.name}</h3>
                  <p>{complete}/7 days completed</p>
                </div>
                <button className="ghost" onClick={() => deleteHabit(habit.id)}>Remove</button>
              </div>
              <div className="week-row">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                  <button
                    key={`${habit.id}-${day}-${index}`}
                    className={habit.done[index] ? 'day done' : 'day'}
                    onClick={() => toggleDay(habit.id, index)}
                    aria-label={`Toggle ${day}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}
