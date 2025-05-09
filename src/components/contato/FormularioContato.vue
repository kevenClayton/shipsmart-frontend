
<script setup lang="ts">
import { ref, watch } from 'vue'
import { Estados } from '@/enums/estados'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Trash } from 'lucide-vue-next'
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps<{
  contato: any
  aberto: boolean
  editandoId: number | null
}>()

const emits = defineEmits(['salvar', 'adicionar-endereco', 'remover-endereco','fechar'])

const estadosLista = Object.entries(Estados)

function adicionarEndereco() {
  props.contato.enderecos.push({
    cep: '', estado: '', cidade: '', bairro: '', endereco: '', numero: '', complemento: ''
  })
}

function removerEndereco(index: number) {
  props.contato.enderecos.splice(index, 1)
}
</script>

<template>
  <Dialog v-model:open="props.aberto" @update:open="$emit('fechar')">
    <DialogScrollContent class="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle>{{ editandoId ? 'Editar contato' : 'Adicionar contato' }}</DialogTitle>
        <DialogDescription>
          {{ editandoId ? 'Atualização de dados do contato e seus endereços' : 'Cadastro de contato e múltiplos endereços' }}
        </DialogDescription>
      </DialogHeader>

      <!-- Dados pessoais -->
      <div class="grid gap-4 py-4">
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
        <div v-for="(endereco, index) in contato.enderecos" :key="index" class="border border-muted rounded-md p-4 relative">
          <div class="grid grid-cols-12 gap-4 mt-5">
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
              <Select v-model="endereco.estado">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Estados</SelectLabel>
                    <SelectItem v-for="[sigla, nome] in estadosLista" :key="sigla" :value="sigla">
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
          <Button variant="destructive" size="icon" class="absolute top-2 right-2 mb-2" @click="removerEndereco(index)">
            <Trash class="w-4 h-4" />
          </Button>
        </div>
        <Button variant="outline" class="w-full" @click="adicionarEndereco">
          + Adicionar outro endereço
        </Button>
      </div>

      <DialogFooter>
        <Button variant="secondary" type="button" @click="$emit('fechar')">
         Fechar
        </Button>
        <Button type="button" @click="$emit('salvar')">
          {{ editandoId ? 'Salvar alterações' : 'Criar contato' }}
        </Button>
      </DialogFooter>
    </DialogScrollContent>
  </Dialog>
</template>
