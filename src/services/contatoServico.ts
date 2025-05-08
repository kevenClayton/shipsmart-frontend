import api from '@/lib/axios'
import { defineStore } from 'pinia'

export interface Contato {
  id: number
  nome: string
  email: string
  telefone: string
  cep: string
  estado: string
  cidade: string
  bairro: string
  endereco: string
  numero: string
}

export const contatoServico = defineStore('contato', {
  state: () => ({
    contatos: [] as Contato[],
    carregando: false,
    erro: null as string | null,
  }),

  actions: {
    async carregarContatos() {
      this.carregando = true
      this.erro = null
      try {
        const response = await api.get<Contato[]>('/contatos')
        this.contatos = response.data
      } catch (err: any) {
        this.erro = err.message || 'Erro ao buscar contatos.'
      } finally {
        this.carregando = false
      }
    },

    async adicionarContato(contato: Omit<Contato, 'id'>) {
      try {
        const response = await api.post<Contato>('/contatos', contato)
        this.contatos.push(response.data)
      } catch (err: any) {
        this.erro = err.message || 'Erro ao adicionar contato.'
      }
    },

    async atualizarContato(id: number, contato: Partial<Contato>) {
      try {
        const response = await api.put<Contato>(`/contatos/${id}`, contato)
        const index = this.contatos.findIndex(c => c.id === id)
        if (index !== -1) this.contatos[index] = response.data
      } catch (err: any) {
        this.erro = err.message || 'Erro ao atualizar contato.'
      }
    },

    async excluirContato(id: number) {
      try {
        await api.delete(`/contatos/${id}`)
        this.contatos = this.contatos.filter(c => c.id !== id)
      } catch (err: any) {
        this.erro = err.message || 'Erro ao excluir contato.'
      }
    },

    reset() {
      this.contatos = []
      this.carregando = false
      this.erro = null
    }
  },
})
