import { useEffect, useState } from 'react'
import { bookService } from '../services/bookService'
import { loanService } from '../services/loanService'

type Book = { id: number; title: string; author: string; isbn: string; stock: number }

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Book | null>(null)
  const [form, setForm] = useState({ title: '', author: '', isbn: '', stock: 0 })
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' })

  const load = async () => {
    setLoading(true)
    try {
      const data = await bookService.getAll()
      setBooks(data)
    } catch {
      setMessage({ type: 'error', text: 'Error al cargar libros' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const clearForm = () => { setEditing(null); setForm({ title: '', author: '', isbn: '', stock: 0 }) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editing) {
        await bookService.update(editing.id, form)
        setMessage({ type: 'success', text: 'Libro actualizado' })
      } else {
        await bookService.create(form)
        setMessage({ type: 'success', text: 'Libro creado' })
      }
      clearForm(); load()
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? err?.response?.data?.message ?? 'Error del servidor'
      setMessage({ type: 'error', text: String(msg) })
    }
  }

  const handleEdit = (b: Book) => { setEditing(b); setForm({ title: b.title, author: b.author, isbn: b.isbn, stock: b.stock }) }

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar libro?')) return
    try {
      // Check for active loans first
      const active = await loanService.getActive()
      const hasActive = Array.isArray(active) && active.some((l: any) => l.bookId === id)
      if (hasActive) {
        setMessage({ type: 'error', text: 'No se puede eliminar: existen préstamos activos para este libro. Devuelva los préstamos primero.' })
        return
      }
    } catch (checkErr) {
      // If the check fails, continue to attempt delete and rely on server error handling
      console.warn('Could not check active loans before delete', checkErr)
    }
    try {
      await bookService.delete(id)
      setMessage({ type: 'success', text: 'Libro eliminado' })
      load()
    } catch (err:any) {
      const msg = err?.response?.data?.error ?? err?.response?.statusText ?? 'Error al eliminar'
      setMessage({ type: 'error', text: String(msg) })
      console.error('Delete book error:', err?.response ?? err)
    }
  }

  const handleDarBaja = async (id: number) => {
    const reason = prompt('Motivo (opcional)') ?? undefined
    try {
      const res = await bookService.darBaja(id, { reason })
      setMessage({ type: 'success', text: res?.message ?? 'Artículo dado de baja' })
      load()
    } catch (err:any) { setMessage({ type: 'error', text: err?.response?.data?.error ?? 'Error al dar de baja' }) }
  }

  return (
    <div className="page">
      <h1 className="page-title">LIBROS</h1>
      {message.text && <div className={`message message-${message.type}`}>{message.text}</div>}
      <div className="stack">
        <section>
          <h3>{editing ? 'Editar libro' : 'Nuevo libro'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row form-grid">
              <div className="form-group">
                <label>Título</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Autor</label>
                <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>ISBN</label>
                <input value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} required />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" type="submit">{editing ? 'Actualizar' : 'Guardar'}</button>
              <button type="button" className="btn" onClick={clearForm}>Limpiar</button>
            </div>
          </form>
        </section>

        <section>
          <h3>Listado de libros</h3>
          {loading ? <p>Cargando...</p> : (
            <table className="books-table">
              <thead>
                <tr><th>Título</th><th>Autor</th><th>ISBN</th><th>Stock</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {books.map(b => (
                  <tr key={b.id} className={b.stock === 0 ? 'out-of-stock-row' : ''}>
                    <td>{b.title}</td>
                    <td>{b.author}</td>
                    <td>{b.isbn}</td>
                    <td>{b.stock === 0 ? <span className="stock-badge stock-out">SIN STOCK</span> : b.stock}</td>
                    <td className="actions">
                      <button className="btn btn-info" onClick={() => handleEdit(b)}>Editar</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(b.id)}>Eliminar</button>
                      <button className="btn btn-warning" onClick={() => handleDarBaja(b.id)}>Dar Baja</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  )
}
