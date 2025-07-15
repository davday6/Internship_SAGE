function toggleChat() {
  const chatContainer = document.getElementById("chat-container");
  if (chatContainer.classList.contains("show")) {
    chatContainer.classList.remove("show");
    setTimeout(() => chatContainer.style.display = "none", 300);
  } else {
    chatContainer.style.display = "flex";
    setTimeout(() => chatContainer.classList.add("show"), 10);
  }
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (message === "") return;

  appendMessage("user", message);
  input.value = "";

  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    appendMessage("bot", data.response);
  } catch (error) {
    appendMessage("bot", "Sorry, I couldn't reach the server.");
  }
}

function appendMessage(sender, message) {
  const chatBox = document.getElementById("chat-box");
  const messageDiv = document.createElement("div");
  messageDiv.className = sender;
  messageDiv.textContent = message;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}
