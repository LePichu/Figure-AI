# Figure-AI

An experimental project that tries to recreate something like [Character.AI](https://c.ai/) on a smaller scale, with its own persistent, local characters.

## Tech Stack

- **Frontend:** [Vue 3](https://vuejs.org/) (powered by [Vite](https://vitejs.dev/))
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Routing:** [Vue Router](https://router.vuejs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **API Client:** [openai-node](https://github.com/openai/openai-node)
- **Backend:** Any local AI model served via an OpenAI-compatible API endpoint (e.g., [LM Studio](https://lmstudio.ai/), [Ollama](https://ollama.ai/)) (I am using `llama-cpp`'s server locally with the LLaMa 3 8B Uncensored variant).

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/LePichu/Figure-AI.git
    cd Figure-AI
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Run your local AI server** and ensure its API is available at `http://127.0.0.1:3000/v1`.

4.  **Start the development server:**
    ```bash
    pnpm run dev
    ```

## License

This project is licensed under the [**MIT License**](./LICENSE).
