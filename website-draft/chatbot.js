class PortfolioAssistant {
  constructor() {
    this.messages = [];
    this.isOpen = false;
    this.isLoading = false;
    this.init();
  }

  init() {
    this.createWidget();
    this.attachEventListeners();
  }

  createWidget() {
    const widget = document.createElement("div");
    widget.id = "portfolio-assistant";
    widget.innerHTML = `
      <div class="assistant-container">
        <div class="assistant-label">AI Assistant</div>
        <div class="assistant-button" id="assistantToggle" role="button" tabindex="0" aria-label="Open AI Assistant">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
      </div>

      <div class="assistant-chat" id="assistantChat" hidden>
        <div class="chat-header">
          <h3>Ask me about Yumei's work</h3>
          <button id="assistantClose" aria-label="Close chat">×</button>
        </div>
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input-area">
          <input
            type="text"
            id="chatInput"
            placeholder="What would you like to know?"
            aria-label="Message input"
          />
          <button id="chatSend" aria-label="Send message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(widget);
  }

  attachEventListeners() {
    const toggleBtn = document.getElementById("assistantToggle");
    const closeBtn = document.getElementById("assistantClose");
    const sendBtn = document.getElementById("chatSend");
    const input = document.getElementById("chatInput");
    const chat = document.getElementById("assistantChat");

    toggleBtn.addEventListener("click", () => this.toggleChat());
    toggleBtn.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.toggleChat();
      }
    });

    closeBtn.addEventListener("click", () => this.toggleChat());
    sendBtn.addEventListener("click", () => this.sendMessage());

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.sendMessage();
      }
    });
  }

  toggleChat() {
    const chat = document.getElementById("assistantChat");
    const button = document.getElementById("assistantToggle");
    const container = document.querySelector(".assistant-container");

    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      chat.removeAttribute("hidden");
      container.classList.add("chat-open");
      // Show greeting only when opening with empty messages
      if (this.messages.length === 0) {
        this.addSystemMessage("Hi! I'm Yumei's AI assistant. Ask me anything about her projects, experience, or approach to product management.");
      }
      document.getElementById("chatInput").focus();
    } else {
      chat.setAttribute("hidden", "");
      container.classList.remove("chat-open");
    }
    button.setAttribute("aria-expanded", this.isOpen);
  }

  addSystemMessage(text) {
    const messagesDiv = document.getElementById("chatMessages");
    const msgEl = document.createElement("div");
    msgEl.className = "message assistant-message system-message";
    const time = this.getFormattedTime();
    msgEl.innerHTML = `<div class="message-content">${text}</div><div class="message-time">${time}</div>`;
    messagesDiv.appendChild(msgEl);
    this.scrollToBottom();
  }

  async sendMessage() {
    const input = document.getElementById("chatInput");
    const text = input.value.trim();

    if (!text || this.isLoading) return;

    this.isLoading = true;
    input.disabled = true;

    const userMessage = { role: "user", content: text };
    this.messages.push(userMessage);
    this.displayMessage("user", text);

    input.value = "";
    input.disabled = false;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: this.messages }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Server responded with:", errorBody);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = { role: "assistant", content: data.content };
      this.messages.push(assistantMessage);
      this.displayMessage("assistant", data.content);
    } catch (error) {
      console.error("Chat error:", error);
      this.displayMessage(
        "assistant",
        "Sorry, I encountered an error. Please try again."
      );
    } finally {
      this.isLoading = false;
      input.disabled = false;
      input.focus();
    }
  }

  displayMessage(role, content) {
    const messagesDiv = document.getElementById("chatMessages");
    const msgEl = document.createElement("div");
    msgEl.className = `message ${role}-message`;
    const time = this.getFormattedTime();
    msgEl.innerHTML = `<div class="message-content">${content}</div><div class="message-time">${time}</div>`;
    messagesDiv.appendChild(msgEl);
    this.scrollToBottom();
  }

  getFormattedTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  scrollToBottom() {
    const messagesDiv = document.getElementById("chatMessages");
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new PortfolioAssistant();
});
