/* ==================== ai-handler.js ==================== */

// AI レスポンスをストリーミングで処理
async function streamAIResponse(prompt, apiKey, apiProvider) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('active');
    
    try {
        if (apiProvider === 'mock') {
            // デモモード
            await simulateStreaming();
            return;
        }

        if (!apiKey) {
            showStatus('⚠️ APIキーを入力してください', 'warning');
            loadingOverlay.classList.remove('active');
            return;
        }

        // OpenAI API に リクエスト
        const response = await fetch(`${CONFIG.OPENAI_API_BASE}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: CONFIG.MODEL,
                messages: [{
                    role: 'user',
                    content: generateSystemPrompt(prompt)
                }],
                temperature: 0.7,
                max_tokens: 2000,
                stream: false
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API Error');
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        parseAndSetCode(content);
        showStatus('✅ コード生成完了！', 'success');

    } catch (error) {
        console.error('AI Handler Error:', error);
        showStatus(`❌ エラー: ${error.message}`, 'error');
    } finally {
        loadingOverlay.classList.remove('active');
    }
}

// システムプロンプト生成
function generateSystemPrompt(userPrompt) {
    return `以下のプロンプトに基づいて、HTML、CSS、JavaScriptのコードを生成してください。
以下の形式で、厳密に JSON で返してください:

{
  "html": "<html content>",
  "css": "<css content>",
  "js": "<javascript content>"
}

重要な指示:
1. 完全で実行可能なコードを生成してください
2. HTMLは \`<div>\` や \`<section>\` などの要素から始めてください
3. CSSはモダンで美しいスタイルを使用してください
4. JavaScriptは安全で、eval()やrequire()を使用しないでください
5. 日本語のコメントを含めてください
6. レスポンシブデザインに対応させてください

ユーザーリクエスト: ${userPrompt}`;
}

// AI レスポンスをパース
function parseAndSetCode(content) {
    try {
        // JSON を抽出
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('JSON形式が見つかりません');
        }

        const parsed = JSON.parse(jsonMatch[0]);
        setEditorContent(parsed.html || '', parsed.css || '', parsed.js || '');

    } catch (error) {
        // フォーマット解析失敗時の代替処理
        console.warn('JSON Parse Error:', error);
        showStatus(`⚠️ レスポンス形式の解析に失敗しました: ${error.message}`, 'warning');
    }
}

// デモモード: ストリーミングシミュレート
async function simulateStreaming() {
    return new Promise((resolve) => {
        setTimeout(() => {
            setEditorContent(
                CONFIG.MOCK_RESPONSES.html,
                CONFIG.MOCK_RESPONSES.css,
                CONFIG.MOCK_RESPONSES.js
            );
            showStatus('✅ デモコード生成完了！ (APIキーを設定して本機能を使用)', 'success');
            resolve();
        }, 1500);
    });
}

// 生成ボタンのイベント
document.getElementById('generateBtn').addEventListener('click', async () => {
    const prompt = document.getElementById('aiPrompt').value.trim();
    const apiKey = document.getElementById('apiKey').value.trim();
    const apiProvider = document.getElementById('apiSelect').value;

    if (!prompt) {
        showStatus('⚠️ プロンプトを入力してください', 'warning');
        return;
    }

    await streamAIResponse(prompt, apiKey, apiProvider);
});

// クリアボタンのイベント
document.getElementById('clearBtn').addEventListener('click', () => {
    clearEditor();
    document.getElementById('aiPrompt').value = '';
});
