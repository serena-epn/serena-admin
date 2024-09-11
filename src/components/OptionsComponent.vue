<template>
  <h1>options component</h1>

</template>

<script setup lang="ts">


</script>


<script lang='ts'>
export default {
  name: 'OptionsComponent',
  inheritAttrs: false,
  customOptions: {}
}
</script>

<style scoped>
.q-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.q-table {
  flex: 1;
}

.q-toolbar-title {
  flex: 1;
}
</style>
