/* ==================== app.js ==================== */

// ページロード時の初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 AI Code Preview Application Initialized');
    
    // デモモードでデフォルトコードを表示
    if (document.getElementById('apiSelect').value === 'mock') {
        setTimeout(() => {
            setEditorContent(
                CONFIG.MOCK_RESPONSES.html,
                CONFIG.MOCK_RESPONSES.css,
                CONFIG.MOCK_RESPONSES.js
            );
        }, 500);
    }

    // キーボードショートカット
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter: 生成
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('generateBtn').click();
        }
    });

    // API プロバイダー変更
    document.getElementById('apiSelect').addEventListener('change', (e) => {
        const apiKeyInput = document.getElementById('apiKey');
        if (e.target.value === 'mock') {
            apiKeyInput.disabled = true;
            apiKeyInput.style.opacity = '0.5';
            showStatus('📌 デモモードが有効です。「デモ」プロバイダーでは APIキーは不要です。', 'info');
        } else {
            apiKeyInput.disabled = false;
            apiKeyInput.style.opacity = '1';
            showStatus('📌 OpenAI API を使用します。有効な APIキーを入力してください。', 'info');
        }
    });
});

// ウィンドウリサイズ時のエディタ再レイアウト
window.addEventListener('resize', () => {
    if (editor) {
        editor.layout();
    }
});

// ページを離れる前に確認
window.addEventListener('beforeunload', (e) => {
    const content = getEditorContent();
    const hasContent = content.html || content.css || content.js;
    
    if (hasContent) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// エラーハンドリング
window.addEventListener('error', (e) => {
    console.error('Global Error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
});
