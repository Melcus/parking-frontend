<template>
  <div
    class="absolute rounded-md top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 w-full max-w-5xl bg-white"
    v-if="garage && Object.keys(garage).length">
    <div class="flex pb-6">
      <div class="w-5/6">{{ garage.name }}</div>
      <div class="w-1/6 text-right cursor-pointer hover:text-blue-600" @click="close()">close</div>
    </div>
    <p>{{ garage }}</p>
  </div>
</template>

<script>
export default {
  props: {
    garage: {
      type: Object,
      required: false
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>
