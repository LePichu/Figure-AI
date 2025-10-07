import { createRouter, createWebHistory } from "vue-router"
import LandingView from "../views/LandingView.vue"
import ChatView from "../views/ChatView.vue"

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "landing",
			component: LandingView,
		},
		{
			path: "/chat/:name",
			name: "chat",
			component: ChatView,
			props: true,
		},
	],
})

export default router
