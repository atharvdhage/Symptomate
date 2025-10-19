const chatArea = document.getElementById("chat-area");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Load chat history on page load
document.addEventListener('DOMContentLoaded', function() {
  loadChatHistory();
});

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
  
  addMessage(text, "user");
  input.value = "";

  // Show thinking animation
  showThinkingAnimation();

  // Get AI response (currently mock, but ready for real API integration)
  getAIResponse(text).then(response => {
    hideThinkingAnimation();
    addMessage(response, "bot");
  }).catch(error => {
    hideThinkingAnimation();
    addMessage("I'm sorry, I'm having trouble connecting right now. Please try again later.", "bot");
    console.error('AI Response Error:', error);
  });
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
  input = input.toLowerCase();
  
  // Headache responses
  if (input.includes("headache") || input.includes("head pain")) {
    return `🩺 Possible Causes:
Headaches can be caused by dehydration, stress, lack of sleep, eye strain, or tension. Sometimes they're related to weather changes or certain foods.

💡 Recommendations:
• Stay hydrated with plenty of water
• Rest in a quiet, dark room
• Apply a cool compress to your forehead
• Practice relaxation techniques

⚠️ When to see a doctor:
Seek medical attention if your headache is severe, sudden, or accompanied by fever, neck stiffness, or vision changes.

Would you like to know about natural headache remedies?`;
  }
  
  // Fever responses
  if (input.includes("fever") || input.includes("temperature")) {
    return `🩺 Possible Causes:
A fever usually indicates your body is fighting an infection. It could be viral, bacterial, or related to other conditions.

💡 Recommendations:
• Monitor your temperature regularly
• Stay hydrated with water and electrolyte drinks
• Get plenty of rest
• Use fever-reducing medication if needed

⚠️ When to see a doctor:
Contact a doctor if fever is above 103°F (39.4°C), lasts more than 3 days, or is accompanied by severe symptoms.

Are you experiencing any other symptoms along with the fever?`;
  }
  
  // Cough responses
  if (input.includes("cough") || input.includes("coughing")) {
    return `🩺 Possible Causes:
Coughs can be caused by colds, allergies, dry air, or irritants. They help clear your airways of mucus and foreign particles.

💡 Recommendations:
• Stay hydrated with warm liquids
• Use a humidifier to add moisture to the air
• Try honey (for adults) or throat lozenges
• Avoid irritants like smoke

⚠️ When to see a doctor:
See a doctor if your cough lasts more than 3 weeks, produces blood, or is accompanied by difficulty breathing.

Is your cough dry or do you have phlegm?`;
  }
  
  // Sore throat responses
  if (input.includes("sore throat") || input.includes("throat pain")) {
    return `🩺 Possible Causes:
Sore throats are often caused by viral infections, bacterial infections, allergies, or dry air. Most are viral and resolve on their own.

💡 Recommendations:
• Gargle with warm salt water
• Drink warm tea with honey
• Use throat lozenges or sprays
• Stay hydrated and rest your voice

⚠️ When to see a doctor:
Seek medical care if you have difficulty swallowing, breathing, or if symptoms last more than a week.

Are you also experiencing any fever or swollen glands?`;
  }
  
  // Nausea responses
  if (input.includes("nausea") || input.includes("nauseous") || input.includes("sick to stomach")) {
    return `🩺 Possible Causes:
Nausea can be caused by food poisoning, motion sickness, pregnancy, medications, stress, or digestive issues.

💡 Recommendations:
• Eat small, bland meals (crackers, rice, bananas)
• Stay hydrated with small sips of water
• Try ginger tea or ginger candies
• Avoid strong smells and greasy foods

⚠️ When to see a doctor:
Contact a doctor if nausea is severe, persistent, or accompanied by vomiting, fever, or severe abdominal pain.

Have you been able to keep any food or liquids down?`;
  }
  
  // Fatigue responses
  if (input.includes("fatigue") || input.includes("tired") || input.includes("exhausted") || input.includes("weak")) {
    return `🩺 Possible Causes:
Fatigue can result from lack of sleep, stress, poor nutrition, dehydration, or underlying health conditions.

💡 Recommendations:
• Ensure 7-9 hours of quality sleep
• Stay hydrated and eat balanced meals
• Get regular exercise (even light activity)
• Practice stress management techniques

⚠️ When to see a doctor:
See a doctor if fatigue is severe, persistent, or accompanied by other concerning symptoms like weight loss or fever.

How long have you been feeling this way?`;
  }
  
  // Dizziness responses
  if (input.includes("dizzy") || input.includes("dizziness") || input.includes("lightheaded")) {
    return `🩺 Possible Causes:
Dizziness can be caused by dehydration, low blood pressure, inner ear problems, medications, or standing up too quickly.

💡 Recommendations:
• Sit or lie down when dizzy
• Stay hydrated with water
• Stand up slowly from sitting/lying
• Avoid sudden head movements

⚠️ When to see a doctor:
Seek immediate medical attention if dizziness is severe, accompanied by chest pain, or causes falls.

Does the dizziness happen when you stand up or move your head?`;
  }
  
  // Stomach pain responses
  if (input.includes("stomach pain") || input.includes("stomach ache") || input.includes("abdominal pain")) {
    return `🩺 Possible Causes:
Stomach pain can be caused by indigestion, gas, food poisoning, stress, or digestive issues like IBS or gastritis.

💡 Recommendations:
• Eat smaller, more frequent meals
• Avoid spicy, greasy, or acidic foods
• Try peppermint tea or ginger
• Apply a warm compress to your abdomen

⚠️ When to see a doctor:
Seek medical care if pain is severe, persistent, or accompanied by fever, vomiting, or blood in stool.

Is the pain sharp, crampy, or more of a dull ache?`;
  }
  
  // Back pain responses
  if (input.includes("back pain") || input.includes("backache")) {
    return `🩺 Possible Causes:
Back pain often results from poor posture, muscle strain, sitting too long, or lifting heavy objects incorrectly.

💡 Recommendations:
• Apply ice for the first 48 hours, then heat
• Practice gentle stretching and movement
• Maintain good posture
• Consider over-the-counter pain relief

⚠️ When to see a doctor:
See a doctor if pain is severe, lasts more than a few days, or is accompanied by numbness or weakness.

Did this start after any specific activity or injury?`;
  }
  
  // Cold symptoms responses
  if (input.includes("cold") || input.includes("runny nose") || input.includes("congestion")) {
    return `🩺 Possible Causes:
Cold symptoms are usually caused by viral infections. They're very common and typically resolve within 7-10 days.

💡 Recommendations:
• Get plenty of rest and sleep
• Stay hydrated with warm fluids
• Use saline nasal sprays or rinses
• Consider over-the-counter cold medications

⚠️ When to see a doctor:
Contact a doctor if symptoms worsen, last more than 10 days, or you develop a high fever.

Are you experiencing any fever or body aches?`;
  }
  
  // Joint pain responses
  if (input.includes("joint pain") || input.includes("joint ache") || input.includes("arthritis")) {
    return `🩺 Possible Causes:
Joint pain can be caused by overuse, injury, arthritis, or inflammation. Weather changes can also affect joint comfort.

💡 Recommendations:
• Apply ice or heat as appropriate
• Try gentle stretching and low-impact exercise
• Consider anti-inflammatory medications
• Maintain a healthy weight

⚠️ When to see a doctor:
See a doctor if joint pain is severe, persistent, or accompanied by swelling, redness, or limited mobility.

Which joints are bothering you most?`;
  }
  
  // Insomnia responses
  if (input.includes("insomnia") || input.includes("can't sleep") || input.includes("trouble sleeping")) {
    return `🩺 Possible Causes:
Sleep difficulties can be caused by stress, anxiety, caffeine, screen time before bed, or irregular sleep schedules.

💡 Recommendations:
• Maintain a consistent sleep schedule
• Create a relaxing bedtime routine
• Avoid screens 1 hour before bed
• Keep your bedroom cool, dark, and quiet

⚠️ When to see a doctor:
Consult a doctor if sleep problems persist for weeks or significantly affect your daily functioning.

What time do you usually try to go to sleep?`;
  }
  
  // Skin rash responses
  if (input.includes("rash") || input.includes("skin irritation") || input.includes("itchy skin")) {
    return `🩺 Possible Causes:
Skin rashes can be caused by allergies, irritants, infections, or skin conditions like eczema or dermatitis.

💡 Recommendations:
• Avoid scratching the affected area
• Use gentle, fragrance-free skincare products
• Apply cool compresses or calamine lotion
• Identify and avoid potential triggers

⚠️ When to see a doctor:
See a doctor if the rash is spreading, painful, or accompanied by fever or difficulty breathing.

When did you first notice the rash?`;
  }
  
  // Chest pain responses
  if (input.includes("chest pain") || input.includes("chest discomfort")) {
    return `🩺 Possible Causes:
Chest pain can have many causes, from muscle strain and heartburn to more serious cardiac conditions.

💡 Recommendations:
• Rest and avoid strenuous activity
• Try antacids if it might be heartburn
• Practice deep breathing exercises
• Monitor your symptoms closely

⚠️ When to see a doctor:
Seek immediate medical attention for chest pain, especially if it's severe, crushing, or accompanied by shortness of breath.

Is the pain sharp, dull, or does it feel like pressure?`;
  }
  
  // Anxiety responses
  if (input.includes("anxiety") || input.includes("anxious") || input.includes("worried") || input.includes("panic")) {
    return `🩺 Possible Causes:
Anxiety can be triggered by stress, life changes, health concerns, or underlying anxiety disorders.

💡 Recommendations:
• Practice deep breathing exercises
• Try meditation or mindfulness techniques
• Maintain regular exercise and sleep
• Consider talking to a mental health professional

⚠️ When to see a doctor:
Seek professional help if anxiety is severe, persistent, or significantly impacts your daily life.

Would you like some breathing exercises to try right now?`;
  }
  
  // Default response
  return `🩺 Assessment:
Thank you for sharing your symptoms with me. I understand you're not feeling your best right now.

💡 General Recommendations:
• Stay hydrated with plenty of water
• Get adequate rest and sleep
• Eat nutritious, balanced meals
• Practice stress management techniques

⚠️ When to see a doctor:
If your symptoms persist, worsen, or are accompanied by severe pain, fever, or other concerning signs, please consult a healthcare professional.

Can you tell me more about when these symptoms started?`;
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
}
