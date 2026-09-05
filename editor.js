/* ==================== editor.js ==================== */
let editor;
let currentLanguage = 'html';
const editorStates = {
    html: { value: '', language: 'html' },
    css: { value: '', language: 'css' },
    js: { value: '', language: 'javascript' }
};

// Monaco Editor 初期化
function initEditor() {
    require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
    
    require(['vs/editor/editor.main'], function() {
        editor = monaco.editor.create(document.getElementById('editorContainer'), {
            value: editorStates.html.value,
            language: 'html',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: true },
            fontSize: 14,
            fontFamily: "'Fira Code', 'Courier New', monospace",
            formatOnPaste: true,
            formatOnType: true,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 }
        });

        // エディタ変更時のイベント
        editor.onDidChangeModelContent(() => {
            editorStates[currentLanguage].value = editor.getValue();
            updatePreview();
        });

        // タブ切り替えイベント
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', switchTab);
        });
    });
}

// タブ切り替え関数
function switchTab(e) {
    const newLanguage = e.target.dataset.tab;
    
    // 現在のタブを非アクティブに
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // エディタの言語とコンテンツを変更
    if (editor) {
        currentLanguage = newLanguage;
        const oldValue = editor.getValue();
        editorStates[currentLanguage === 'js' ? 'js' : (currentLanguage === 'css' ? 'css' : 'html')].value = oldValue;
        
        const model = editor.getModel();
        monaco.editor.setModelLanguage(model, 
            newLanguage === 'js' ? 'javascript' : newLanguage
        );
        
        editor.setValue(editorStates[newLanguage].value);
    }
}

// エディタの値を取得
function getEditorContent() {
    return {
        html: editorStates.html.value,
        css: editorStates.css.value,
        js: editorStates.js.value
    };
}

// エディタに値を設定
function setEditorContent(html, css, js) {
    editorStates.html.value = html || '';
    editorStates.css.value = css || '';
    editorStates.js.value = js || '';
    
    if (editor && currentLanguage === 'html') {
        editor.setValue(html || '');
    }
    
    updatePreview();
}

// エディタをクリア
function clearEditor() {
    setEditorContent('', '', '');
    document.getElementById('status').textContent = '✨ エディタをクリアしました';
    document.getElementById('status').className = 'status-message success';
}

// 初期化実行
document.addEventListener('DOMContentLoaded', initEditor);
