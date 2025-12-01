// TriageCare AI Chat Interface
class TriageCareChat {
    constructor() {
        this.chatWindow = document.getElementById('chat-window');
        this.userInput = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        this.startTriageBtn = document.getElementById('start-triage-btn');
        
        this.initializeChat();
        this.bindEvents();
    }

    initializeChat() {
        this.addMessage('bot', 'AI', 'Hello! I\'m TriageCare AI, your medical intake assistant. Please describe your symptoms or health concerns, and I\'ll help guide you to the appropriate care.');
    }

    bindEvents() {
        this.sendBtn?.addEventListener('click', () => this.sendMessage());
        this.userInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        this.startTriageBtn?.addEventListener('click', () => {
            document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
        });
    }

    addMessage(type, sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        messageDiv.innerHTML = `
            <div class="avatar">${sender === 'AI' ? 'AI' : 'U'}</div>
            <div class="text">${text}</div>
        `;
        
        this.chatWindow.appendChild(messageDiv);
        this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;

        this.addMessage('user', 'User', message);
        this.userInput.value = '';
        
        // Show typing indicator
        this.showTyping();
        
        try {
            const response = await this.getAIResponse(message);
            this.hideTyping();
            this.addMessage('bot', 'AI', response);
        } catch (error) {
            this.hideTyping();
            this.addMessage('bot', 'AI', 'I apologize, but I\'m having trouble connecting right now. Please try again or contact our support team.');
        }
    }

    showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing';
        typingDiv.innerHTML = `
            <div class="avatar">AI</div>
            <div class="text">Analyzing your symptoms...</div>
        `;
        this.chatWindow.appendChild(typingDiv);
        this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
    }

    hideTyping() {
        const typing = this.chatWindow.querySelector('.typing');
        if (typing) typing.remove();
    }

    async getAIResponse(userMessage) {
        const prompt = `You are TriageCare AI, a medical intake assistant. Respond to this patient message professionally and helpfully: "${userMessage}". 

Guidelines:
- Provide empathetic, professional responses
- Ask relevant follow-up questions about symptoms
- Suggest appropriate care levels (urgent care, general physician, emergency room)
- Never provide specific medical diagnoses
- Keep responses concise (2-3 sentences)
- Always recommend consulting healthcare professionals`;

        const response = await fetch(`${CONFIG.GEMINI_API_URL}?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TriageCareChat();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});