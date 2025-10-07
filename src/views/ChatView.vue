<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useChatStore, type Message } from "@/stores/chat"
import OpenAI from "openai"
import { marked } from "marked"

const API_BASE_URL = "http://127.0.0.1:3000/v1"
const MODEL_NAME = "llama-3.2-uncensored"

const openai = new OpenAI({
	baseURL: API_BASE_URL,
	apiKey: "not-needed",
	dangerouslyAllowBrowser: true,
})

const router = useRouter()
const chatStore = useChatStore()

const props = defineProps<{
	name: string
}>()

const characterName = ref(props.name.toLowerCase())
const systemPrompt = ref("")
const userInput = ref("")
const isLoading = ref(false)
const chatContainer = ref<HTMLElement | null>(null)
const characterInfo = ref({ identity: "", instructions: "" })

const messages = computed(() => chatStore.getMessages(characterName.value))

const theme = computed(() => {
	if (characterName.value === "felix") {
		return {
			bg: "bg-pink-500/10",
			headerBg: "bg-pink-900/50",
			headerText: "text-pink-200",
			userBubble: "bg-blue-500 text-white",
			assistantBubble: "bg-pink-500 text-white",
			inputBorder: "border-pink-600 focus:border-pink-400",
			sendButton: "bg-pink-600 hover:bg-pink-500 text-white",
			clearButton: "text-pink-400 hover:text-pink-300",
			backButton: "text-pink-300 hover:text-pink-100",
			prose: "prose-pink",
		}
	}
	return {
		bg: "bg-red-500/10",
		headerBg: "bg-red-900/50",
		headerText: "text-red-200",
		userBubble: "bg-gray-600 text-white",
		assistantBubble: "bg-red-600 text-white",
		inputBorder: "border-red-600 focus:border-red-400",
		sendButton: "bg-red-600 hover:bg-red-500 text-white",
		clearButton: "text-red-400 hover:text-red-300",
		backButton: "text-red-300 hover:text-red-100",
		prose: "prose-red",
	}
})

onMounted(async () => {
	await loadCharacterData()
	scrollToBottom()
})

const loadCharacterData = async () => {
	try {
		const [identityRes, instructionsRes] = await Promise.all([
			fetch(`/models/${characterName.value}/IDENTITY.md`),
			fetch(`/models/${characterName.value}/INSTRUCTIONS.md`),
		])
		if (!identityRes.ok || !instructionsRes.ok) {
			throw new Error(`Could not load model files for ${characterName.value}`)
		}
		characterInfo.value.identity = await identityRes.text()
		characterInfo.value.instructions = await instructionsRes.text()
		systemPrompt.value = `${characterInfo.value.identity}\n\n${characterInfo.value.instructions}`
	} catch (error) {
		console.error("Failed to load character data:", error)
		router.push("/")
	}
}

const sendMessage = async () => {
	if (userInput.value.trim() === "" || isLoading.value) return

	const userMessage: Message = { role: "user", content: userInput.value.trim() }
	chatStore.addMessage(characterName.value, userMessage)
	userInput.value = ""
	isLoading.value = true
	scrollToBottom()

	try {
		const completion = await openai.chat.completions.create({
			model: MODEL_NAME,
			messages: [{ role: "system", content: systemPrompt.value }, ...messages.value],
			stream: false,
		})

		const assistantMessage = completion.choices[0]?.message
		if (assistantMessage) {
			chatStore.addMessage(characterName.value, assistantMessage as Message)
		}
	} catch (error) {
		console.error("API Error:", error)
		const errorMessage: Message = {
			role: "assistant",
			content:
				"Sorry, I'm having trouble connecting to my brain right now. (Check the local server and console for errors.)",
		}
		chatStore.addMessage(characterName.value, errorMessage)
	} finally {
		isLoading.value = false
		scrollToBottom()
	}
}

const handleClearChat = () => {
	chatStore.clearChat(characterName.value)
}

const scrollToBottom = () => {
	nextTick(() => {
		if (chatContainer.value) {
			chatContainer.value.scrollTop = chatContainer.value.scrollHeight
		}
	})
}

const renderMarkdown = (content: string) => {
	return marked.parse(content, { gfm: true, breaks: true })
}

const capitalizedName = computed(() => {
	return characterName.value.charAt(0).toUpperCase() + characterName.value.slice(1)
})

watch(
	() => props.name,
	async (newName) => {
		characterName.value = newName.toLowerCase()
		await loadCharacterData()
		scrollToBottom()
	},
)
</script>

<template>
	<div class="flex flex-col h-screen" :class="theme.bg">
		<header
			:class="theme.headerBg"
			class="p-4 shadow-lg flex items-center justify-between border-b border-white/10 shrink-0"
		>
			<button @click="router.push('/')" :class="theme.backButton" class="font-bold text-lg">
				&larr; Back
			</button>
			<h1 :class="theme.headerText" class="text-2xl font-bold capitalize">
				{{ capitalizedName }}
			</h1>
			<button @click="handleClearChat" :class="theme.clearButton" class="font-bold text-sm">
				Clear Chat
			</button>
		</header>

		<main ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
			<div
				v-for="(msg, index) in messages"
				:key="index"
				class="flex"
				:class="{
					'justify-end': msg.role === 'user',
					'justify-start': msg.role === 'assistant',
				}"
			>
				<div
					class="max-w-lg lg:max-w-2xl px-4 py-2 rounded-2xl"
					:class="msg.role === 'user' ? theme.userBubble : theme.assistantBubble"
				>
					<div
						class="prose prose-invert prose-sm max-w-none"
						v-html="renderMarkdown(msg.content)"
					></div>
				</div>
			</div>
			<div v-if="isLoading" class="flex justify-start">
				<div
					class="max-w-lg lg:max-w-2xl px-4 py-3 rounded-2xl"
					:class="theme.assistantBubble"
				>
					<div class="flex items-center space-x-2">
						<div
							class="w-2 h-2 bg-white/50 rounded-full animate-pulse [animation-delay:-0.3s]"
						></div>
						<div
							class="w-2 h-2 bg-white/50 rounded-full animate-pulse [animation-delay:-0.15s]"
						></div>
						<div class="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
					</div>
				</div>
			</div>
		</main>

		<footer class="p-4 shrink-0">
			<form @submit.prevent="sendMessage" class="flex items-center space-x-2">
				<input
					v-model="userInput"
					type="text"
					:placeholder="`Message ${capitalizedName}...`"
					class="w-full p-3 bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 transition"
					:class="theme.inputBorder"
				/>
				<button
					type="submit"
					:disabled="isLoading"
					class="p-3 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
					:class="theme.sendButton"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-send-horizontal"
					>
						<path d="m3 3 3 9-3 9 19-9Z" />
						<path d="M6 12h16" />
					</svg>
				</button>
			</form>
		</footer>
	</div>
</template>

<style>
.prose ul,
.prose ol {
	padding-left: 1.25rem;
}
.prose a {
	color: inherit;
	text-decoration: underline;
}
.prose pre {
	background-color: rgba(0, 0, 0, 0.2);
	padding: 0.75rem;
	border-radius: 0.5rem;
	color: white;
}

::-webkit-scrollbar {
	width: 0;
}
</style>
