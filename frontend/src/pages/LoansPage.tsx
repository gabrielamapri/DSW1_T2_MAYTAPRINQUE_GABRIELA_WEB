import { useEffect, useState } from 'react'
import { loanService } from '../services/loanService'
import { bookService } from '../services/bookService'

type Loan = { id: number; bookId: number; bookTitle: string; studentName: string; loanDate: string; status: string }
type Book = { id: number; title: string; stock: number }

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [form, setForm] = useState({ bookId: 0, studentName: '' })
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' })
  const [showAllBooks, setShowAllBooks] = useState(false)

  const load = async () => {
    try {
      setLoans(await loanService.getActive())
      setBooks(await bookService.getAll())
    } catch {
      setMessage({ type: 'error', text: 'Error al cargar datos' })
    }
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await loanService.create(form)
      setMessage({ type: 'success', text: 'Préstamo registrado' })
      setForm({ bookId: 0, studentName: '' })
      load()
    } catch (err:any) {
      const msg = err?.response?.data?.error ?? err?.response?.data?.message ?? 'Error del servidor'
      setMessage({ type: 'error', text: String(msg) })
    }
  }

  const handleReturn = async (id: number) => {
    try { await loanService.returnLoan(id); setMessage({ type: 'success', text: 'Préstamo devuelto' }); load() } catch { setMessage({ type: 'error', text: 'Error al devolver' }) }
  }

  return (
    <div className="page">
      <h1 className="page-title">PRÉSTAMOS</h1>
      {message.text && <div className={`message message-${message.type}`}>{message.text}</div>}

      <div className="stack">
        <section>
          <h3>Nuevo préstamo</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Libro</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <select value={form.bookId} onChange={e => setForm({ ...form, bookId: Number(e.target.value) })} required>
                    <option value={0}>Seleccionar libro con stock</option>
                    {(showAllBooks ? books : books.filter(b => b.stock > 0)).map(b => (
                      <option key={b.id} value={b.id}>{b.title} (stock: {b.stock}){b.stock === 0 ? ' — sin stock' : ''}</option>
                    ))}
                  </select>
                  <div>
                    <label className="show-stock-toggle">
                      <input className="show-stock-checkbox" type="checkbox" checked={showAllBooks} onChange={e => setShowAllBooks(e.target.checked)} />
                      <span className="toggle-pill">
                        <span className="toggle-knob" aria-hidden="true" />
                        <span className="toggle-text">Mostrar libros sin stock</span>
                      </span>
                    </label>
                  </div>
                </div>
                {/* Client-side hint when selected book has no stock - server will still validate */}
                {form.bookId !== 0 && books.find(b => b.id === form.bookId && b.stock === 0) && (
                  <div style={{ marginTop: 8, fontSize: 13, color: '#b91c1c' }}>Atención: este libro no tiene stock. Si intenta registrar el préstamo, el servidor devolverá un error.</div>
                )}
              </div>
              <div className="form-group">
                <label>Estudiante</label>
                <input value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} required />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" type="submit">Registrar préstamo</button>
            </div>
          </form>
        </section>

        <section>
          <h3>Préstamos activos</h3>
          <table className="books-table">
            <thead>
              <tr><th>Libro</th><th>Estudiante</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {loans.map(l => (
                <tr key={l.id}>
                  <td>{l.bookTitle}</td>
                  <td>{l.studentName}</td>
                  <td>{new Date(l.loanDate).toLocaleString()}</td>
                  <td>
                    {/** status badge with colored variants */}
                    <StatusBadge status={l.status} />
                  </td>
                  <td><button className="btn btn-info" onClick={() => handleReturn(l.id)}>Devolver</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const s = (status || '').toLowerCase()
  let cls = 'status-active'
  if (s.includes('dev') || s.includes('return') || s.includes('devuelto') || s.includes('returned')) cls = 'status-success'
  else if (s.includes('act') || s.includes('pend') || s.includes('active') || s.includes('pendiente')) cls = 'status-active'
  else cls = 'status-danger'

  return <span className={`status-badge ${cls}`}>{status}</span>
}
