import React, { useState } from 'react'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')

  const addTask = () => {
    if (!input) return
    setTasks([...tasks, { text: input, done: false }])
    setInput('')
  }

  const toggleTask = (index) => {
    const updated = [...tasks]
    updated[index].done = !updated[index].done
    setTasks(updated)
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h1>Behavior Tools</h1>
      <p>Track habits and build better routines.</p>

      <div style={{ display: 'flex', gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a habit..."
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul style={{ marginTop: 20 }}>
        {tasks.map((task, i) => (
          <li key={i} onClick={() => toggleTask(i)} style={{ cursor: 'pointer', textDecoration: task.done ? 'line-through' : 'none' }}>
            {task.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
