<template>
  <div>
    Hello {{ this.uuid }}

    <div v-if="reservation">
      <div v-if="reservation.paid_at">
        Reservation {{ reservation.uuid }} paid successfully ( {{ reservation.paid_amount / 100 }} )
      </div>
      <div v-else>
        Reservation not paid
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      reservation: null
    }
  },
  async asyncData({params}) {
    const uuid = params.uuid
    return {uuid}
  },
  async mounted() {
    await this.checkReservationStatus()
  },
  methods: {
    async checkReservationStatus() {
      const {data} = await this.$axios.get(`${process.env.API_URL}/reservations/${this.uuid}`)

      this.reservation = data.data
    }
  }
}
</script>
