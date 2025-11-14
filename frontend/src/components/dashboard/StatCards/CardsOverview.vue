<template>
  <v-row class="ga-0 mx-0" style="margin-left: 0; margin-right: 0">
    <v-col class="pa-1">
      <TotalAllocatedWidget />
    </v-col>
    <v-col class="pa-1">
      <TotalInvestedWidget />
    </v-col>
    <v-col class="pa-1">
      <CurrentValueWidget />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import TotalInvestedWidget from './TotalInvestedWidget.vue'
import CurrentValueWidget from './CurrentValueWidget.vue'
import TotalAllocatedWidget from './CurrentBalanceWidget.vue'
</script>
