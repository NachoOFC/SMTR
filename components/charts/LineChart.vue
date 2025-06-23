<template>
  <div class="chart-container">
    <VueChart
      :type="'line'"
      :data="chartData"
      :options="options"
    />
  </div>
</template>

<script setup>
import { Chart as ChartJS, registerables } from 'chart.js'
import { Chart as VueChart } from 'vue-chartjs'
import { defineProps } from 'vue'

ChartJS.register(...registerables)

const props = defineProps({
  chartData: { type: Object, required: true },
  options: { type: Object, required: true }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
}
</style> 