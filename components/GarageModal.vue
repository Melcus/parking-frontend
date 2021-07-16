<template>
  <div
    class="absolute rounded-md lg:top-1/4 left-1/2 transform -translate-x-1/2  p-4 w-full h-full lg:h-auto max-w-5xl bg-white py-8"
    v-if="garage && Object.keys(garage).length">

    <div class="flex pb-6 pt-10 lg:pt-0 items-center">
      <div class="w-5/6 text-4xl tracking-tight font-extrabold text-gray-700">{{ garage.name }}</div>
      <div class="w-1/6 text-right cursor-pointer hover:text-blue-600 text-4xl text-gray-500" @click="close()">x</div>
    </div>

    <hr>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-6">
      <div>
        <label for="from" class="block text-sm font-medium text-gray-700">From</label>
        <div class="mt-1">
          <date-picker id="from" v-model="filters.start" :show-second="false" :minute-step="15" type="datetime"
                       class="w-full"></date-picker>
        </div>
      </div>

      <div>
        <label for="to" class="block text-sm font-medium text-gray-700">To</label>
        <div class="mt-1">
          <date-picker id="to" v-model="filters.end" :show-second="false" :minute-step="15" type="datetime"
                       class="w-full"></date-picker>
        </div>
      </div>

      <div>
        <p>Options</p>

        <div class="relative flex items-start mt-2" v-for="(price, attribute) in attributes" :key="attribute">
          <div class="flex items-center h-5">
            <input :id="attribute" :name="attribute" :value="attribute" type="checkbox"
                   class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                   v-model="filters.attributes">
          </div>
          <div class="ml-3 text-sm flex justify-between flex-grow">
            <label :for="attribute" class="font-medium text-gray-700">{{ ucFirst(attribute) }}</label>
            <p class="text-gray-500">+{{ price / 100 }}$/hour</p>
          </div>
        </div>
      </div>

      <div>
        <p>Size</p>

        <div class="grid grid-cols-3 gap-3 mt-2">
          <div v-for="(size, index) in sizes" :key="index"
               @click="filters.size = size.name"
               class="p-6 bg-gray-50 flex flex-col justify-center items-center cursor-pointer rounded border-gray-300"
               :class="{'bg-gray-300' : filters.size === size.name}"
          >
            <p class="text-gray-700 text-lg font-bold">{{ ucFirst(size.name) }}</p>
            <p class="text-gray-600">{{ size.price / 100 }}$/h</p>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <div v-if="showSpotsSection" class="grid mt-8">
      <div :class="{'text-center' : !hasAvailableSpots}">
        <div v-if="hasAvailableSpots" class="grid grid-cols-2">
          <div class="text-xl text-green-500 font-bold flex items-center">
            {{ this.spots.length }} available spots
          </div>
          <div>
            <template v-if="selectedSpot">
              <div class="text-gray-500 mr-4 flex justify-between">
                <span>Selected spot</span>
                <span
                  v-text="manualSpotSelection ? 'close' : 'Change spot'"
                  v-if="hasAvailableSpots && this.spots.length > 1" class="cursor-pointer text-gray-500 font-bold"
                  @click="manualSpotSelection = !manualSpotSelection">
               </span>
              </div>
              <div>
                <div>
                  Floor :
                  <span class="text-lg leading-6 font-medium text-gray-900">{{ this.selectedSpot.floor }}</span>
                  Number :
                  <span class="text-lg leading-6 font-medium text-gray-900">{{ this.selectedSpot.number }}</span>
                </div>
                <div>
                  Options :  <span class="mr-2" v-for="attribute in this.selectedSpot.attributes">{{ ucFirst(attribute) }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div v-else class="text-center">
          <span class="text-red-500 text-xl">No available spots matching current filters</span>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-6" v-if="manualSpotSelection">
        <div v-for="spot in sortedSpots" class="shadow-md p-3 cursor-pointer rounded-lg text-gray-500" @click="selectSpot(spot)" v-if="selectedSpot.id !== spot.id">
          <div class="grid grid-cols-2">
           <div class="" >
             <p>
               <span>Floor</span>
               <span class="text-lg leading-6 font-medium text-gray-600">{{ spot.floor }}</span>
             </p>
             <p>
               <span>Spot no.</span>
               <span class="text-lg leading-6 font-medium text-gray-600">{{ spot.number }}</span>
             </p>
           </div>
            <p v-if="spot.attributes.length" class="flex flex-col space-y-2">
              <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800" v-for="attribute in spot.attributes">{{ ucFirst(attribute) }}</span>
            </p>
            <p v-else class="mt-2 text-center">
              No special options
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-2" v-if="selectedSpot">
      <div class="text-center">
        <p v-if="price" class="text-4xl tracking-tight font-extrabold text-gray-700">{{ (price / 100).toLocaleString("en-US", {style:"currency", currency:"USD"}) }}</p>
      </div>
      <div class="text-center">
        <button type="button"
                @click="issueCheckoutUrl()"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
          Continue to payment
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';

export default {
  components: {DatePicker},
  data() {
    return {
      selectedSpot: null,
      price: 0,
      manualSpotSelection: false,
      attributes: [],
      reservationId: null,
      sizes: [],
      filters: {
        size: '',
        start: '',
        end: '',
        attributes: []
      },
      spots: []
    }
  },
  props: {
    garage: {
      type: Object,
      required: false
    }
  },
  watch: {
    garage: function (newValue, oldValue) {
      if (typeof newValue === 'object' && newValue !== null) {
        this.fetchDetails()
      } else {
        this.attributes = []
        this.sizes = []
        this.filters = {
          size: '',
          start: '',
          end: '',
          attributes: []
        }
      }
    },
    async selectedSpot(newValue, oldValue) {
      if (newValue && Object.keys(newValue).length) {
        // create reservation
        const {data} = await this.$axios.post(`${process.env.API_URL}/reservations`, {
          'start': this.filters.start.toISOString(),
          'end': this.filters.end.toISOString(),
          'spot_id': newValue.id
        })
        this.reservationId = data.data.id
        await this.getReservationPrice(data.data.id)
      }
    },
    filters: {
      handler(val) {
        if (!this.canFilterSpots) {
          return
        }

        this.filterSpots()
      },
      deep: true
    }
  },
  computed: {
    hasAvailableSpots() {
      return this.spots.length > 0
    },
    showSpotsSection() {
      return typeof this.filters.start === 'object'
        && typeof this.filters.end === 'object'
        && this.filters.size.length
    },
    canFilterSpots() {
      return this.showSpotsSection
    },
    sortedSpots() {
      return this.spots.sort((a, b) => parseFloat(a.floor) - parseFloat(b.floor) || parseFloat(a.number) - parseFloat(b.number));
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    async fetchDetails() {
      const {data} = await this.$axios.get(`${process.env.API_URL}/garages/${this.garage.id}`)

      this.attributes = data.data.attributes
      this.sizes = data.data.sizes
    },
    async filterSpots() {
      this.selectSpot(null)
      const {data} = await this.$axios.get(`${process.env.API_URL}/garages/${this.garage.id}/spots?${this.buildFilterUrl()}`)
      this.spots = data.data
      if (this.spots.length) {
        this.selectRandomSpot()
      }
    },
    async getReservationPrice(reservationId) {
      const {data} = await this.$axios.post(`${process.env.API_URL}/calculate-payment`, {
        reservation_id : reservationId
      })
      this.price = data
    },
    selectSpot(spot) {
      this.selectedSpot = spot
      this.price = 0
      this.manualSpotSelection = false
    },
    selectRandomSpot() {
      this.selectedSpot = this.spots[Math.floor(Math.random() * this.spots.length)];
    },
    async issueCheckoutUrl() {
      const {data} = await this.$axios.get(`${process.env.API_URL}/checkout/${this.reservationId}`)
      window.location.replace(data.url);
      // console.log('checkout url', data)
    },
    buildFilterUrl() {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(this.removeEmptyAttributes(this.filters))) {
        if (key === 'attributes') {
          value.forEach((entry) => {
            searchParams.append(`${key}[]`, entry)
          });
        } else if (['start', 'end'].includes(key)) {
          searchParams.append(key, value.toISOString())
        } else if (key === 'size') {
          searchParams.append(key, value)
        }
      }
      return searchParams.toString()
    },
    ucFirst(str) {
      let firstLetter = str.substr(0, 1);
      return firstLetter.toUpperCase() + str.substr(1);
    },
    removeEmptyAttributes(obj) {
      return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null && (v.length || typeof v === 'object')));
    }
  }
}
</script>
