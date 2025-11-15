<template>
  <div style="width: 50vw">
    <v-card
      rounded="lg"
      elevation="0"
      class="d-flex align-center justify-center outlined-card"
      style="height: 5vh"
    >
      <v-card-text style="font-family: afacad">Total portfolio growth</v-card-text>
      <v-card-text
        class="text-h5 font-weight-bold text-center"
        style="font-family: Afacad; color: #002e3c"
      >
        {{ formatCurrency(totalGrowth) }}
      </v-card-text>
      <v-divider vertical class="my-2 mx-10" style="width: 100%"></v-divider>
      <div class="text-right mr-10">
        <v-row>
          <v-icon size="25" :color="growthPercentage >= 0 ? 'green' : 'red'">
            {{ growthPercentage >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
          </v-icon>
          <p :class="growthPercentage >= 0 ? 'text-green' : 'text-red'">
            {{ Math.abs(growthPercentage).toFixed(2) }}%
          </p>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  totalGrowth: number
  growthPercentage: number
}>()

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(value)
}
</script>

<style scoped>
.outlined-card {
  box-shadow: none;
  border: 1px solid #e5e7eb;
}
</style>
