/* ==================== config.js ==================== */
const CONFIG = {
    OPENAI_API_BASE: 'https://api.openai.com/v1',
    MODEL: 'gpt-3.5-turbo',
    MOCK_RESPONSES: {
        html: `<div class="container">
  <h1>🎨 AI Generated Code</h1>
  <button class="magic-btn">Click Me! ✨</button>
  <p>This is a demo preview. Use your API key to generate real code!</p>
</div>`,
        css: `.container {
  max-width: 800px;
  margin: 50px auto;
  padding: 40px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 30px;
  animation: fadeInDown 0.8s ease-out;
}

.magic-btn {
  padding: 12px 30px;
  font-size: 1.1em;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.magic-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.magic-btn:active {
  transform: scale(0.98);
}

p {
  margin-top: 20px;
  font-size: 1em;
  opacity: 0.9;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`,
        js: `document.querySelector('.magic-btn').addEventListener('click', function() {
  this.textContent = '✨ Magic Happened! ✨';
  this.style.background = '#764ba2';
  this.style.color = 'white';
  
  setTimeout(() => {
    this.textContent = 'Click Me! ✨';
    this.style.background = 'white';
    this.style.color = '#667eea';
  }, 2000);
});

console.log('🚀 Demo code executed successfully!');`
    }
};

// 安全なコード検証関数
function validateCode(code, language) {
    const dangerousPatterns = {
        js: [
            /eval\(/gi,
            /Function\(/gi,
            /setTimeout\s*\(\s*['\`].*['\`]/gi,
            /import\s*\(/gi
        ]
    };

    if (dangerousPatterns[language]) {
        for (const pattern of dangerousPatterns[language]) {
            if (pattern.test(code)) {
                return {
                    valid: false,
                    error: `⚠️ 検出された危険なパターン: ${pattern.source}`
                };
            }
        }
    }

    return { valid: true };
}
