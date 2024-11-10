import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import '@mdi/font/css/materialdesignicons.css' // Import mdi font icons globally


createApp(App)
  .use(vuetify)
  .mount('#app')