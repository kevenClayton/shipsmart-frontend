<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Bell, Check } from 'lucide-vue-next'

const notifications = [
  {
    title: 'Contatos com endereço',
    description: '7',
  },
  {
    title: 'Contatos com telefone',
    description: '1',
  },
  {
    title: 'Total',
    description: '3',
  },
]
</script>

<template>
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
    <div class="grid auto-rows-min gap-4 md:grid-cols-3">
  <Card  v-for="(notification, index) in notifications" :key="index">
    <CardHeader>
      <CardTitle>  {{ notification.title }}</CardTitle>
      <CardDescription>  {{ notification.description }}</CardDescription>
    </CardHeader>       
  </Card>
</div>
</div>
</template>