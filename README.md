# decideIT 🍽️ — AI-Powered Swiggy Food Decision Engine

> **Stop arguing, start eating!** An ultra-fast, production-grade web application that cures food indecision by pairing your current mood, time of day, location, and Swiggy order history with generative AI and Swiggy's Model Context Protocol (MCP) tools.

---

## ✨ Features

1. **Swiggy MCP & API Integration**:
   - Speaks standard **Model Context Protocol (JSON-RPC 2.0)** over streamable HTTP (`https://mcp.swiggy.com/food`).
   - Automatically accesses Swiggy tools: `get_food_orders`, `get_food_order_details`, `get_addresses`, `add_to_cart`, `trigger_checkout`.
   - Comprehensive high-fidelity catalog of authentic restaurants across Bengaluru, Mumbai, Delhi, Hyderabad (Meghana Foods, Truffles, California Burrito, Rameshwaram Cafe, Brik Oven, Chai Point, Punjab Rasoi) with direct deep-links to Swiggy.

2. **Multimodal User Interaction (Voice & Text)**:
   - **Voice Input**: Web Speech Recognition API (`webkitSpeechRecognition`) with Indian English (`en-IN`) dialect support, audio wave animations, and instant transcription.
   - **Quick Mood Chips**: One-tap discovery for *"Exhausted after work 🥱"*, *"Late night cravings 🌙"*, *"Healthy & fresh 🥗"*, *"Spicy comfort 🌶️"*, *"Tea & Crispy Snacks ☕"*, etc.
   - **Diet & Preference Filters**: Pure Veg, Non-Veg, and All Diets with real-time dish filtering.

3. **Tinder-Style Swipeable Food Deck**:
   - **Mobile**: Physics-based touch swipe (Swipe Right = Want this ❤️, Swipe Left = Pass ❌).
   - **Web / Desktop**: Keyboard navigation (Arrow Left = Pass, Arrow Right = Want this, Space = Super Like) + click buttons.
   - **AI Match Insight**: Every card displays a personalized rationale explaining *why* the AI chose this dish based on your mood, time of day, and past ordering frequency.
   - **Live In-Deck Refinement**: Speak or type tweaks while browsing ("Make it spicier", "Show me something with rice") to dynamically re-rank the deck.

4. **Celebratory Order & Checkout Flow**:
   - Confetti celebration upon decision victory!
   - Full bill breakdown (dish price, delivery fee with Swiggy One indicator, GST).
   - **Order on Swiggy**: Direct deep-link redirect to the Swiggy restaurant page.
   - **Instant MCP Sync**: One-click add to cart via Swiggy MCP server session.
   - **Share Decision**: Copy decision text to share with family, friends, or roommates.

5. **Interchangeable AI Models & Secure BYOK (Bring Your Own Key)**:
   - **Supported Providers**:
     * **Google Gemini** (`gemini-2.5-flash`, `gemini-1.5-pro`)
     * **Groq** (`llama-3.3-70b-versatile`)
     * **OpenAI** (`gpt-4o`, `gpt-4o-mini`)
     * **Anthropic Claude** (`claude-3-5-sonnet`, `claude-3-5-haiku`)
     * **OpenRouter**
     * **Built-in Smart Heuristic AI** (runs out-of-the-box with zero keys required)
   - **Zero-Server Key Leakage**: Keys are stored exclusively in the user's browser `localStorage` and sent directly to official endpoints.
   - **Live Key Verification**: Real-time ping test validates keys and quotas before saving.

---

## 🚀 Quick Start with Bun

### 1. Install Dependencies
```bash
bun install
```

### 2. Start Dev Server
```bash
bun run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Unit Tests
```bash
bun test
```

### 4. Build for Production
```bash
bun run build
```

---

## 🛠️ Tech Stack & Architecture

- **Runtime**: [Bun](https://bun.sh/) 1.4+
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom Swiggy color palette (`#FC8019`), dark mode, and glassmorphism
- **Animations**: Framer Motion (gesture drag physics & card rotations) + canvas-confetti
- **Icons**: Lucide React
- **Voice**: Web Speech Recognition API
- **Protocol**: Model Context Protocol (MCP) JSON-RPC 2.0
