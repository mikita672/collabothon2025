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
        €4321.85
      </v-card-text>
      <v-divider vertical class="my-2 mx-10" style="width: 100%"></v-divider>
      <div class="text-right mr-10">
        <v-row>
          <v-icon size="25" color="green">{{ 'mdi-trending-up' }}</v-icon>
          <p>10%</p>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.outlined-card {
  box-shadow: none;
  border: 1px solid #e5e7eb;
}
</style>
