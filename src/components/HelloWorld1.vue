<script setup lang="ts">

import HelloWorld from "./HelloWorld.vue";
import {ref} from "vue";

const showCanvas = ref(true)

</script>

<template>
  <div class="btns">
    <div class="btn" @click="showCanvas = !showCanvas">hide/show</div>
  </div>
  <div v-if="showCanvas">
    <HelloWorld/>
  </div>
  <div v-else>hello-world 1</div>
</template>

<style scoped>
.btns {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn {
  background: blue;
  padding: 2px 10px;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}
</style>
