
<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const props = defineProps<{
  aberto: boolean
  contato: {
    nome: string
    enderecos: {
      codigo: number
      endereco: string
      numero: string
      bairro: string
      cidade: string
      estado: string
      cep: string
    }[]
  } | null
}>()
</script>
<template>
  <Dialog v-model:open="props.aberto"  @update:open="$emit('fechar')">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Endereço do contato {{ contato?.nome }}</DialogTitle>
        <DialogDescription>
          Endereços cadastrados para <strong>{{ contato?.nome }}</strong>.
        </DialogDescription>
      </DialogHeader>

      <Table v-if="contato?.enderecos?.length" class="w-full border border-gray-300 rounded-md text-left">
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
          <TableRow v-for="endereco in contato.enderecos" :key="endereco.codigo" class="border-t">
            <TableCell class="p-2">{{ endereco.endereco }}</TableCell>
            <TableCell class="p-2">{{ endereco.numero }}</TableCell>
            <TableCell class="p-2">{{ endereco.bairro }}</TableCell>
            <TableCell class="p-2">{{ endereco.cidade }}</TableCell>
            <TableCell class="p-2">{{ endereco.estado }}</TableCell>
            <TableCell class="p-2">{{ endereco.cep }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div v-else class="text-gray-500">
        Nenhum endereço cadastrado.
      </div>
    </DialogContent>
  </Dialog>
</template>
