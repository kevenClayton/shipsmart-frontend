<script setup lang="ts">
import { onMounted } from 'vue'
import { contatoServico } from '@/services/contatoServico.ts'
import CardsContato from "@/components/contato/CardsContato.vue";
import { Button } from '@/components/ui/button'
import { MapPin, MoreVertical, RefreshCcw, UserPlus, Trash } from 'lucide-vue-next'
import { Badge } from "@/components/ui/badge"
import { ref } from 'vue'
import { watch } from 'vue'
import api from '@/lib/axios'
import { Estados } from '@/enums/estados'
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'

const { toast } = useToast()

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogScrollContent,
    DialogTrigger,
} from '@/components/ui/dialog'

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
const estadosLista = Object.entries(Estados)
function adicionarEndereco() {
    contato.value.enderecos.push({
        cep: '', estado: '', cidade: '', bairro: '', endereco: '', numero: '', complemento: ''
    })
}
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
function removerEndereco(index: number) {
    contato.value.enderecos.splice(index, 1)
}
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
        <Button variant="outline" size="icon" class="mb-4" @click="store.carregarContatos">
            <RefreshCcw class="w-4 h-4" />
        </Button>
        <div v-if="store.carregando" class="text-gray-500">Carregando contatos...</div>
        <div v-if="store.erro" class="text-red-500">Erro: {{ store.erro }}</div>

        <Table v-if="!store.carregando && store.contatos.length"
            class="w-full border border-gray-300 rounded-md text-left">
            <TableHeader class="bg-gray-100">
                <TableRow>
                    <TableHead class="p-2">Nome</TableHead>
                    <TableHead class="p-2">Email</TableHead>
                    <TableHead class="p-2">Telefone</TableHead>
                    <TableHead class="p-2">Endereços</TableHead>
                    <TableHead class="p-2">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow v-for="contato in store.contatos" :key="contato.id" class="border-t">
                    <TableCell class="p-2">{{ contato.nome }}</TableCell>
                    <TableCell class="p-2">{{ contato.email }}</TableCell>
                    <TableCell class="p-2">{{ contato.telefone }}</TableCell>
                    <TableCell class="p-2">
                        <Button variant="outline" @click="modalEndereco = true, contatoSelecionado = contato">
                            <MapPin class="w-4 h-4 mr-0" />Endereços
                            <Badge variant="secondary">
                                {{ contato.enderecos.length }}
                            </Badge>
                        </Button>
                    </TableCell>
                    <TableCell class="p-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger as-child>
                                <Button variant="outline" size="icon">
                                    <MoreVertical class="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent class="w-56">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem @click="abrirModalEdicao(contato)">
                                    <span>Editar</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="confirmarExclusao(contato)">
                                    <span>Excluir</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
        <div v-else-if="!store.carregando && !store.contatos.length" class="text-gray-500">
            Nenhum contato encontrado.
        </div>
    </div>

    <Dialog v-model:open="modalEndereco">
        <DialogContent class="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>Endereço contato {{ contatoSelecionado.nome }}</DialogTitle>
                <DialogDescription>
                    Endereços cadastrados para o contato <strong>{{ contatoSelecionado.nome }}</strong>.
                </DialogDescription>
            </DialogHeader>
            <Table v-if="contatoSelecionado.enderecos.length"
                class="w-full border border-gray-300 rounded-md text-left">
                <TableHeader class="bg-gray-100">
                    <TableRow>
                        <TableHead class="p-2">Endereço</TableHead>
                        <TableHead class="p-2">Nº</TableHead>
                        <TableHead class="p-2">Bairro</TableHead>
                        <TableHead class="p-2">Cidade</TableHead>
                        <TableHead class="p-2">Estado</TableHead>
                        <TableHead class="p-2">CEP</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="endereco in contatoSelecionado.enderecos"
                        :key="contatoSelecionado.enderecos.codigo" class="border-t">
                        <TableCell class="p-2">{{ endereco.endereco }}</TableCell>
                        <TableCell class="p-2">{{ endereco.numero }}</TableCell>
                        <TableCell class="p-2">{{ endereco.bairro }}</TableCell>
                        <TableCell class="p-2">{{ endereco.cidade }}</TableCell>
                        <TableCell class="p-2">{{ endereco.estado }}</TableCell>
                        <TableCell class="p-2">{{ endereco.cep }}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <div v-else-if="contatoSelecionado.enderecos.length == 0" class="text-gray-500">
                Nenhum endereço cadastrado.
            </div>
        </DialogContent>
    </Dialog>
    <Dialog v-model:open="modalContato">
        <DialogScrollContent class="sm:max-w-[800px] ">
            <DialogHeader>
                <DialogTitle>
                    {{ editandoId ? "Editar contato" : "Adicionar contato" }}
                </DialogTitle>
                <DialogDescription>
                    {{ editandoId ? "Atualização de dados do contato e seus endereços" : "Cadastro de contato e múltiplos endereços" }}
                </DialogDescription>
            </DialogHeader>

            <!-- Dados pessoais -->
            <div class="">
                <div class="grid gap-4 py-4 ">
                    <Badge variant="secondary">Dados pessoais</Badge>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col">
                            <Label for="nome">Nome</Label>
                            <Input id="nome" v-model="contato.nome" />
                        </div>

                        <div class="flex flex-col">
                            <Label for="email">E-mail</Label>
                            <Input id="email" v-model="contato.email" />
                        </div>

                        <div class="flex flex-col">
                            <Label for="telefone">Telefone</Label>
                            <Input id="telefone" v-mask="'(##) #####-####'" v-model="contato.telefone" />
                        </div>
                    </div>
                </div>

                <!-- Endereços -->
                <div class="grid gap-4 py-4">
                    <Badge variant="secondary">Endereços</Badge>

                    <div v-for="(endereco, index) in contato.enderecos" :key="index"
                        class="border border-muted rounded-md p-6 relative">
                        <div class="grid grid-cols-12 gap-4">
                            <div class="flex flex-col col-span-3">
                                <Label>CEP</Label>
                                <Input v-mask="'#####-###'" v-model="endereco.cep" />
                            </div>
                            <div class="flex flex-col col-span-9">
                                <Label>Endereço</Label>
                                <Input v-model="endereco.endereco" />
                            </div>
                            <div class="flex flex-col col-span-2">
                                <Label>Número</Label>
                                <Input type="number" v-model="endereco.numero" />
                            </div>
                            <div class="flex flex-col col-span-5">
                                <Label>Bairro</Label>
                                <Input v-model="endereco.bairro" />
                            </div>
                            <div class="flex flex-col col-span-5">
                                <Label>Cidade</Label>
                                <Input v-model="endereco.cidade" />
                            </div>
                            <div class="flex flex-col col-span-3">
                                <Label>Estado</Label>
                                <Select v-model="endereco.estado"
                                    class="col-span-1 border rounded-md px-3 py-2 text-sm">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione  o estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Estados</SelectLabel>
                                            <SelectItem v-for="[sigla, nome] in estadosLista" :key="sigla"
                                                :value="sigla">
                                                {{ nome }}
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div class="flex flex-col col-span-9">
                                <Label>Complemento</Label>
                                <Input v-model="endereco.complemento" />
                            </div>
                        </div>

                        <Button variant="destructive" size="icon" class="absolute top-2 right-2 mb-2"
                            @click="removerEndereco(index)">
                            <Trash class="w-4 h-4" />
                        </Button>
                    </div>

                    <Button variant="outline" class="w-full" @click="adicionarEndereco">
                        + Adicionar outro endereço
                    </Button>
                </div>
            </div>
            <DialogFooter>
                <Button type="button" @click="salvarOuAtualizarContato">{{ editandoId ? "Salvar alterações" : "Criar contato"}}</Button>
            </DialogFooter>
        </DialogScrollContent>
    </Dialog>
    <Dialog v-model:open="modalExcluirContato">
        <DialogContent class="sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>Confirmar exclusão</DialogTitle>
                <DialogDescription>
                    Você tem certeza que deseja excluir o contato
                    <strong>{{ contatoParaExcluir?.nome }}</strong>?
                    Essa ação não pode ser desfeita.
                </DialogDescription>
            </DialogHeader>

            <DialogFooter>
                <Button variant="ghost" @click="modalExcluirContato = false">
                    Cancelar
                </Button>
                <Button variant="destructive" @click="excluirContatoConfirmado">
                    Confirmar exclusão
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

</template>