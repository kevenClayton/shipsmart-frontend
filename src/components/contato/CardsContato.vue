<script setup lang="ts">
import { computed } from 'vue'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
const props = defineProps({
  indicadores: {
    type: Object as () => any, // Substitua MatriculaType pelo tipo TypeScript correto
    required: true,
  },
});
const notificacoes = computed(() =>[
  {
    title: 'Contatos com endereço',
    description: props.indicadores.total_com_enderecos,
  },
  {
    title: 'Contatos com telefone',
    description: props.indicadores.total_com_telefone,
  },
  {
    title: 'Total',
    description: props.indicadores.total_contatos,
  },
])
</script>

<template>  
  <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
    <div class="grid auto-rows-min gap-4 md:grid-cols-3">
      <Card v-for="(notificacao, index) in notificacoes" :key="index">
        <CardHeader>
          <CardTitle> {{ notificacao.title }}</CardTitle>
          <CardDescription> {{ notificacao.description  ?? 0 }}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>