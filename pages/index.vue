<template>
  <div class="w-full relative min-h-screen bg-green-300 ">
    <GMap
      v-if="garages.length"
      ref="gMap"
      language="en"
      :cluster="{options: {styles: clusterStyle}}"
      :center="{lat: garages[0].coordinates.lat, lng: garages[0].coordinates.lng}"
      :options="{fullscreenControl: false}"
      :zoom="11"
      class="absolute inset-0 bg-red-300 h-full"
    >
      <GMapMarker
        v-for="garage in garages"
        :key="garage.id"
        :position="{lat: garage.coordinates.lat, lng: garage.coordinates.lng}"
        :options="{icon: garage.free_spots > 0 ? pins.available : pins.unavailable}"
        @click="selectedGarage = garage"
      >
      </GMapMarker>
      <GMapCircle/>
    </GMap>

    <garage-modal :garage="selectedGarage" @close="selectedGarage = null"/>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import GarageModal from "../components/GarageModal";

export default {
  components: {
    'garage-modal': GarageModal
  },
  data() {
    return {
      selectedGarage: {},
      circleOptions: {},
      pins: {
        available: "/green_marker.png",
        unavailable: "/red_marker.png"
      },
      clusterStyle: [
        {
          url: "/m1.png",
          width: 56,
          height: 56,
          textColor: "#fff"
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      'garages': "garages/all"
    })
  },
  async fetch() {
    await this.ensureGarages()
  },
  methods: {
    ...mapActions({
      ensureGarages: 'garages/ENSURE'
    })
  }
}
</script>
