import React, { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import BooksPage from './pages/BooksPage'
import LoansPage from './pages/LoansPage'
// informational pages removed to keep UI minimal for exam

export default function App() {
  const [theme, setTheme] = useState<string>(() => {
    try { return localStorage.getItem('theme') ?? 'theme-default' } catch { return 'theme-default' }
  })

  useEffect(() => {
    const root = document.documentElement
    // remove any theme- class currently present
    Array.from(root.classList).filter(c => c.startsWith('theme-')).forEach(c => root.classList.remove(c))
    root.classList.add(theme)
    try { localStorage.setItem('theme', theme) } catch {}
  }, [theme])

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="brand-controls">
            <div className="navbar-brand"><span className="brand-icon" role="img" aria-label="biblioteca">🏛️</span> Biblioteca</div>
            <span className="theme-select-wrapper">
              <select
                className="theme-select"
                aria-label="Tema visual"
                value={theme}
                onChange={e => setTheme(e.target.value)}
              >
                <option value="theme-default">Default</option>
                <option value="theme-salmon">Coral</option>
                <option value="theme-olive">Verde</option>
              </select>
            </span>
          </div>
          <div className="navbar-title">Gestión de Libros y Préstamos</div>
        </div>
      </nav>

      <div className="app-grid container">
        <aside className="sidebar card">
          <div className="sidebar-brand">📚 Menú</div>
          <div className="sidebar-links" role="navigation">
            <Link to="/" className="navbar-item">Libros</Link>
            <Link to="/loans" className="navbar-item">Préstamos</Link>
          </div>
          
        </aside>

        <section className="main-area">
          <div className="page">
            <Routes>
              <Route path="/" element={<BooksPage />} />
              <Route path="/loans" element={<LoansPage />} />
            </Routes>
          </div>
        </section>
      </div>
    </div>
  )
}
