(function () {
  var editor = document.getElementById('code-editor');
  var editorShell = document.querySelector('.editor-shell');
  var highlightLayer = document.getElementById('code-highlight');
  var previewBtn = document.getElementById('preview-btn');
  var previewFrame = document.getElementById('preview-frame');
  var sendBtn = document.getElementById('send-btn');
  var feedback = document.getElementById('editor-feedback');
  var editorSection = document.getElementById('editor');
  var API = window.location.hostname === 'localhost' ? '' : 'https://server.chitaga.tech';

  if (!editor || !previewBtn || !previewFrame || !sendBtn || !feedback) return;

  function setFeedback(text, type) {
    feedback.textContent = text;
    feedback.className = 'editor-feedback ' + (type || '');
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* ---- CSS highlighting (input is already escaped) ---- */

  function highlightCssBlock(block) {
    return block.replace(/([\w-]+)(\s*:\s*)([^;]*)(;?)/g, function (_, prop, colon, val, semi) {
      return '<span class="token-css-prop">' + prop + '</span>' +
        '<span class="token-punctuation">' + colon + '</span>' +
        '<span class="token-css-val">' + val + '</span>' +
        (semi ? '<span class="token-punctuation">;</span>' : '');
    });
  }

  function highlightCss(escapedCss) {
    var result = '';
    var i = 0;
    var inRule = false;

    var withComments = escapedCss.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="token-comment">$1</span>');

    while (i < withComments.length) {
      if (!inRule) {
        var braceIdx = withComments.indexOf('{', i);
        if (braceIdx === -1) {
          var tail = withComments.slice(i);
          if (tail.trim()) {
            result += '<span class="token-css-selector">' + tail + '</span>';
          } else {
            result += tail;
          }
          break;
        }
        var selectorPart = withComments.slice(i, braceIdx);
        if (selectorPart.indexOf('<span class="token-comment">') === -1) {
          result += '<span class="token-css-selector">' + selectorPart + '</span>';
        } else {
          result += selectorPart;
        }
        result += '<span class="token-punctuation">{</span>';
        i = braceIdx + 1;
        inRule = true;
      } else {
        var closeIdx = withComments.indexOf('}', i);
        if (closeIdx === -1) {
          result += highlightCssBlock(withComments.slice(i));
          break;
        }
        result += highlightCssBlock(withComments.slice(i, closeIdx));
        result += '<span class="token-punctuation">}</span>';
        i = closeIdx + 1;
        inRule = false;
      }
    }

    return result;
  }

  /* ---- HTML highlighting ---- */

  function highlightCode(code) {
    var safe = escapeHtml(code);

    // 1. Extract <style> blocks before other processing
    var styleBlocks = [];
    safe = safe.replace(
      /(&lt;style(?:[^&]|&(?!gt;))*?&gt;)([\s\S]*?)(&lt;\/style&gt;)/gi,
      function (_, openTag, inner, closeTag) {
        var idx = styleBlocks.length;
        styleBlocks.push({ open: openTag, css: inner, close: closeTag });
        return '%%STYLE_' + idx + '%%';
      }
    );

    // 2. Comments
    safe = safe.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="token-comment">$1</span>');

    // 3. DOCTYPE
    safe = safe.replace(/(&lt;!DOCTYPE[\s\S]*?&gt;)/gi, '<span class="token-doctype">$1</span>');

    // 4. HTML tags
    safe = safe.replace(/(&lt;\/?)([a-zA-Z][\w:-]*)((?:[^&]|&(?!gt;))*?)(\/?&gt;)/g, function (_, open, tag, attrs, close) {
      var highlightedAttrs = attrs
        .replace(/(\s+)([\w:-]+)(=)("[^"]*"|'[^']*')/g,
          '$1<span class="token-attr">$2</span><span class="token-punctuation">$3</span><span class="token-value">$4</span>')
        .replace(/(\s+)([\w:-]+)(?=[\s/>]|$)/g, '$1<span class="token-attr">$2</span>');

      return '<span class="token-punctuation">' + open + '</span>' +
        '<span class="token-tag">' + tag + '</span>' +
        highlightedAttrs +
        '<span class="token-punctuation">' + close + '</span>';
    });

    // 5. Re-insert highlighted style blocks
    for (var j = 0; j < styleBlocks.length; j++) {
      var block = styleBlocks[j];

      // Highlight the <style> open tag itself
      var styledOpen = block.open.replace(
        /(&lt;)(style)((?:[^&]|&(?!gt;))*?)(&gt;)/i,
        function (_, lt, tag, attrs, gt) {
          return '<span class="token-punctuation">' + lt + '</span>' +
            '<span class="token-tag">' + tag + '</span>' +
            attrs +
            '<span class="token-punctuation">' + gt + '</span>';
        }
      );

      var styledClose = '<span class="token-punctuation">&lt;/</span>' +
        '<span class="token-tag">style</span>' +
        '<span class="token-punctuation">&gt;</span>';

      var cssHighlighted = highlightCss(block.css);

      safe = safe.replace('%%STYLE_' + j + '%%', styledOpen + cssHighlighted + styledClose);
    }

    return safe;
  }

  function syncEditorView() {
    if (!highlightLayer) return;
    var content = editor.value || '';
    highlightLayer.innerHTML = highlightCode(content) + '\n';
  }

  function syncScroll() {
    if (!highlightLayer) return;
    highlightLayer.scrollTop = editor.scrollTop;
    highlightLayer.scrollLeft = editor.scrollLeft;
  }

  function insertTextAtCursor(text) {
    var start = editor.selectionStart;
    var end = editor.selectionEnd;
    var before = editor.value.slice(0, start);
    var after = editor.value.slice(end);
    editor.value = before + text + after;
    editor.selectionStart = editor.selectionEnd = start + text.length;
  }

  function shiftTabSelection() {
    var start = editor.selectionStart;
    var end = editor.selectionEnd;
    var value = editor.value;
    var lineStart = value.lastIndexOf('\n', start - 1) + 1;
    var block = value.slice(lineStart, end);
    var lines = block.split('\n');
    var removed = 0;

    var updatedLines = lines.map(function (line) {
      if (line.startsWith('  ')) {
        removed += 2;
        return line.slice(2);
      }
      if (line.startsWith('\t')) {
        removed += 1;
        return line.slice(1);
      }
      return line;
    });

    var updatedBlock = updatedLines.join('\n');
    editor.value = value.slice(0, lineStart) + updatedBlock + value.slice(end);

    var nextStart = Math.max(lineStart, start - 2);
    var nextEnd = Math.max(nextStart, end - removed);
    editor.selectionStart = nextStart;
    editor.selectionEnd = nextEnd;
  }

  editor.addEventListener('keydown', function (event) {
    if (event.key !== 'Tab') return;
    event.preventDefault();

    if (event.shiftKey) {
      shiftTabSelection();
      syncEditorView();
      schedulePreview();
      return;
    }

    insertTextAtCursor('  ');
    syncEditorView();
    schedulePreview();
  });

  if (highlightLayer && editorShell) {
    editorShell.classList.add('editor-syntax-enabled');
    editor.addEventListener('scroll', syncScroll);
  }

  /* ---- preview via srcdoc ---- */

  function renderPreview() {
    var code = editor.value || '';
    var bodyEmpty = /<body[^>]*>\s*<\/body>/i.test(code);

    if (!code.trim() || bodyEmpty) {
      previewFrame.srcdoc = '<!doctype html><html><body style="margin:0;font-family:Open Sans,sans-serif;background:#f8fafc;color:#334155;display:grid;place-items:center;min-height:100vh;padding:24px;text-align:center;"><div><h2 style="margin:0 0 8px;color:#19432a;">Vista previa activa</h2><p style="margin:0;max-width:520px;line-height:1.6;">Empieza agregando contenido dentro de <strong>&lt;body&gt;</strong> para ver tu pagina aqui.</p></div></body></html>';
      return;
    }

    previewFrame.srcdoc = code;
  }

  var previewTimer;
  function schedulePreview() {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(renderPreview, 300);
  }

  previewBtn.addEventListener('click', function () {
    renderPreview();
    setFeedback('Vista previa actualizada.', 'success');
  });

  editor.addEventListener('input', function () {
    syncEditorView();
    schedulePreview();
  });

  syncEditorView();
  syncScroll();
  renderPreview();

  /* ---- auto-collapse when out of view ---- */

  if (editorSection && 'IntersectionObserver' in window) {
    var collapsed = false;

    var observer = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      if (!entry.isIntersecting && !collapsed) {
        editorSection.classList.add('editor-collapsed');
        collapsed = true;
      } else if (entry.isIntersecting && collapsed) {
        editorSection.classList.remove('editor-collapsed');
        collapsed = false;
      }
    }, { threshold: 0.05 });

    observer.observe(editorSection);
  }

  /* ---- send ---- */

  sendBtn.addEventListener('click', function () {
    var code = editor.value.trim();

    if (code.length < 20) {
      setFeedback('Escribe un poco mas de codigo antes de subir.', 'error');
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = 'Subiendo...';

    fetch(API + '/api/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: 'eventos',
        name: 'Taller Web',
        message: 'Entrega ejercicio web:\n\n' + code,
      }),
    })
      .then(function (res) {
        return res.json().then(function (payload) {
          return { ok: res.ok, status: res.status, payload: payload };
        });
      })
      .then(function (result) {
        if (result.ok) {
          setFeedback('Codigo enviado correctamente. Ya quedo subido.', 'success');
        } else if (result.status === 409) {
          setFeedback('Ya se envio una entrega desde este dispositivo.', 'error');
        } else if (result.status === 429) {
          setFeedback('Demasiados intentos. Espera un momento.', 'error');
        } else {
          setFeedback(result.payload.error || 'No se pudo subir el codigo.', 'error');
        }
      })
      .catch(function () {
        setFeedback('No hubo conexion con el servidor para subir.', 'error');
      })
      .finally(function () {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Subir codigo';
      });
  });
})();
