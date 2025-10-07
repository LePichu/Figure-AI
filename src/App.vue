<script setup lang="ts">
import { RouterView } from "vue-router"
</script>

<template>
	<div class="bg-gray-900 text-white min-h-screen font-sans">
		<RouterView />
	</div>
</template>

<style>
/* Basic styles to complement Tailwind */
body {
	background-color: #111827; /* bg-gray-900 */
}
</style>
