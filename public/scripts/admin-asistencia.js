(function () {
    var API = window.location.hostname === 'localhost' ? '' : 'https://server.chitaga.tech';
    var pageRoot = document.querySelector('.att-main');
    var gate = document.getElementById('att-gate');
    var form = document.getElementById('att-auth-form');
    var passwordInput = document.getElementById('att-password');
    var eventSelect = document.getElementById('att-event-slug');
    var loadBtn = document.querySelector('.att-btn--primary');
    var feedback = document.getElementById('att-feedback');
    var dashboard = document.getElementById('att-dashboard');
    var eventHeader = document.getElementById('att-event-header');
    var statsEl = document.getElementById('att-stats');
    var listEl = document.getElementById('att-list');
    var searchInput = document.getElementById('att-search');
    var filterBtns = document.querySelectorAll('.att-filter-btn');
    var backBtn = document.getElementById('att-back-btn');

    if (!pageRoot || !form) return;

    var eventsMeta = [];
    try { eventsMeta = JSON.parse(pageRoot.dataset.events || '[]'); } catch (e) { eventsMeta = []; }

    var currentRows = [];
    var attendance = {};
    var attendanceEnd = {};
    var attendanceActivated = {};
    var currentSlug = '';
    var activeFilter = 'all';

    var storedKey = sessionStorage.getItem('chitaga_admin_key');
    if (storedKey) passwordInput.value = storedKey;

    // ===== Auth =====
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var key = (passwordInput.value || '').trim();
        var slug = eventSelect.value;
        if (!key) { setFeedback('Ingresa la contraseña.'); return; }
        if (!slug) { setFeedback('Selecciona un evento.'); return; }
        sessionStorage.setItem('chitaga_admin_key', key);
        loadBtn.disabled = true;
        loadBtn.textContent = 'Cargando...';
        setFeedback('');

        fetch(API + '/api/events/' + encodeURIComponent(slug) + '/registrations?t=' + Date.now(), {
            method: 'GET',
            headers: { 'x-admin-key': key },
            cache: 'no-store',
        })
        .then(function (res) {
            return res.json().catch(function () { return null; }).then(function (p) {
                return { ok: res.ok, status: res.status, payload: p };
            });
        })
        .then(function (resp) {
            if (!resp.ok) {
                if (resp.status === 401) {
                    sessionStorage.removeItem('chitaga_admin_key');
                    setFeedback('Contraseña incorrecta.');
                    return;
                }
                setFeedback(resp.payload && resp.payload.error ? resp.payload.error : 'Error al consultar.');
                return;
            }
            currentSlug = slug;
            currentRows = Array.isArray(resp.payload) ? resp.payload : [];
            // Load attendance from server
            loadAttendanceFromServer(slug, key);
        })
        .catch(function () { setFeedback('Error de conexion con la API.'); })
        .finally(function () { loadBtn.disabled = false; loadBtn.textContent = 'Cargar asistencia'; });
    });

    // ===== Back =====
    backBtn.addEventListener('click', function () {
        dashboard.hidden = true;
        gate.hidden = false;
    });

    // ===== Search =====
    searchInput.addEventListener('input', applyFilters);

    // ===== Filters =====
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            applyFilters();
        });
    });

    // ===== Show dashboard =====
    function showDashboard() {
        gate.hidden = true;
        dashboard.hidden = false;
        renderHeader();
        renderList();
        renderStats();
    }

    // ===== Render header =====
    function renderHeader() {
        var meta = eventsMeta.find(function (e) { return e.slug === currentSlug; }) || {};
        eventHeader.innerHTML =
            '<h2 class="att-event-title">' + esc(meta.title || currentSlug) + '</h2>' +
            '<p class="att-event-meta">' + esc(formatDate(meta.date)) + ' &middot; ' + esc(meta.time || '') + '</p>' +
            '<p class="att-event-meta">' + currentRows.length + ' inscritos' + (meta.capacity ? ' / ' + meta.capacity + ' cupos' : '') + '</p>';
    }

    // ===== Render stats =====
    function renderStats() {
        var total = currentRows.length;
        var present = 0;
        var finished = 0;
        var activated = 0;
        var internalCount = 0;
        var externalCount = 0;
        var g1 = 0;
        var g2 = 0;
        currentRows.forEach(function (r) {
            var d = r.data || {};
            if (attendance[r.id]) present++;
            if (attendanceEnd[r.id]) finished++;
            if (attendanceActivated[r.id]) activated++;
            if (r.isMember) internalCount++; else externalCount++;
            if (d.group === 'grupo-1') g1++;
            if (d.group === 'grupo-2') g2++;
        });
        statsEl.innerHTML = [
            stat(total, 'Inscritos', ''),
            stat(internalCount, 'Internos', 'green'),
            stat(externalCount, 'Externos', 'orange'),
            stat(present, 'Presentes', ''),
            stat(finished, 'Finalizaron', 'green'),
            stat(activated, 'Activados 24h', 'green'),
            stat(total - present, 'Ausentes', 'orange'),
            stat(g1, 'Grupo 1', ''),
            stat(g2, 'Grupo 2', ''),
        ].join('');
    }

    function stat(value, label, cls) {
        return '<div class="att-stat"><span class="att-stat-value ' + cls + '">' + value + '</span><span class="att-stat-label">' + label + '</span></div>';
    }

    // ===== Render list =====
    function renderList() {
        if (!currentRows.length) {
            listEl.innerHTML = '<div class="att-empty">No hay inscritos en este evento.</div>';
            return;
        }

        listEl.innerHTML = currentRows.map(function (row, i) {
            var d = row.data || {};
            var checked = attendance[row.id] ? true : false;
            var checkedEnd = attendanceEnd[row.id] ? true : false;
            var checkedActivated = attendanceActivated[row.id] ? true : false;
            var groupLabel = d.group === 'grupo-1' ? 'Grupo 1' : d.group === 'grupo-2' ? 'Grupo 2' : d.group || 'Sin grupo';
            var hasPhoto = (d.has_photo || '').toLowerCase() === 'si';
            var memberTag = row.isMember ? 'Interno' : 'Externo';
            var memberTagClass = row.isMember ? 'att-tag--internal' : 'att-tag--external';

            return [
                '<div class="att-participant' + (checked ? ' checked' : '') + (checkedEnd ? ' finished' : '') + '" data-id="' + row.id + '" data-group="' + esc(d.group || '') + '" data-search="' + esc((d.name || '') + ' ' + (d.email || '') + ' ' + (d.place || '') + ' ' + memberTag).toLowerCase() + '">',
                '  <div class="att-avatar">' + (i + 1) + '</div>',
                '  <div class="att-info">',
                '    <p class="att-name">' + esc(d.name || 'Sin nombre') + '</p>',
                '    <p class="att-email">' + esc(d.email || row.email || 'Sin correo') + '</p>',
                '    <div class="att-details">',
                '      <span class="att-tag att-tag--group">' + esc(groupLabel) + '</span>',
                '      <span class="att-tag ' + memberTagClass + '">' + memberTag + '</span>',
                       hasPhoto
                           ? '<span class="att-tag att-tag--photo-yes">Foto lista</span>'
                           : '<span class="att-tag att-tag--photo-no">Sin foto</span>',
                '      <span class="att-tag">' + esc(d.phone || 'Sin tel.') + '</span>',
                '    </div>',
                     d.place ? '<p class="att-place">' + esc(d.place) + '</p>' : '',
                '  </div>',
                '  <div class="att-checks">',
                '    <label class="att-check-label"><span>Asistió</span><input type="checkbox" class="att-toggle" data-id="' + row.id + '"' + (checked ? ' checked' : '') + ' /></label>',
                '    <label class="att-check-label"><span>Finalizó</span><input type="checkbox" class="att-toggle-end" data-id="' + row.id + '"' + (checkedEnd ? ' checked' : '') + ' /></label>',
                '    <label class="att-check-label"><span>Activó 24h</span><input type="checkbox" class="att-toggle-act" data-id="' + row.id + '"' + (checkedActivated ? ' checked' : '') + ' /></label>',
                '  </div>',
                '</div>',
            ].join('');
        }).join('');

        // Bind attendance toggles
        listEl.querySelectorAll('.att-toggle').forEach(function (cb) {
            cb.addEventListener('change', function () {
                var id = cb.dataset.id;
                var card = listEl.querySelector('.att-participant[data-id="' + id + '"]');
                if (cb.checked) {
                    attendance[id] = true;
                    if (card) card.classList.add('checked');
                } else {
                    delete attendance[id];
                    if (card) card.classList.remove('checked');
                    // If unchecking attendance, also uncheck "finished"
                    var endCb = card && card.querySelector('.att-toggle-end');
                    if (endCb && endCb.checked) {
                        endCb.checked = false;
                        delete attendanceEnd[id];
                        card.classList.remove('finished');
                    }
                    var actCb = card && card.querySelector('.att-toggle-act');
                    if (actCb && actCb.checked) {
                        actCb.checked = false;
                        delete attendanceActivated[id];
                    }
                }
                saveAttendanceToServer(id);
                renderStats();
            });
        });

        // Bind "stayed until end" toggles
        listEl.querySelectorAll('.att-toggle-end').forEach(function (cb) {
            cb.addEventListener('change', function () {
                var id = cb.dataset.id;
                var card = listEl.querySelector('.att-participant[data-id="' + id + '"]');
                if (cb.checked) {
                    attendanceEnd[id] = true;
                    if (card) card.classList.add('finished');
                    // Auto-check attendance if not already
                    if (!attendance[id]) {
                        attendance[id] = true;
                        var attCb = card && card.querySelector('.att-toggle');
                        if (attCb) attCb.checked = true;
                        if (card) card.classList.add('checked');
                    }
                } else {
                    delete attendanceEnd[id];
                    if (card) card.classList.remove('finished');
                    var actCb = card && card.querySelector('.att-toggle-act');
                    if (actCb && actCb.checked) {
                        actCb.checked = false;
                        delete attendanceActivated[id];
                    }
                }
                saveAttendanceToServer(id);
                renderStats();
            });
        });

        // Bind "activated after 24h" toggles
        listEl.querySelectorAll('.att-toggle-act').forEach(function (cb) {
            cb.addEventListener('change', function () {
                var id = cb.dataset.id;
                var card = listEl.querySelector('.att-participant[data-id="' + id + '"]');
                if (cb.checked) {
                    attendanceActivated[id] = true;
                    if (!attendanceEnd[id]) {
                        attendanceEnd[id] = true;
                        var endCb = card && card.querySelector('.att-toggle-end');
                        if (endCb) endCb.checked = true;
                    }
                    if (!attendance[id]) {
                        attendance[id] = true;
                        var attCb = card && card.querySelector('.att-toggle');
                        if (attCb) attCb.checked = true;
                    }
                    if (card) card.classList.add('checked', 'finished');
                } else {
                    delete attendanceActivated[id];
                }
                saveAttendanceToServer(id);
                renderStats();
            });
        });
    }

    // ===== Filters =====
    function applyFilters() {
        var query = (searchInput.value || '').toLowerCase().trim();
        var cards = listEl.querySelectorAll('.att-participant');
        cards.forEach(function (card) {
            var matchGroup = activeFilter === 'all' || card.dataset.group === activeFilter;
            var matchSearch = !query || (card.dataset.search || '').indexOf(query) !== -1;
            card.classList.toggle('hidden', !(matchGroup && matchSearch));
        });
    }

    // ===== Persistence (server API) =====
    function getAdminKey() {
        return sessionStorage.getItem('chitaga_admin_key') || '';
    }

    // ===== Migration: localStorage → server =====
    function migrateLocalData(slug, key) {
        var localAtt = {};
        var localEnd = {};
        try { localAtt = JSON.parse(localStorage.getItem('chitaga_att_' + slug) || '{}'); } catch (e) {}
        try { localEnd = JSON.parse(localStorage.getItem('chitaga_att_end_' + slug) || '{}'); } catch (e) {}

        // Merge: collect all IDs that have data in localStorage
        var allIds = {};
        var id;
        for (id in localAtt) { if (localAtt[id]) allIds[id] = true; }
        for (id in localEnd) { if (localEnd[id]) allIds[id] = true; }

        var ids = Object.keys(allIds);
        if (!ids.length) return Promise.resolve();

        // Upload each entry to the server
        var promises = ids.map(function (regId) {
            return fetch(API + '/api/events/' + encodeURIComponent(slug) + '/attendance/' + encodeURIComponent(regId), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
                body: JSON.stringify({
                    attended: !!localAtt[regId],
                    finished: !!localEnd[regId],
                }),
            }).catch(function () {});
        });

        return Promise.all(promises).then(function () {
            // Clean up localStorage after successful migration
            localStorage.removeItem('chitaga_att_' + slug);
            localStorage.removeItem('chitaga_att_end_' + slug);
            console.log('Migrated ' + ids.length + ' attendance records from localStorage to server.');
        });
    }

    function loadAttendanceFromServer(slug, key) {
        fetch(API + '/api/events/' + encodeURIComponent(slug) + '/attendance', {
            method: 'GET',
            headers: { 'x-admin-key': key || getAdminKey() },
            cache: 'no-store',
        })
        .then(function (res) { return res.ok ? res.json() : {}; })
        .then(function (data) {
            var serverKeys = Object.keys(data || {});
            var hasLocalData = !!localStorage.getItem('chitaga_att_' + slug);

            if (serverKeys.length === 0 && hasLocalData) {
                // Server empty but localStorage has data — migrate first, then reload
                migrateLocalData(slug, key || getAdminKey()).then(function () {
                    // Re-fetch from server after migration
                    fetch(API + '/api/events/' + encodeURIComponent(slug) + '/attendance', {
                        method: 'GET',
                        headers: { 'x-admin-key': key || getAdminKey() },
                        cache: 'no-store',
                    })
                    .then(function (res) { return res.ok ? res.json() : {}; })
                    .then(function (freshData) {
                        applyAttendanceData(freshData);
                        showDashboard();
                    });
                });
                return;
            }

            applyAttendanceData(data);
            showDashboard();
        })
        .catch(function () {
            attendance = {};
            attendanceEnd = {};
            showDashboard();
        });
    }

    function applyAttendanceData(data) {
        attendance = {};
        attendanceEnd = {};
        attendanceActivated = {};
        var keys = Object.keys(data || {});
        for (var i = 0; i < keys.length; i++) {
            var id = keys[i];
            if (data[id].attended) attendance[id] = true;
            if (data[id].finished) attendanceEnd[id] = true;
            if (data[id].activated) attendanceActivated[id] = true;
        }
    }

    function saveAttendanceToServer(id) {
        var attended = !!attendance[id];
        var finished = !!attendanceEnd[id];
        var activated = !!attendanceActivated[id];
        fetch(API + '/api/events/' + encodeURIComponent(currentSlug) + '/attendance/' + encodeURIComponent(id), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-key': getAdminKey(),
            },
            body: JSON.stringify({ attended: attended, finished: finished, activated: activated }),
        }).catch(function (err) {
            console.error('Error saving attendance:', err);
        });
    }

    // ===== Helpers =====
    function setFeedback(msg, ok) {
        feedback.textContent = msg;
        feedback.className = ok ? 'att-feedback ok' : 'att-feedback';
    }

    function formatDate(isoDate) {
        if (!isoDate) return 'Sin fecha';
        var normalized = isoDate.indexOf('T') > -1 ? isoDate : isoDate + 'T12:00:00';
        var date = new Date(normalized);
        if (Number.isNaN(date.getTime())) return isoDate;
        return date.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    function esc(v) {
        return String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
})();
