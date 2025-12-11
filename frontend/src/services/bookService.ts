import api from './api'

export const bookService = {
  getAll: async () => (await api.get('/books')).data,
  getById: async (id: number) => (await api.get(`/books/${id}`)).data,
  create: async (dto: any) => (await api.post('/books', dto)).data,
  update: async (id: number, dto: any) => (await api.put(`/books/${id}`, dto)).data,
  delete: async (id: number) => await api.delete(`/books/${id}`),
  darBaja: async (id: number, dto: { reason?: string }) => (await api.post(`/books/dar-baja/${id}`, dto)).data
}
