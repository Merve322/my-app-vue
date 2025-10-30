import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './pages/Home.vue'
import TodoDetail from './pages/TodoDetail.vue'
import NotFound from './pages/NotFound.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import TodoList from './components/TodoList.vue'
import Pagination from './components/Pagination.vue'
import Filter from './components/Filter.vue'
import TodoForm from './components/TodoForm.vue'
import SyncStatus from './components/SyncStatus.vue'
import './style.css'


const routes = [
  { path: '/', component: Home },
  { path: '/todos/:id', component: TodoDetail },
  { path: '/:pathMatch(.*)*', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)

// Register global components
app.component('TodoList', TodoList)
app.component('Pagination', Pagination)
app.component('Filter', Filter)
app.component('TodoForm', TodoForm)
app.component('SyncStatus', SyncStatus)
app.component('ErrorBoundary', ErrorBoundary)

app.use(router).mount('#app')