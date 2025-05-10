<script setup lang="ts">
import { onMounted } from 'vue'
import { contatoServico, botaoExportacao } from '@/services/contatoServico.ts'
import CardsContato from "@/components/contato/CardsContato.vue";
import { Button } from '@/components/ui/button'
import { RefreshCcw, UserPlus, Download } from 'lucide-vue-next'
import { ref } from 'vue'
import { watch } from 'vue'
import api from '@/lib/axios'
import { useToast } from '@/components/ui/toast/use-toast'
import TabelaContatos from '@/components/contato/TabelaContatos.vue'
import FormularioContato from '@/components/contato/FormularioContato.vue'
import ModalExcluirContato from '@/components/contato/ModalExcluirContato.vue'
import ModalEnderecosContato from '@/components/contato/ModalEnderecosContato.vue'

const { toast } = useToast()

const store = contatoServico()
const modalEndereco = ref(false);
const contatoSelecionado = ref([]);
const modalContato = ref(false);
const editandoId = ref<number | null>(null)
const modalExcluirContato = ref(false)
const contatoParaExcluir = ref<any>(null)
onMounted(() => {
    store.carregarContatos()
});
const contato = ref({
    nome: '',
    email: '',
    telefone: '',
    enderecos: [
        { cep: '', estado: '', cidade: '', bairro: '', endereco: '', numero: '', complemento: '' }
    ]
})

function abrirModalEdicao(contatoOriginal: any) {
    editandoId.value = contatoOriginal.codigo
    contato.value = JSON.parse(JSON.stringify(contatoOriginal))
    modalContato.value = true
}
function abrirModalCriacao() {
    editandoId.value = null
    resetarFormulario()
    modalContato.value = true
}
function confirmarExclusao(contato: any) {
    contatoParaExcluir.value = contato
    modalExcluirContato.value = true
}
const exportacaoExcel = async () => {
  try {
    botaoExportacao("Contato");
  } catch (error) {
    console.error("Erro ao exportar para Excel:", error);
  }
};
watch(
    () => contato.value.enderecos.map(e => e.cep),
    async (ceps, prevCeps) => {
        ceps.forEach(async (cep, index) => {
            const cleanedCep = cep.replace(/\D/g, '')
            if (cleanedCep.length === 8 && cleanedCep !== prevCeps?.[index]) {
                try {
                    const { data } = await api.get(`https://viacep.com.br/ws/${cleanedCep}/json/`)
                    if (!data.erro) {
                        const endereco = contato.value.enderecos[index]
                        endereco.estado = data.uf
                        endereco.cidade = data.localidade
                        endereco.bairro = data.bairro
                        endereco.endereco = data.logradouro
                    }
                } catch (e) {
                    console.error(`Erro ao buscar CEP ${cep}`)
                }
            }
        })
    },
    { deep: true }
)
async function salvarOuAtualizarContato() {
    try {
        if (editandoId.value) {
            await store.atualizarContato(editandoId.value, contato.value)
        }
        else {
            await store.adicionarContato({ ...contato.value })
        }

        if (store.error || store.errors) {
            if (store.erro) {
                toast({
                    description: store.erro,
                    variant: 'destructive'
                })
            }
            if (store.errors) {
                store.errors.forEach((error: string) => {
                    toast({
                        description: error,
                        variant: 'destructive'
                    })
                })
            }
            return
        }
        toast({
            title: 'Sucesso',
            description: 'Contato adicionado com sucesso!'
        })
        modalContato.value = false
        resetarFormulario()

    } catch (e) {
        console.error('Erro ao salvar contato', e)
    }
}
async function excluirContatoConfirmado() {
    try {
        await api.delete(`/contatos/${contatoParaExcluir.value.codigo}`)
        toast({
            title: 'Contato excluído',
            description: `O contato ${contatoParaExcluir.value.nome} foi removido.`,
        })

        await store.carregarContatos()
        modalExcluirContato.value = false
        contatoParaExcluir.value = null
    } catch (e) {
        console.error(e)
        toast({
            title: 'Erro ao excluir',
            description: 'Ocorreu um erro ao tentar excluir o contato.',
            variant: 'destructive',
        })
    }
}
function resetarFormulario() {
    contato.value = {
        nome: '',
        email: '',
        telefone: '',
        enderecos: [
            { cep: '', estado: '', cidade: '', bairro: '', endereco: '', numero: '', complemento: '' }
        ]
    }
}
</script>
<template>    
    <CardsContato :indicadores="store.indicadores" />
    <div class="p-6 max-w-5xl mx-auto">
        <h1 class="text-2xl font-bold mb-4">Lista de Contatos</h1>
        <Button variant="outline" class="mb-4 mx-1" @click="abrirModalCriacao">
            <UserPlus class="w-4 h-4" />
            Adicionar contato
        </Button>
        <Button variant="outline" class="mb-4 mx-1" @click="exportacaoExcel">
            <Download class="w-4 h-4" />
            Exportar
        </Button>
        <Button variant="outline" size="icon" class="mb-4" @click="store.carregarContatos">
            <RefreshCcw class="w-4 h-4" />
        </Button>
        <div v-if="store.carregando" class="text-gray-500">Carregando contatos...</div>
        <div v-if="store.erro" class="text-red-500">Erro: {{ store.erro }}</div>
        <TabelaContatos
            v-if="!store.carregando"
            :contatos="store.contatos"
            @editar="abrirModalEdicao"
            @excluir="confirmarExclusao"
            @abrir-enderecos="(contato) => { modalEndereco = true; contatoSelecionado = contato }"
        />        
        <div v-else-if="!store.carregando && !store.contatos.length" class="text-gray-500">
            Nenhum contato encontrado.
        </div>
    </div>
    <ModalEnderecosContato
        :aberto="modalEndereco"
        :contato="contatoSelecionado"
        @fechar="modalEndereco = false"
    />
    <FormularioContato
        :contato="contato"
        :editando-id="editandoId"
        :aberto="modalContato"
        @salvar="salvarOuAtualizarContato"
        @fechar="modalContato = false"
    />
    <ModalExcluirContato
        :aberto="modalExcluirContato"
        :contato="contatoParaExcluir"
        @confirmar="excluirContatoConfirmado"
        @cancelar="modalExcluirContato = false"
    />    
</template>