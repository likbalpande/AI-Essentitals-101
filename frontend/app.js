const rootElement = document.getElementById("messages-list");
const userInputElement = document.getElementById("user-chat-input");
const userIdElement = document.getElementById("user-id-input");

async function handleGetMessages() {
    const userId = userIdElement.value;

    const resp = await fetch(`http://localhost:3124/messages/${userId}`, {
        method: "GET",
    });

    const result = await resp.json();

    const messages = result.data.messages;

    renderUI(messages);
}

async function renderUI(messages) {
    rootElement.innerHTML = "";

    messages.forEach(({ role, text }) => {
        const newDiv = document.createElement("div");
        if (role == "user") {
            newDiv.className = "chat-message user-chat";
        } else {
            newDiv.className = "chat-message assistant-chat";
        }
        newDiv.innerHTML = `
            <p>${text}</p>
        `;

        rootElement.appendChild(newDiv);
    });
}

async function sendMessage() {
    const text = userInputElement.value;
    const userId = userIdElement.value;

    const resp = await fetch(`http://localhost:3124/messages`, {
        method: "POST",
        body: JSON.stringify({
            text,
            userId,
        }),
        headers: {
            "content-type": "application/json",
        },
    });

    const result = await resp.json();
    console.log("🟡 : result:", result);

    userInputElement.value = "";

    setTimeout(() => {
        handleGetMessages();
    }, 0);

    setTimeout(() => {
        handleGetMessages();
    }, 4000);

    setTimeout(() => {
        handleGetMessages();
    }, 8000);

    setTimeout(() => {
        handleGetMessages();
    }, 12000);
}
