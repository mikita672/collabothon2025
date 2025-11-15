<template>
  <v-card class="pa-4 outlined-card">
    <v-row no-gutters class="align-center mb-2">
      <v-col cols="auto" class="mr-3"> </v-col>

      <v-col>
        <v-row no-gutters align="center">
          <v-card color="light-green-lighten-4 pa-1" variant="flat" rounded="lg" size="36">
            <div class="text-green" style="font-weight: 600; font-family: afacad">BUY</div>
          </v-card>
          <div class="text-subtitle-1 font-weight-medium ml-5" style="font-family: afacad">
            1200 shares each for $142.80
          </div>
        </v-row>
      </v-col>
    </v-row>

    <div class="d-flex align-center text-caption text-medium-emphasis mb-3">
      <v-icon size="small" class="mr-1" style="font-family: afacad">mdi-clock-outline</v-icon>
      Oct 25, 2025, 03:00 PM
    </div>

    <v-sheet color="grey-lighten-4" rounded="lg" class="pa-3">
      <div class="d-flex align-center text-caption font-weight-medium mb-1">
        <v-icon size="small" class="mr-1">mdi-file-document-outline</v-icon>
        AI Decision Rationale:
      </div>
      <p class="text-body-2 text-medium-emphasis ml-5" style="font-family: afacad">
        Undervalued compared to peers. Strong position in AI and search markets.
      </p>
    </v-sheet>

    <div class="text-subtitle-1 text-right font-weight-medium mt-4">Total value: $171 360</div>
  </v-card>
</template>

<script setup lang="ts"></script>

<style scoped>
.outlined-card {
  box-shadow: none;
  border: 1px solid #e5e7eb;
}
</style>
