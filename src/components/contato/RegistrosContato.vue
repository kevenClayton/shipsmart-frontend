<script setup lang="ts">
import { onMounted } from 'vue'
import { contatoServico } from '@/services/contatoServico.ts'
import { Button } from '@/components/ui/button'
import { MapPin, MoreVertical } from 'lucide-vue-next'

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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
const store = contatoServico()

onMounted(() => {
    store.carregarContatos()
})
</script>
<template>
    <div class="p-6 max-w-5xl mx-auto">
        <h1 class="text-2xl font-bold mb-4">Lista de Contatos</h1>

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
                    <TableCell class="p-2">{{ contato.nome_contato }}</TableCell>
                    <TableCell class="p-2">{{ contato.email_contato }}</TableCell>
                    <TableCell class="p-2">{{ contato.telefone_contato }}</TableCell>
                    <TableCell class="p-2">

                        <Dialog>
                            <DialogTrigger as-child>
                                <Button variant="outline">
                                    <MapPin class="w-4 h-4 mr-0" />Endereços
                                </Button>
                            </DialogTrigger>
                            <DialogContent class="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit profile</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your profile here. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div class="grid gap-4 py-4">
                                    <div class="grid grid-cols-4 items-center gap-4">
                                        <Label for="name" class="text-right">
                                            Name
                                        </Label>
                                        <Input id="name" value="Pedro Duarte" class="col-span-3" />
                                    </div>
                                    <div class="grid grid-cols-4 items-center gap-4">
                                        <Label for="username" class="text-right">
                                            Username
                                        </Label>
                                        <Input id="username" value="@peduarte" class="col-span-3" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">
                                        Save changes
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
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
                                <DropdownMenuItem>
                                    <span>Editar</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
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
</template>