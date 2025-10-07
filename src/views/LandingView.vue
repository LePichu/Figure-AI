<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()

const selectCharacter = (name: string) => {
	router.push(`/chat/${name}`)
}
</script>

<template>
	<div
		class="min-h-screen bg-zinc-900 bg-gradient-to-tr from-black via-zinc-900 to-black flex items-center justify-center p-4"
	>
		<!-- Modal Window -->
		<div
			class="w-full max-w-2xl bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 text-center text-white animate-fade-in"
		>
			<h1 class="text-4xl font-bold mb-2">Welcome</h1>
			<p class="text-gray-300 mb-8 text-lg">
				Please select a character to begin chatting with.
			</p>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Felix Card -->
				<div
					@click="selectCharacter('felix')"
					class="bg-white/5 p-8 rounded-xl border border-white/10 hover:bg-pink-500/20 hover:border-pink-400 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 flex flex-col items-center justify-center"
				>
					<div class="text-6xl mb-4">♂️</div>
					<h2 class="text-2xl font-semibold text-pink-200">Felix</h2>
					<p class="text-pink-300/80 mt-1">Clingy & Sweet</p>
				</div>

				<!-- Alex Card -->
				<div
					@click="selectCharacter('alex')"
					class="bg-white/5 p-8 rounded-xl border border-white/10 hover:bg-red-500/20 hover:border-red-400 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 flex flex-col items-center justify-center"
				>
					<div class="text-6xl mb-4">♀️</div>
					<h2 class="text-2xl font-semibold text-red-200">Alex</h2>
					<p class="text-red-300/80 mt-1">Tough & Tsundere</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@keyframes fade-in {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-fade-in {
	animation: fade-in 0.5s ease-out forwards;
}
</style>
