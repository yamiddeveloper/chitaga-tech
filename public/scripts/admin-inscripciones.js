(function () {
    var API = window.location.hostname === 'localhost' ? '' : 'https://app.chitaga.tech';
    var pageRoot = document.querySelector('.admin-main');
    var form = document.getElementById('admin-auth-form');
    var passwordInput = document.getElementById('admin-password');
    var eventSelect = document.getElementById('admin-event-slug');
    var loadBtn = document.getElementById('admin-load-btn');
    var feedback = document.getElementById('admin-feedback');
    var results = document.getElementById('admin-results');
    var summary = document.getElementById('admin-summary');
    var list = document.getElementById('admin-list');

    if (!pageRoot || !form || !passwordInput || !eventSelect || !loadBtn || !feedback || !results || !summary || !list) {
        return;
    }

    var eventsMeta = [];
    try {
        eventsMeta = JSON.parse(pageRoot.dataset.events || '[]');
    } catch (err) {
        eventsMeta = [];
    }

    var storedKey = sessionStorage.getItem('chitaga_admin_key');
    if (storedKey) {
        passwordInput.value = storedKey;
    }

    var currentSlug = '';
    var currentAdminKey = '';
    var currentRows = [];
    var currentAttendance = {};

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        var adminKey = (passwordInput.value || '').trim();
        var slug = eventSelect.value;

        if (!adminKey) {
            setFeedback('Ingresa la contraseña para continuar.');
            return;
        }

        if (!slug) {
            setFeedback('Selecciona un evento.');
            return;
        }

        sessionStorage.setItem('chitaga_admin_key', adminKey);

        loadBtn.disabled = true;
        loadBtn.textContent = 'Cargando...';
        setFeedback('');

        fetch(API + '/api/events/' + encodeURIComponent(slug) + '/registrations?t=' + Date.now(), {
            method: 'GET',
            headers: {
                'x-admin-key': adminKey,
            },
            cache: 'no-store',
        })
            .then(function (res) {
                return res.json().catch(function () { return null; }).then(function (payload) {
                    return { ok: res.ok, status: res.status, payload: payload };
                });
            })
            .then(function (resp) {
                if (!resp.ok) {
                    if (resp.status === 401) {
                        sessionStorage.removeItem('chitaga_admin_key');
                        setFeedback('Contraseña incorrecta. Verifica la clave de administrador.');
                        hideResults();
                        return;
                    }

                    var message = resp.payload && resp.payload.error ? resp.payload.error : 'No se pudo obtener la información del evento.';
                    setFeedback(message);
                    hideResults();
                    return;
                }

                var registrations = Array.isArray(resp.payload) ? resp.payload : [];
                currentSlug = slug;
                currentAdminKey = adminKey;
                currentRows = registrations;

                return fetch(API + '/api/events/' + encodeURIComponent(slug) + '/attendance?t=' + Date.now(), {
                    method: 'GET',
                    headers: {
                        'x-admin-key': adminKey,
                    },
                    cache: 'no-store',
                }).then(function (attRes) {
                    return attRes.ok ? attRes.json() : {};
                }).catch(function () {
                    return {};
                }).then(function (attendanceData) {
                    currentAttendance = attendanceData || {};
                    renderCurrent();
                    setFeedback('Consulta cargada correctamente.', true);
                });
            })
            .catch(function () {
                setFeedback('Error de conexión con la API.');
                hideResults();
            })
            .finally(function () {
                loadBtn.disabled = false;
                loadBtn.textContent = 'Ver inscritos';
            });
    });

    function renderCurrent() {
        renderResults(currentSlug, currentRows, currentAttendance);
        bindControls();
    }

    function renderResults(slug, rows, attendanceMap) {
        var eventMeta = eventsMeta.find(function (evt) { return evt.slug === slug; }) || null;
        var title = eventMeta ? eventMeta.title : slug;
        var eventDate = eventMeta ? formatDate(eventMeta.date) : 'Sin fecha';
        var eventTime = eventMeta && eventMeta.time ? eventMeta.time : 'Hora por confirmar';
        var capacity = eventMeta && eventMeta.capacity ? eventMeta.capacity : '-';

        var internos = 0;
        var externos = 0;
        rows.forEach(function (r) { if (r && r.isMember) internos++; else externos++; });

        summary.innerHTML = [
            '<h2 class="admin-summary-title">' + escapeHtml(title) + '</h2>',
            '<p class="admin-summary-meta">Fecha: ' + escapeHtml(eventDate) + '</p>',
            '<p class="admin-summary-meta">Horario: ' + escapeHtml(eventTime) + '</p>',
            '<p class="admin-summary-meta">Inscritos: <strong>' + rows.length + '</strong> / ' + capacity + '</p>',
            '<p class="admin-summary-meta">Internos: <strong>' + internos + '</strong> · Externos: <strong>' + externos + '</strong></p>',
        ].join('');

        if (!rows.length) {
            list.innerHTML = '<article class="admin-item"><div class="admin-item-body"><p class="admin-value">Aún no hay registros para este evento.</p></div></article>';
            results.hidden = false;
            return;
        }

        list.innerHTML = rows.map(function (row) {
            var details = [];
            var data = row && row.data && typeof row.data === 'object' ? row.data : {};
            var att = attendanceMap && attendanceMap[row.id] ? attendanceMap[row.id] : {};
            var isMember = !!row.isMember;
            var isActivated = !!att.activated;

            details.push(makeRow('Registrado', formatDateTime(row.created_at)));
            details.push(makeRow('ID', String(row.id || '')));

            Object.keys(data).forEach(function (key) {
                details.push(makeRow(humanizeKey(key), String(data[key] || '')));
            });

            details.push(makeRow('IP', row.ip || 'No disponible'));

            return [
                '<article class="admin-item">',
                '  <header class="admin-item-head">',
                '    <h3 class="admin-item-name">' + escapeHtml(data.name || 'Participante sin nombre') + '</h3>',
                '    <p class="admin-item-email">' + escapeHtml(data.email || row.email || 'Sin correo') + '</p>',
                '    <div class="admin-item-tags">',
                '      <span class="admin-pill ' + (isMember ? 'admin-pill--internal' : 'admin-pill--external') + '">' + (isMember ? 'Interno' : 'Externo') + '</span>',
                '      <span class="admin-pill ' + (isActivated ? 'admin-pill--activated' : 'admin-pill--inactive') + '">' + (isActivated ? 'Activado 24h' : 'No activado') + '</span>',
                '    </div>',
                '    <div class="admin-item-actions">',
                '      <button class="admin-action-btn admin-toggle-member" data-id="' + row.id + '" data-is-member="' + (isMember ? '1' : '0') + '">' + (isMember ? 'Marcar externo' : 'Marcar interno') + '</button>',
                '      <button class="admin-action-btn admin-toggle-activated" data-id="' + row.id + '" data-attended="' + (att.attended ? '1' : '0') + '" data-finished="' + (att.finished ? '1' : '0') + '" data-activated="' + (isActivated ? '1' : '0') + '">' + (isActivated ? 'Quitar activado' : 'Marcar activado') + '</button>',
                '    </div>',
                '  </header>',
                '  <div class="admin-item-body">' + details.join('') + '</div>',
                '</article>',
            ].join('');
        }).join('');

        results.hidden = false;
    }

    function bindControls() {
        list.querySelectorAll('.admin-toggle-member').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = btn.getAttribute('data-id');
                var isMember = btn.getAttribute('data-is-member') === '1';
                btn.disabled = true;
                fetch(API + '/api/events/' + encodeURIComponent(currentSlug) + '/registrations/' + encodeURIComponent(id) + '/member', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-admin-key': currentAdminKey,
                    },
                    body: JSON.stringify({ isMember: !isMember }),
                }).then(function (res) {
                    if (!res.ok) throw new Error('Error');
                    currentRows = currentRows.map(function (r) {
                        if (String(r.id) === String(id)) {
                            r.isMember = !isMember;
                        }
                        return r;
                    });
                    renderCurrent();
                }).catch(function () {
                    btn.disabled = false;
                });
            });
        });

        list.querySelectorAll('.admin-toggle-activated').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = btn.getAttribute('data-id');
                var attended = btn.getAttribute('data-attended') === '1';
                var finished = btn.getAttribute('data-finished') === '1';
                var activated = btn.getAttribute('data-activated') === '1';

                var nextActivated = !activated;
                var nextAttended = nextActivated ? true : attended;
                var nextFinished = nextActivated ? true : finished;

                btn.disabled = true;
                fetch(API + '/api/events/' + encodeURIComponent(currentSlug) + '/attendance/' + encodeURIComponent(id), {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-admin-key': currentAdminKey,
                    },
                    body: JSON.stringify({ attended: nextAttended, finished: nextFinished, activated: nextActivated }),
                }).then(function (res) {
                    if (!res.ok) throw new Error('Error');
                    currentAttendance[id] = {
                        attended: nextAttended,
                        finished: nextFinished,
                        activated: nextActivated,
                    };
                    renderCurrent();
                }).catch(function () {
                    btn.disabled = false;
                });
            });
        });
    }

    function makeRow(label, value) {
        return '<div class="admin-row"><span class="admin-key">' + escapeHtml(label) + '</span><p class="admin-value">' + escapeHtml(value || '-') + '</p></div>';
    }

    function hideResults() {
        results.hidden = true;
        summary.innerHTML = '';
        list.innerHTML = '';
    }

    function setFeedback(message, ok) {
        feedback.textContent = message;
        feedback.className = ok ? 'admin-feedback ok' : 'admin-feedback';
    }

    function formatDate(isoDate) {
        if (!isoDate) return 'Sin fecha';

        var value = String(isoDate);
        var match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        var date = match
            ? new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
            : new Date(value);

        if (Number.isNaN(date.getTime())) return isoDate;

        return date.toLocaleDateString('es-CO', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC',
        });
    }

    function formatDateTime(sqlDate) {
        if (!sqlDate) return 'Sin fecha';

        var date = new Date(sqlDate.replace(' ', 'T') + 'Z');
        if (Number.isNaN(date.getTime())) return sqlDate;

        return date.toLocaleString('es-CO', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    }

    function humanizeKey(key) {
        return String(key || '')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, function (match) { return match.toUpperCase(); });
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
})();
