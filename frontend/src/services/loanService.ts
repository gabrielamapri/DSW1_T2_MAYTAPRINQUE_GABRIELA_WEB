import api from './api'

export const loanService = {
  getActive: async () => (await api.get('/loans/active')).data,
  create: async (dto: { bookId: number; studentName: string }) => (await api.post('/loans', dto)).data,
  returnLoan: async (id: number) => await api.post(`/loans/return/${id}`)
}
