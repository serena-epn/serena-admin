<template>
  <q-page class="q-pa-md">
    <div class="row justify-evenly">
      <div class="q-pa-md col-4">
        <q-card class="my-card" flat bordered>
          <q-card-section>
            <div class="row center items-center " style="width: 100%;">
              <div class="col-9">
                <div style="margin-left: 28px">
                  <div class="text-h4">Cuidadores</div>
                  <q-separator />
                  <div class="text-h6">Registrados: 12</div>
                  <div class="text-h6">Último Registro: 01-02-2023</div>
                  <q-btn color="primary" label="Administrar" />
                </div>
              </div>
              <div class="col-3">
                <q-icon name="person" size="128px" color="primary" />
              </div>
            </div>
          </q-card-section>
        </q-card>

      </div>
      <div class="q-pa-md col-4">
        <q-card class="my-card" flat bordered>
          <q-card-section>
            <div class="row center items-center " style="width: 100%;">
              <div class="col-9">
                <div style="margin-left: 28px">
                  <div class="text-h4">Afectados</div>
                  <q-separator />
                  <div class="text-h6">Registrados: 12</div>
                  <div class="text-h6">Último Registro: 01-02-2023</div>
                  <q-btn color="secondary" label="Administrar" />
                </div>
              </div>
              <div class="col-3">
                <q-icon name="record_voice_over" size="128px" color="secondary" />
              </div>
            </div>
          </q-card-section>
        </q-card>

      </div>
      <div class="q-pa-md col-4">
        <q-card class="my-card" flat bordered>
          <q-card-section>
            <div class="row center items-center " style="width: 100%;">
              <div class="col-9">
                <div style="margin-left: 28px">
                  <div class="text-h4">Dispositivos</div>
                  <q-separator />
                  <div class="text-h6">Registrados: 12</div>
                  <div class="text-h6">Último Registro: 01-02-2023</div>
                  <q-btn color="accent" label="Administrar" />
                </div>
              </div>
              <div class="col-3">
                <q-icon name="watch" size="128px" color="accent" />
              </div>
            </div>
          </q-card-section>
        </q-card>

      </div>


    </div>
    <!-- <div class="row justify-center">
      <div class="q-pa-md col-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Alertas por Mes</div>
            <VueApexCharts type="line" :options="chartOptionsLine" :series="seriesLine" />
          </q-card-section>
        </q-card>
      </div>
      <div class="q-pa-md col-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Dispositivos Registrados</div>
            <VueApexCharts type="heatmap" :options="chartOptions" :series="series" />
          </q-card-section>
        </q-card>
      </div>
    </div> -->
  </q-page>
</template>

<script setup lang="ts">

// import { ref } from 'vue'
// import VueApexCharts from 'vue3-apexcharts'

// const seriesLine = ref([
//   {
//     name: 'Dataset 1',
//     data: [65, 59, 80, 81, 56, 55, 40]
//   },
//   {
//     name: 'Dataset 2',
//     data: [28, 48, 40, 19, 86, 27, 90]
//   }
// ])

// const chartOptionsLine = ref({
//   chart: {
//     height: 350,
//     type: 'line'
//   },
//   title: {
//     text: 'Alertas por mes',
//     align: 'left'
//   },
//   xaxis: {
//     categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July']
//   },
//   yaxis: {
//     title: {
//       text: 'Values'
//     }
//   },
//   tooltip: {
//     shared: true,
//     intersect: false
//   },
//   legend: {
//     position: 'top',
//     horizontalAlign: 'right'
//   }
// })

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const generateData = (count: number, yrange: { min: any; max: any; }) => {
//   let i = 0
//   const series = []
//   while (i < count) {
//     const x = 'w' + (i + 1).toString()
//     const y =
//       Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
//     series.push({ x, y })
//     i++
//   }
//   return series
// }

// const series = ref([
//   {
//     name: 'Metric1',
//     data: generateData(20, { min: 0, max: 90 })
//   },
//   {
//     name: 'Metric2',
//     data: generateData(20, { min: 0, max: 90 })
//   },
//   {
//     name: 'Metric3',
//     data: generateData(20, { min: 0, max: 90 })
//   },
//   {
//     name: 'Metric4',
//     data: generateData(20, { min: 0, max: 90 })
//   },
//   {
//     name: 'Metric5',
//     data: generateData(20, { min: 0, max: 90 })
//   },
//   {
//     name: 'Metric6',
//     data: generateData(20, { min: 0, max: 90 })
//   },
//   {
//     name: 'Metric7',
//     data: generateData(20, { min: 0, max: 90 })
//   },
//   {
//     name: 'Metric8',
//     data: generateData(20, { min: 0, max: 90 })
//   },
//   {
//     name: 'Metric9',
//     data: generateData(20, { min: 0, max: 90 })
//   }
// ])

// const chartOptions = ref({
//   chart: {
//     height: 350,
//     type: 'heatmap'
//   },
//   plotOptions: {
//     heatmap: {
//       shadeIntensity: 0.5,
//       colorScale: {
//         ranges: [
//           {
//             from: 0,
//             to: 50,
//             color: '#00A100'
//           },
//           {
//             from: 51,
//             to: 100,
//             color: '#128FD9'
//           }
//         ]
//       }
//     }
//   },
//   dataLabels: {
//     enabled: false
//   },
//   title: {
//     text: 'Dispositivos Registrados'
//   }
// })


</script>
