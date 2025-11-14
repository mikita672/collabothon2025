<template>
  <v-row class="d-flex align-center justify-center ga-4">
    <v-col cols="auto">
      <SymarizeWidget />
    </v-col>
    <v-col cols="auto">
      <TotalInvestedWidget />
    </v-col>
    <v-col cols="auto">
      <CurrentValueWidget />
    </v-col>
    <v-col cols="auto">
      <GrowthWidget />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import SymarizeWidget from './TotalAllocatedWidget.vue'
import TotalInvestedWidget from './TotalInvestedWidget.vue'
import CurrentValueWidget from './CurrentValueWidget.vue'
import GrowthWidget from './GrowthWidget.vue'
</script>
