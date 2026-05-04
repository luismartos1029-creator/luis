import React, { useEffect, useMemo, useState } from 'react'
import './styles.css'

const initialHabits = [
  { id: 1, title: 'Morning planning ritual', category: 'Focus', streak: 12, impact: 92, done: [true, true, true, true, false, true, true] },
  { id: 2, title: 'Evening reflection note', category: 'Mindset', streak: 8, impact: 81, done: [true, false, true, true, true, false, true] },
  { id: 3, title: 'Workout or long walk', category: 'Health', streak: 5, impact: 76, done: [false, true, true, true, false, true, false] }
]

const plans = [
  ['Starter', '$0', '3 habits', 'Weekly tracking', 'Local browser save'],
  ['Pro', '$9', 'Unlimited habits', 'AI coaching prompts', 'Analytics dashboard'],
  ['Team', '$29', 'Shared behavior boards', 'Manager insights', 'Priority support']
]

function makeCoachNote(habits) {
  const best = habits.slice().sort((a, b) => b.done.filter(Boolean).length - a.done.filter(Boolean).length)[0]
  const weak = habits.slice().sort((a, b) => a.done.filter(Boolean).length - b.done.filter(Boolean).length)[0]
  if (!habits.length) return 'Create your first behavior to unlock a weekly coaching summary.'
  return `Your strongest pattern is ${best.title}. Protect it by anchoring it to the same time daily. Your biggest opportunity is ${weak.title}; shrink it to a two-minute version for the next 48 hours.`
}

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('bt-user') || 'null'))
  const [email, setEmail] = useState('founder@behaviortools.app')
  const [habits, setHabits] = useState(() => JSON.parse(localStorage.getItem('bt-saas-habits') || 'null') || initialHabits)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Focus')
  const [view, setView] = useState('dashboard')

  useEffect(() => localStorage.setItem('bt-saas-habits', JSON.stringify(habits)), [habits])
  useEffect(() => localStorage.setItem('bt-user', JSON.stringify(user)), [user])

  const metrics = useMemo(() => {
    const completed = habits.reduce((sum, habit) => sum + habit.done.filter(Boolean).length, 0)
    const possible = habits.length * 7 || 1
    const consistency = Math.round((completed / possible) * 100)
    const avgImpact = Math.round(habits.reduce((sum, habit) => sum + habit.impact, 0) / (habits.length || 1))
    const streaks = habits.reduce((sum, habit) => sum + habit.streak, 0)
    return { completed, consistency, avgImpact, streaks }
  }, [habits])

  const addHabit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setHabits([{ id: Date.now(), title: title.trim(), category, streak: 1, impact: 70, done: [false, false, false, false, false, false, false] }, ...habits])
    setTitle('')
  }

  const toggle = (id, index) => {
    setHabits(habits.map(habit => {
      if (habit.id !== id) return habit
      const done = [...habit.done]
      done[index] = !done[index]
      return { ...habit, done, streak: Math.max(0, habit.streak + (done[index] ? 1 : -1)) }
    }))
  }

  const remove = (id) => setHabits(habits.filter(habit => habit.id !== id))

  if (!user) {
    return <main className="auth-page"><section className="auth-card"><p className="eyebrow">Behavior Tools Cloud</p><h1>Sign in to your behavior workspace.</h1><p>Demo auth is wired locally. Connect Supabase/Firebase next for production accounts.</p><input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" /><button className="primary" onClick={() => setUser({ email, plan: 'Pro Trial' })}>Continue</button></section></main>
  }

  return (
    <div className="product">
      <aside className="sidebar">
        <div className="brand"><span>BT</span><div><strong>Behavior Tools</strong><small>{user.plan}</small></div></div>
        {['dashboard', 'habits', 'ai coach', 'billing'].map(item => <button key={item} onClick={() => setView(item)} className={view === item ? 'nav active' : 'nav'}>{item}</button>)}
        <div className="upgrade-box"><b>Cloud workspace</b><p>Auth, API and database hooks are scaffolded for production setup.</p><button onClick={() => setView('billing')}>Upgrade</button></div>
      </aside>

      <main className="workspace">
        <header className="topbar"><div><p className="eyebrow">Welcome, {user.email}</p><h1>Behavior analytics for better routines.</h1></div><button className="ghost-btn" onClick={() => setUser(null)}>Sign out</button></header>

        <section className="metric-grid">
          <article><span>Consistency</span><strong>{metrics.consistency}%</strong><p>weekly completion</p></article>
          <article><span>Impact score</span><strong>{metrics.avgImpact}</strong><p>habit quality index</p></article>
          <article><span>Total streaks</span><strong>{metrics.streaks}</strong><p>days compounded</p></article>
          <article><span>Actions</span><strong>{metrics.completed}</strong><p>logged this week</p></article>
        </section>

        <section className="content-grid">
          <div className="card large"><div className="card-head"><div><h2>Behavior board</h2><p>Real data model, currently saved locally until backend keys are connected.</p></div></div>{habits.map(habit => <div className="habit-row" key={habit.id}><div><b>{habit.title}</b><span>{habit.category} · {habit.streak} day streak</span></div><div className="days">{['M','T','W','T','F','S','S'].map((d,i)=><button key={i} onClick={() => toggle(habit.id, i)} className={habit.done[i] ? 'dot on' : 'dot'}>{d}</button>)}</div><button className="remove" onClick={() => remove(habit.id)}>×</button></div>)}</div>
          <div className="card"><h2>Add behavior</h2><form onSubmit={addHabit} className="stacked-form"><input value={title} onChange={e => setTitle(e.target.value)} placeholder="New behavior" /><select value={category} onChange={e => setCategory(e.target.value)}><option>Focus</option><option>Health</option><option>Mindset</option><option>Sales</option><option>Learning</option></select><button className="primary">Create</button></form></div>
          <div className="card ai-card"><h2>AI coach</h2><p>{makeCoachNote(habits)}</p><button className="primary">Generate weekly review</button></div>
        </section>

        <section className="pricing">{plans.map(plan => <article key={plan[0]} className="price-card"><h3>{plan[0]}</h3><strong>{plan[1]}<small>/mo</small></strong>{plan.slice(2).map(feature => <p key={feature}>✓ {feature}</p>)}<button>{plan[0] === 'Pro' ? 'Choose Pro' : 'Select'}</button></article>)}</section>
      </main>
    </div>
  )
}
