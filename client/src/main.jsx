import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import NoteState from './mycontext/NoteState.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <NoteState>
    <App />
  </NoteState>
  // </React.StrictMode>, 
)
