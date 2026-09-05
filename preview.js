/* ==================== preview.js ==================== */
const previewFrame = document.getElementById('previewFrame');

// プレビューを更新
function updatePreview() {
    const content = getEditorContent();
    const html = content.html;
    const css = content.css;
    const js = content.js;
    
    // セキュリティ検証
    const jsValidation = validateCode(js, 'js');
    if (!jsValidation.valid) {
        showStatus(jsValidation.error, 'warning');
    }
    
    // iframe に HTML を注入
    const completeHTML = `
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                ${css}
            </style>
        </head>
        <body>
            ${html}
            <script>
                try {
                    ${js}
                } catch (error) {
                    console.error('❌ Script Error:', error.message);
                    document.body.innerHTML += '<div style="color: red; padding: 20px; font-family: monospace;"><strong>❌ エラー:</strong><br>' + error.message + '</div>';
                }
            </script>
        </body>
        </html>
    `;
    
    try {
        const blob = new Blob([completeHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        previewFrame.src = url;
    } catch (error) {
        showStatus(`❌ プレビュー更新エラー: ${error.message}`, 'error');
    }
}

// ステータスメッセージ表示
function showStatus(message, type = 'info') {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
}

// リフレッシュボタン
document.getElementById('refreshBtn').addEventListener('click', () => {
    updatePreview();
    showStatus('✅ プレビューを更新しました', 'success');
});
