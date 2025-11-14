<template>
  <v-container fluid style="min-height: 100vh" class="pa-10">
    <v-row justify="center">
      <v-col cols="12" xl="15" class="px-6">
        <CardsOverview />
        <PortfolioOverview />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import CardsOverview from './StatCards/CardsOverview.vue'
import PortfolioOverview from './PortfolioOverview.vue'
</script>
