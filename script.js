const chatArea = document.getElementById("chat-area");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

if (sendBtn && input && chatArea) {
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // Load chat history on page load
  document.addEventListener('DOMContentLoaded', function() {
    loadChatHistory();
  });
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  // Show thinking animation
  showThinkingAnimation();

  try {
    // 🔥 Call your backend AI endpoint
    console.log("📤 Sending message to backend:", text);

    // --- NEW: Prepare History for Context ---
    // We get the full history, but we exclude the last item (slice 0, -1)
    // because we just added the current message to history in the line above (addMessage),
    // and we are sending it explicitly in the 'message' field.
    const rawHistory = getChatHistory();
    const contextHistory = rawHistory.slice(0, -1).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model', // Map 'bot' -> 'model'
      content: msg.message
    }));
    // ----------------------------------------

    // Use relative path (avoid hardcoded host/port) and add timeout
    const apiUrl = "/api/ai-response";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: text,
        history: contextHistory // <--- Sending history here
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      // try to get response body for debug
      const txt = await response.text().catch(() => "<no body>");
      throw new Error(`HTTP ${response.status} ${response.statusText} - ${txt}`);
    }

    const data = await response.json().catch(async () => {
      const txt = await response.text().catch(() => "<no body>");
      throw new Error("Invalid JSON response: " + txt);
    });

    console.log("🤖 Received from backend:", data);

    hideThinkingAnimation();
    
    // The backend returns { reply: "...", triage: {...} }
    // We display the conversational reply.
    addMessage(data.reply || "Sorry, I didn’t understand that.", "bot");
    
    // Optional: If you want to use the structured data later, you can access data.triage here.
    if (data.triage && data.triage.stage === 'triage') {
        console.log("✅ Triage Complete:", data.triage);
    }

  } catch (error) {
    console.error("❌ AI Response Error:", error);
    hideThinkingAnimation();
    addMessage(
      "I'm sorry, I'm having trouble connecting right now. Please try again later.",
      "bot"
    );
  }
}

function addMessage(msg, sender) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container", sender === "user" ? "user-container" : "bot-container");
  
  // Create avatar
  const avatar = document.createElement("div");
  avatar.classList.add("avatar", sender === "user" ? "user-avatar" : "bot-avatar");
  if (sender === "user") {
    avatar.innerHTML = "👤";
  } else {
    // Use the Symptomate logo image for bot
    avatar.innerHTML = '<img src="symptomate_logo_small.png" alt="Symptomate" class="avatar-image">';
  }
  
  // Create message content
  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");
  
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(sender === "user" ? "user-message" : "bot-message");
  
  if (sender === "bot") {
    // Add typing animation for bot messages
    messageDiv.innerHTML = '<span class="typing-indicator">●</span>';
    messageContainer.appendChild(avatar);
    messageContainer.appendChild(messageContent);
    messageContent.appendChild(messageDiv);
    chatArea.appendChild(messageContainer);
    
    // Trigger typing animation
    typeMessage(messageDiv, msg);
  } else {
    // User messages appear instantly
    messageDiv.textContent = msg;
    messageContainer.appendChild(avatar);
    messageContainer.appendChild(messageContent);
    messageContent.appendChild(messageDiv);
    chatArea.appendChild(messageContainer);
  }
  
  // Save message to localStorage
  saveMessageToHistory(msg, sender);
  
  // Auto-scroll to bottom
  scrollToBottom();
}

function typeMessage(element, text) {
  element.innerHTML = '';
  let i = 0;
  const typingSpeed = 30; // milliseconds per character
  
  const typeInterval = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      scrollToBottom();
    } else {
      clearInterval(typeInterval);
      // After typing is complete, convert line breaks to HTML breaks
      element.innerHTML = text.replace(/\n/g, '<br>');
    }
  }, typingSpeed);
}

function scrollToBottom() {
  chatArea.scrollTop = chatArea.scrollHeight;
}

// AI Integration Function - Ready for real API integration
async function getAIResponse(message) {
  // TODO: Replace this with real AI API call
  // Example API integration:
  // const response = await fetch('/api/chat', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ message: message })
  // });
  // const data = await response.json();
  // return data.response;
  
  // For now, return mock response with delay to simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockResponse(message));
    }, 1500); // Simulate API delay
  });
}

// Thinking Animation Functions
function showThinkingAnimation() {
  const thinkingContainer = document.createElement("div");
  thinkingContainer.classList.add("message-container", "bot-container", "thinking-container");
  thinkingContainer.id = "thinking-animation";
  
  const avatar = document.createElement("div");
  avatar.classList.add("avatar", "bot-avatar");
  avatar.innerHTML = '<img src="symptomate_logo_small.png" alt="Symptomate" class="avatar-image">';
  
  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");
  
  const thinkingDiv = document.createElement("div");
  thinkingDiv.classList.add("bot-message", "thinking-message");
  thinkingDiv.innerHTML = `
    <div class="thinking-text">
      <span class="thinking-dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </span>
      Symptomate is thinking...
    </div>
  `;
  
  thinkingContainer.appendChild(avatar);
  thinkingContainer.appendChild(messageContent);
  messageContent.appendChild(thinkingDiv);
  chatArea.appendChild(thinkingContainer);
  
  scrollToBottom();
}

function hideThinkingAnimation() {
  const thinkingAnimation = document.getElementById("thinking-animation");
  if (thinkingAnimation) {
    thinkingAnimation.remove();
  }
}

function getMockResponse(input) {
  // This is legacy mock code, not used when server is connected
  return "I'm connected to the server now.";
}

// localStorage Functions for Chat History
function saveMessageToHistory(message, sender) {
  const chatHistory = getChatHistory();
  chatHistory.push({
    message: message,
    sender: sender,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('symptomate_chat_history', JSON.stringify(chatHistory));
}

function getChatHistory() {
  const history = localStorage.getItem('symptomate_chat_history');
  return history ? JSON.parse(history) : [];
}

function loadChatHistory() {
  const chatHistory = getChatHistory();
  
  // Clear the initial bot message if there's chat history
  if (chatHistory.length > 0) {
    chatArea.innerHTML = '';
  }
  
  // Load all messages from history
  chatHistory.forEach(msg => {
    if (msg.sender === 'bot') {
      // For bot messages, add them directly without typing animation
      const messageContainer = document.createElement("div");
      messageContainer.classList.add("message-container", "bot-container");
      
      const avatar = document.createElement("div");
      avatar.classList.add("avatar", "bot-avatar");
      avatar.innerHTML = '<img src="symptomate_logo_small.png" alt="Symptomate" class="avatar-image">';
      
      const messageContent = document.createElement("div");
      messageContent.classList.add("message-content");
      
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("bot-message");
      messageDiv.innerHTML = msg.message.replace(/\n/g, '<br>');
      
      messageContainer.appendChild(avatar);
      messageContainer.appendChild(messageContent);
      messageContent.appendChild(messageDiv);
      chatArea.appendChild(messageContainer);
    } else {
      // For user messages, add them directly
      const messageContainer = document.createElement("div");
      messageContainer.classList.add("message-container", "user-container");
      
      const avatar = document.createElement("div");
      avatar.classList.add("avatar", "user-avatar");
      avatar.innerHTML = "👤";
      
      const messageContent = document.createElement("div");
      messageContent.classList.add("message-content");
      
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("user-message");
      messageDiv.textContent = msg.message;
      
      messageContainer.appendChild(avatar);
      messageContainer.appendChild(messageContent);
      messageContent.appendChild(messageDiv);
      chatArea.appendChild(messageContainer);
    }
  });
  
  // Scroll to bottom after loading history
  scrollToBottom();
}

function clearChatHistory() {
  localStorage.removeItem('symptomate_chat_history');
  chatArea.innerHTML = '';
  
  // Add the initial bot message back
  const initialMessage = document.createElement("div");
  initialMessage.classList.add("message-container", "bot-container");
  initialMessage.innerHTML = `
    <div class="avatar bot-avatar">
      <img src="symptomate_logo_small.png" alt="Symptomate" class="avatar-image">
    </div>
    <div class="message-content">
      <div class="bot-message">
        👋 Hello! I'm Symptomate. Tell me your symptoms, and I'll help you understand what might be happening.
      </div>
    </div>
  `;
  chatArea.appendChild(initialMessage);
  
  scrollToBottom();
  
  if (typeof showToast === 'function') {
    showToast('Chat Cleared', 'Your chat history has been cleared successfully.', 'success', 3000);
  }
}

// Health History Functions
async function loadHealthHistory() {
    try {
        const res = await fetch("/api/history");
        const history = await res.json();

        const container = document.querySelector(".history-cards");
        if (!container) return;

        container.innerHTML = "";

        if (!history || history.length === 0) {
            container.innerHTML = '<div class="history-item"><div class="history-content"><p>No health history yet. Start a chat to see your activity here.</p></div></div>';
            return;
        }

        history.slice(-5).reverse().forEach(item => {
            const timestamp = item.timestamp ? new Date(item.timestamp * 1000).toLocaleString() : "Unknown time";
            const firstCause = item.triage?.causes?.[0] || item.user_message?.substring(0, 30) + "..." || "Symptoms Logged";
            const severity = item.triage?.severity || "low";
            
            container.innerHTML += `
              <div class="history-item">
                <div class="history-icon">🤒</div>
                <div class="history-content">
                  <h4>${firstCause}</h4>
                  <p>${timestamp}</p>
                  <span class="status ${severity}">
                    ${severity}
                  </span>
                </div>
              </div>
            `;
        });
    } catch (error) {
        console.error("Error loading health history:", error);
        const container = document.querySelector(".history-cards");
        if (container) {
            container.innerHTML = '<div class="history-item"><div class="history-content"><p>Unable to load health history.</p></div></div>';
        }
    }
}