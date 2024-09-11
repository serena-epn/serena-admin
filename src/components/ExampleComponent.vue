<template>
  <div>
    <p>{{ title }}</p>
    <ul>

    </ul>
    <p>Active: {{ active ? 'yes' : 'no' }}</p>
    <p>Clicks on todos: {{ clickCount }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';


interface Props {
  title: string;
  active: boolean;
}
const props = withDefaults(defineProps<Props>(), {

});

const clickCount = ref(0);
function increment() {
  clickCount.value += 1;
  return clickCount.value;
}

</script>
