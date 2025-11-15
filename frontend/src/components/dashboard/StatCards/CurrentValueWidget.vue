<template>
  <div>
    <p class="font-weight-medium text-center" style="font-family: Afacad">Current Value</p>
    <v-card
      rounded="lg"
      elevation="0"
      class="d-flex align-center justify-center outlined-card"
      style="height: 5vh"
    >
      <div class="text-h5 font-weight-bold text-center" style="font-family: Afacad; color: #002e3c">
        {{ formatCurrency(currentValue) }}
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentValue: number
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
