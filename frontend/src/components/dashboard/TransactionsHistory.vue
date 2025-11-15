<template>
  <v-row class="mb-4">
    <v-col cols="12" sm="4">
      <v-sheet class="pa-4 text-center rounded-lg" border>
        <div class="text-caption text-medium-emphasis">Total Shares Bought</div>
        <div class="text-h6 font-weight-bold">1200</div>
      </v-sheet>
    </v-col>
    <v-col cols="12" sm="4">
      <v-sheet class="pa-4 text-center rounded-lg" border>
        <div class="text-caption text-medium-emphasis">Total Shares Sold</div>
        <div class="text-h6 font-weight-bold">0</div>
      </v-sheet>
    </v-col>
    <v-col cols="12" sm="4">
      <v-sheet class="pa-4 text-center rounded-lg" border>
        <div class="text-caption text-medium-emphasis">Net Position</div>
        <div class="text-h6 font-weight-bold">1200 shares</div>
      </v-sheet>
    </v-col>
  </v-row>

  <div class="text-subtitle-1 font-weight-medium mb-3">All Transactions</div>

  <v-sheet class="pa-4 rounded-lg elevation-1">
    <v-row no-gutters class="align-center mb-2">
      <v-col cols="auto" class="mr-3">
        <v-avatar color="light-green-lighten-4" rounded="lg" size="36">
          <v-icon icon="mdi-arrow-bottom-right" color="green" size="24" />
        </v-avatar>
      </v-col>

      <v-col>
        <v-row no-gutters align="center">
          <v-chip color="light-green-lighten-4" text-color="green" label class="mr-2" size="small">
            BUY
          </v-chip>
          <div class="text-subtitle-1 font-weight-medium">1200 shares @ $142.80</div>
        </v-row>
      </v-col>
    </v-row>

    <div class="d-flex align-center text-caption text-medium-emphasis mb-3">
      <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
      Oct 25, 2025, 03:00 PM
    </div>

    <v-sheet color="grey-lighten-4" rounded="lg" class="pa-3">
      <div class="d-flex align-center text-caption font-weight-medium mb-1">
        <v-icon size="small" class="mr-1">mdi-file-document-outline</v-icon>
        AI Decision Rationale:
      </div>
      <p class="text-body-2 text-medium-emphasis ml-5">
        Undervalued compared to peers. Strong position in AI and search markets.
      </p>
    </v-sheet>

    <div class="text-subtitle-1 text-right font-weight-medium mt-4">Total value: $171 360</div>
  </v-sheet>
</template>

<script setup lang="ts">
// The "const dialog = ref(true)" has been removed.
// No script is needed for this component anymore.
</script>

<style scoped>
/* Scoped styles will still apply, which is good! */
</style>
