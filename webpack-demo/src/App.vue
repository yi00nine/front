<template>
  <div class="title">webpack-vue</div>
</template>

<script>
import { test } from "./test";
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    test();
  },
});
</script>

<style>
.title {
  color: red;
}
</style>