import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './assets/main.css'
import { createWebHistory, createRouter } from 'vue-router'
import { createPinia } from 'pinia'
import VueMask from '@devindex/vue-mask'; // <-- ADD THIS LINE

import LoginView from '@/pages/login.vue'
import IndexView from '@/pages/index.vue'
import ContatoView from '@/pages/contato.vue'

const routes = [
    { path: '/', component: IndexView },
    { path: '/login', component: LoginView },
    { path: '/contatos', component: ContatoView },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})
const app = createApp(App)
app.use(VueMask);  // <-- ADD THIS LINE
app.use(createPinia())
app.use(router)
app.mount('#app')
