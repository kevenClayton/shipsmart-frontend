<script setup lang="ts">

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import RegistrosContato from "@/components/contato/RegistrosContato.vue";
import AppSidebar from "@/components/AppSidebar.vue";

</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>      
      <RegistrosContato />      
    </SidebarInset>

  </SidebarProvider>



</template>
