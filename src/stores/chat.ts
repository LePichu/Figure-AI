import { ref, watch } from "vue"
import { defineStore } from "pinia"

// Define the structure of a message
export interface Message {
	role: "user" | "assistant"
	content: string
}

// Define the structure for the entire chat state
interface ChatState {
	[characterName: string]: Message[]
}

export const useChatStore = defineStore("chat", () => {
	// Load initial state from localStorage or set to empty object
	const chats = ref<ChatState>(JSON.parse(localStorage.getItem("chat_history") || "{}"))

	// Watch for changes in the chats ref and save to localStorage
	watch(
		chats,
		(newChats) => {
			localStorage.setItem("chat_history", JSON.stringify(newChats))
		},
		{ deep: true },
	)

	// Function to get messages for a specific character
	function getMessages(characterName: string): Message[] {
		if (!chats.value[characterName]) {
			chats.value[characterName] = []
		}
		return chats.value[characterName]
	}

	// Function to add a message for a specific character
	function addMessage(characterName: string, message: Message) {
		if (!chats.value[characterName]) {
			chats.value[characterName] = []
		}
		chats.value[characterName].push(message)
	}

	// Function to clear chat history for a specific character
	function clearChat(characterName: string) {
		if (chats.value[characterName]) {
			chats.value[characterName] = []
		}
	}

	return { chats, getMessages, addMessage, clearChat }
})
