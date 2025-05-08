<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
</script>

<template>
   <VLocaleProvider >
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp>
      <RouterView />
    </VApp>
  </VLocaleProvider>
</template>