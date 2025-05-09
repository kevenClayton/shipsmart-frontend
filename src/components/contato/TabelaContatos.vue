
<script setup lang="ts">
import { MoreVertical, MapPin } from 'lucide-vue-next'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

defineProps<{
  contatos: any[]
}>()

defineEmits(['editar', 'excluir', 'abrir-enderecos'])
</script>
<template>
  <Table v-if="contatos.length" class="w-full border border-gray-300 rounded-md text-left">
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
      <TableRow v-for="contato in contatos" :key="contato.id" class="border-t">
        <TableCell class="p-2">{{ contato.nome }}</TableCell>
        <TableCell class="p-2">{{ contato.email }}</TableCell>
        <TableCell class="p-2">{{ contato.telefone }}</TableCell>
        <TableCell class="p-2">
          <Button variant="outline" @click="$emit('abrir-enderecos', contato)">
            <MapPin class="w-4 h-4 mr-0" />Endereços
            <Badge variant="secondary">{{ contato.enderecos.length }}</Badge>
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
              <DropdownMenuItem @click="$emit('editar', contato)">
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem @click="$emit('excluir', contato)">
                <span>Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <div v-else class="text-gray-500">
    Nenhum contato encontrado.
  </div>
</template>

