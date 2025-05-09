
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const props = defineProps<{
  aberto: boolean
  contato: { nome: string } | null
}>()

defineEmits(['confirmar', 'cancelar'])
</script>

<template>
  <Dialog v-model:open="props.aberto" @update:open="$emit('cancelar')">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogDescription>
          Você tem certeza que deseja excluir o contato
          <strong>{{ contato?.nome }}</strong>?
          Essa ação não pode ser desfeita.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button variant="ghost" @click="$emit('cancelar')">
          Cancelar
        </Button>
        <Button variant="destructive" @click="$emit('confirmar')">
          Confirmar exclusão
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
