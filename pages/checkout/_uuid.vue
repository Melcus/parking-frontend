<template>
  <div>
    Hello {{ this.uuid }}
  </div>
</template>

<script>
export default {
  async asyncData({ params }) {
    const uuid = params.uuid
    return { uuid }
  }
}
</script>
