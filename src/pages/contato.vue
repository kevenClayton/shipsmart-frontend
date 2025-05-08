<script setup lang="ts">

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import CardsContato from "@/components/contato/CardsContato.vue";
import RegistrosContato from "@/components/contato/RegistrosContato.vue";
import AppSidebar from "@/components/AppSidebar.vue";

</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <CardsContato />
      <RegistrosContato />      
    </SidebarInset>

  </SidebarProvider>



</template>
