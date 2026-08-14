import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { revealDirective } from './directives/reveal'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.directive('reveal', revealDirective)
app.use(router)

app.mount('#app')
