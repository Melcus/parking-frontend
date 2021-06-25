<template>
  <div
    class="absolute rounded-md top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 w-full max-w-5xl bg-white py-8"
    v-if="garage && Object.keys(garage).length">

    <div class="flex pb-6">
      <div class="w-5/6">{{ garage.name }}</div>
      <div class="w-1/6 text-right cursor-pointer hover:text-blue-600" @click="close()">x</div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div>
        <label for="from" class="block text-sm font-medium text-gray-700">From</label>
        <div class="mt-1">
          <input type="text" name="from" id="from" v-model="filters.start"
                 class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                 placeholder="date">
        </div>
      </div>

      <div>
        <label for="to" class="block text-sm font-medium text-gray-700">To</label>
        <div class="mt-1">
          <input type="text" name="to" id="to" v-model="filters.end"
                 class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                 placeholder="date">
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
               class="p-6 bg-gray-100 flex flex-col justify-center items-center cursor-pointer border-2 border-gray-300"
               :class="{'bg-gray-300' : filters.size === size.name}"
          >
            <p class="text-gray-700 text-lg font-bold">{{ ucFirst(size.name) }}</p>
            <p class="text-gray-600">{{ size.price / 100 }}$/h</p>
          </div>
        </div>
      </div>
    </div>


   <hr>

    <div v-if="showSpotsSection" class="grid mt-8" :class="[hasAvailableSpots ? 'grid-cols-2' : 'grid-cols-1']">
      <div :class="{'text-center' : !hasAvailableSpots}">
        <template v-if="hasAvailableSpots">
         <span class="text-xl text-green-500 font-bold">{{ this.spots.length }} available spots</span>
        </template>
        <template v-else>
          <span class="text-red-500 text-xl text-center">No available spots matching current filters</span>
        </template>
      </div>
      <div
        v-text="manualSpotSelection ? 'close' : 'Change spot'"
        v-if="hasAvailableSpots" class="cursor-pointer text-right text-gray-500" @click="manualSpotSelection = !manualSpotSelection">

      </div>

      <div class="" v-if="manualSpotSelection">
        <div v-for="spot in spots" class="mt-2">
          {{ spot }}
        </div>
      </div>
    </div>

    <div class="mt-6">
      {{ filters }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      manualSpotSelection : false,
      attributes: [],
      sizes: [],
      filters: {
        size: '',
        start: '2021-06-26T20:19:27.866114Z',
        end: '2021-06-27T20:19:27.866114Z',
        attributes: []
      },
      spots : []
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
  computed : {
    hasAvailableSpots() {
      return this.spots.length > 0
    },
    showSpotsSection() {
      return this.filters.start.length && this.filters.end.length
    },
    canFilterSpots() {
      return this.showSpotsSection
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
      const {data} = await this.$axios.get(`${process.env.API_URL}/garages/${this.garage.id}/spots?${this.buildFilterUrl()}`)
      this.spots = data.data
    },
    buildFilterUrl() {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(this.removeEmptyAttributes(this.filters))) {
        if (value instanceof Array) {
          value.forEach((entry) => {
            searchParams.append(`${key}[]`, entry)
          });
        } else {
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
      return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null && v.length ));
    }
  }
}
</script>
