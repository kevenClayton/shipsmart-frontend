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
export interface Indicadores {
  total_contatos: number
  total_com_enderecos: number
  total_com_telefone: number
}

export const contatoServico = defineStore('contato', {
  state: () => ({
    contatos: [] as Contato[],
    indicadores: [] as Indicadores[],
    carregando: false,
    erro: null as string | null,
    errors: null as [] | null,
  }),

  actions: {
    async carregarIndicadores() {
      this.carregando = true
      this.erro = null
      try {
        const response = await api.get<Contato[]>('/contatos/indicadores')
        this.indicadores = response.data;
      } catch (err: any) {
        this.erro = err.message || 'Erro ao buscar contatos.'
      } finally {
        this.carregando = false
      }
    },
    async carregarContatos() {
      this.carregando = true
      this.erro = null
      try {
        const response = await api.get<Contato[]>('/contatos')
        this.contatos.splice(0, this.contatos.length, ...response.data)
        this.carregarIndicadores()
      } catch (err: any) {
        this.erro = err.message || 'Erro ao buscar contatos.'
      } finally {
        this.carregando = false
      }
    },

    async adicionarContato(contato: Omit<Contato, 'id'>) {
      try {
        const response = await api.post<Contato>('/contatos', contato)
        this.erro = null
        this.errors = null
        await this.carregarContatos()
      } catch (err: any) {
        this.erro = err.response?.data?.message || 'Erro ao adicionar contato.'
        this.errors = err.response?.data?.errors || []
      }
    },

    async atualizarContato(id: number, contato: Partial<Contato>) {
      try {
        const response = await api.put<Contato>(`/contatos/${id}`, contato)
        await this.carregarContatos()
      } catch (err: any) {
        this.erro = err.response?.data?.message || 'Erro ao atualizar contato.'
        this.errors = err.response?.data?.errors || []
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
      this.indicadores = []
      this.carregando = false
      this.erro = null
    }
  },
})

export const exportacaoService = {
  exportarExcel: (data: any) => {
    return api.get<{ data: any }>(
      `/exportacao/excel?tipoExportacao=${data}`,
      { responseType: 'blob' }
    );
  }
}


export const botaoExportacao = async (tipoExportacao: any) => {
  try {
    const response = await exportacaoService.exportarExcel(tipoExportacao);

    // Cria um URL para o Blob de dados da resposta
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Cria um elemento <a> para download
    const link = document.createElement("a");
    link.href = url;
    const dataHoraAtualFormatadaArquivo = new Date().toLocaleString().replace(/[^0-9]/g, "");
    const nomeArquivo = tipoExportacao+"_"+dataHoraAtualFormatadaArquivo+".xlsx";
    link.setAttribute("download", nomeArquivo);

    // Adiciona o link ao corpo do documento e dispara o clique
    document.body.appendChild(link);
    link.click();

    // Remove o link após o download ser iniciado
    link.remove();
  } catch (error) {
    console.error("Erro ao exportar para Excel:", error);
  }
};