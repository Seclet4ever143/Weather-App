<template>
  <v-app>
    <v-main class="weather-bg">
      <v-container fluid class="fill-height">
        <v-row justify="center" align="center">
          <v-col cols="12" sm="10" md="8" lg="6">
            <v-card class="mx-auto" max-width="500" elevation="10" rounded="lg">
              <v-card-title class="text-h4 font-weight-bold text-center primary--text py-6">
                Weather Forecast
              </v-card-title>
              
              <v-card-text>
                <v-form @submit.prevent="fetchWeather" class="mb-6">
                  <v-text-field
                    v-model="city"
                    label="Enter city"
                    prepend-inner-icon="mdi-map-marker"
                    outlined
                    rounded
                    clearable
                    @keyup.enter="fetchWeather"
                    hide-details
                    class="mb-4"
                  ></v-text-field>
                  <v-btn
                    color="primary"
                    block
                    x-large
                    rounded
                    elevation="2"
                    @click="fetchWeather"
                    :loading="loading"
                    :disabled="loading"
                  >
                    <v-icon left>mdi-cloud-search</v-icon>
                    Get Weather
                  </v-btn>
                </v-form>

                <v-alert v-if="error" type="error" class="mb-4" rounded="lg" dense>
                  {{ error }}
                </v-alert>

                <v-card v-if="weather" class="mb-4" outlined rounded="lg">
                  <v-card-text>
                    <v-row align="center" no-gutters>
                      <v-col cols="12" class="text-center mb-4">
                        <h2 class="text-h4 font-weight-bold primary--text mb-2">{{ weather.name }}</h2>
                        <p class="text-subtitle-1 text-capitalize">{{ weather.weather[0].description }}</p>
                      </v-col>
                      <v-col cols="6" class="text-center">
                        <v-icon size="80" color="primary">{{ getWeatherIcon(weather.weather[0].icon) }}</v-icon>
                      </v-col>
                      <v-col cols="6" class="text-center">
                        <div class="text-h2 font-weight-bold">{{ Math.round(weather.main.temp) }}°C</div>
                        <div class="text-subtitle-1">Feels like {{ Math.round(weather.main.feels_like) }}°C</div>
                      </v-col>
                    </v-row>
                    <v-divider class="my-4"></v-divider>
                    <v-row>
                      <v-col cols="6" v-for="(item, index) in weatherDetails" :key="index">
                        <v-list-item>
                          <v-list-item-icon>
                            <v-icon color="primary">{{ item.icon }}</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title class="text-subtitle-2">{{ item.title }}</v-list-item-title>
                            <v-list-item-subtitle class="text-h6">{{ item.value }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      city: '',
      weather: null,
      error: '',
      loading: false,
    }
  },
  computed: {
    weatherDetails() {
      if (!this.weather) return []
      return [
        { icon: 'mdi-water-percent', title: 'Humidity', value: `${this.weather.main.humidity}%` },
        { icon: 'mdi-weather-windy', title: 'Wind Speed', value: `${this.weather.wind.speed} m/s` },
        { icon: 'mdi-gauge', title: 'Pressure', value: `${this.weather.main.pressure} hPa` },
        { icon: 'mdi-cloud', title: 'Cloudiness', value: `${this.weather.clouds.all}%` },
      ]
    },
  },
  methods: {
    async fetchWeather() {
      if (this.city.trim() === '') {
        this.error = 'Please enter a city name.'
        return
      }

      this.loading = true
      this.error = ''
      this.weather = null

      try {
        const apiKey = 'cf4b6b35ce19472cbcbac18172412a8a' // Replace with your OpenWeatherMap API key
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${apiKey}`
        )
        const data = await response.json()

        if (data.cod === 200) {
          this.weather = data
        } else {
          this.error = 'City not found. Please try again.'
        }
      } catch (error) {
        this.error = 'Unable to fetch weather data. Please try again later.'
      } finally {
        this.loading = false
      }
    },
    getWeatherIcon(iconCode) {
      const iconMap = {
        '01d': 'mdi-weather-sunny',
        '01n': 'mdi-weather-night',
        '02d': 'mdi-weather-partly-cloudy',
        '02n': 'mdi-weather-night-partly-cloudy',
        '03d': 'mdi-weather-cloudy',
        '03n': 'mdi-weather-cloudy',
        '04d': 'mdi-weather-cloudy',
        '04n': 'mdi-weather-cloudy',
        '09d': 'mdi-weather-pouring',
        '09n': 'mdi-weather-pouring',
        '10d': 'mdi-weather-partly-rainy',
        '10n': 'mdi-weather-night-partly-rainy',
        '11d': 'mdi-weather-lightning',
        '11n': 'mdi-weather-lightning',
        '13d': 'mdi-weather-snowy',
        '13n': 'mdi-weather-snowy',
        '50d': 'mdi-weather-fog',
        '50n': 'mdi-weather-fog',
      }
      return iconMap[iconCode] || 'mdi-weather-cloudy'
    },
  },
}
</script>

<style>
.weather-bg {
  background: linear-gradient(135deg, #6e45e2, #88d3ce);
  min-height: 100vh;
}
</style>