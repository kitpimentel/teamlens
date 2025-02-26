import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState('Loading...')

  useEffect(() => {
    fetch('/api/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        setUsers(data)
        setStatus('Connected to API')
      })
      .catch(error => {
        console.error('Error fetching users:', error)
        setStatus('Error connecting to API')
      })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>Team Lens</h1>
        <p>Backend Status: {status}</p>
        <div>
          <h2>Users</h2>
          {users.length > 0 ? (
            <ul>
              {users.map(user => (
                <li key={user._id}>{user.name} - {user.email}</li>
              ))}
            </ul>
          ) : (
            <p>No users found</p>
          )}
        </div>
      </header>
    </div>
  )
}

export default App