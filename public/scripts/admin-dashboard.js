(function () {
    var API = window.location.hostname === 'localhost' ? '' : 'https://app.chitaga.tech';
    var gate = document.getElementById('dash-gate');
    var form = document.getElementById('dash-auth-form');
    var passwordInput = document.getElementById('dash-password');
    var eventSelect = document.getElementById('dash-event-slug');
    var loadBtn = document.getElementById('dash-load-btn');
    var feedback = document.getElementById('dash-feedback');
    var content = document.getElementById('dash-content');
    var renderEl = document.getElementById('dash-render');
    var backBtn = document.getElementById('dash-back-btn');

    if (!form) return;

    var adminKey = '';
    var currentSlug = '';
    var dashData = null;

    var storedKey = sessionStorage.getItem('chitaga_admin_key');
    if (storedKey) passwordInput.value = storedKey;

    form.addEventListener('submit', function (e) { e.preventDefault(); loadDashboard(); });
    backBtn.addEventListener('click', function () { content.hidden = true; gate.hidden = false; });

    function loadDashboard() {
        adminKey = passwordInput.value.trim();
        currentSlug = eventSelect.value;
        if (!adminKey || !currentSlug) return;
        feedback.textContent = '';
        loadBtn.disabled = true;
        loadBtn.textContent = 'Cargando...';
        apiFetch('/api/events/' + currentSlug + '/dashboard?t=' + Date.now())
            .then(function (data) {
                sessionStorage.setItem('chitaga_admin_key', adminKey);
                dashData = data;
                gate.hidden = true;
                content.hidden = false;
                render();
            })
            .catch(function (err) { feedback.textContent = err.message; })
            .finally(function () { loadBtn.disabled = false; loadBtn.textContent = 'Ver dashboard'; });
    }

    function apiFetch(path, opts) {
        var o = opts || {};
        var headers = { 'x-admin-key': adminKey };
        if (o.body) headers['Content-Type'] = 'application/json';
        return fetch(API + path, {
            method: o.method || 'GET',
            headers: headers,
            body: o.body ? JSON.stringify(o.body) : undefined,
            cache: 'no-store',
        }).then(function (r) {
            if (r.status === 401) throw new Error('Clave incorrecta');
            if (!r.ok) throw new Error('Error del servidor');
            return r.json();
        });
    }

    // ================================================================
    // Render
    // ================================================================
    function render() {
        var regs = dashData.registrations;
        var att = dashData.attendance;
        var ev = dashData.event;
        var communitySize = dashData.communitySize || 0;
        var extraInternalAttendees = dashData.extraInternalAttendees || 0;
        var extraExternalAttendees = dashData.extraExternalAttendees || 0;
        var realFinishedTotalInput = dashData.realFinishedTotal || 0;

        // Compute
        var internalCount = 0, externalCount = 0;
        var internalAttended = 0, externalAttended = 0;
        regs.forEach(function (r) {
            if (r.isMember) internalCount++; else externalCount++;
            var a = att[r.id] || { attended: false, finished: false, activated: false };
            if (a.attended) {
                if (r.isMember) internalAttended++; else externalAttended++;
            }
        });

        var groups = {};
        regs.forEach(function (r) {
            var grp = r.data.group || 'sin-grupo';
            if (!groups[grp]) groups[grp] = { inscritos: 0, asistieron: 0, finalizaron: 0, activados: 0, internos: 0, externos: 0, members: [] };
            groups[grp].inscritos++;
            if (r.isMember) groups[grp].internos++; else groups[grp].externos++;
            var a = att[r.id] || { attended: false, finished: false, activated: false };
            if (a.attended) groups[grp].asistieron++;
            if (a.finished) groups[grp].finalizaron++;
            if (a.activated) groups[grp].activados++;
            groups[grp].members.push({
                id: r.id, name: r.data.name || r.data.email,
                attended: a.attended, finished: a.finished, activated: a.activated,
                place: r.data.place || '',
                isMember: !!r.isMember,
            });
        });

        var total = regs.length;
        var totalAtt = 0, totalFin = 0, totalAct = 0;
        Object.keys(groups).forEach(function (g) {
            totalAtt += groups[g].asistieron;
            totalFin += groups[g].finalizaron;
            totalAct += groups[g].activados;
        });

        var totalAttReal = totalAtt + extraInternalAttendees + extraExternalAttendees;
        var internalAttReal = internalAttended + extraInternalAttendees;
        var externalAttReal = externalAttended + extraExternalAttendees;
        var totalFinReal = Math.max(realFinishedTotalInput, totalFin);

        var h = '';

        // Community size editor
        h += '<div class="db-community-edit">';
        h += '<label>Comunidad al evento:</label>';
        h += '<input type="number" id="db-community-input" class="db-community-input" min="0" value="' + communitySize + '">';
        h += '<label>Internos sin formulario:</label>';
        h += '<input type="number" id="db-extra-internal-input" class="db-community-input" min="0" value="' + extraInternalAttendees + '">';
        h += '<label>Externos sin formulario:</label>';
        h += '<input type="number" id="db-extra-external-input" class="db-community-input" min="0" value="' + extraExternalAttendees + '">';
        h += '<label>Finalizaron reales (total):</label>';
        h += '<input type="number" id="db-real-finished-input" class="db-community-input" min="0" value="' + totalFinReal + '">';
        h += '<button id="db-community-save" class="dash-btn dash-btn--primary db-community-btn">Guardar</button>';
        h += '<span id="db-community-status" class="db-community-status"></span>';
        h += '</div>';

        // ===== Funnel =====
        h += '<div class="db-section">';
        h += '<div class="db-section-label">Embudo de conversion</div>';
        h += '<div class="db-funnel">';

        h += fnRow('Comunidad', communitySize, 100, 'fn-blue', communitySize + ' miembros', 'var(--blue)');

        // Split bar for inscritos
        h += '<div class="db-fn-row">';
        h += '<span class="db-fn-label">Inscritos</span>';
        h += '<div class="db-fn-split">';
        h += '<div class="db-fn-split-track" style="flex:' + Math.max(internalCount, 1) + '"><div class="db-fn-split-bar fn-green" style="width:100%">' + internalCount + ' internos</div></div>';
        h += '<div class="db-fn-split-track" style="flex:' + Math.max(externalCount, 1) + '"><div class="db-fn-split-bar fn-teal" style="width:100%">' + externalCount + ' externos</div></div>';
        h += '</div>';
        h += '<span class="db-fn-num" style="color:var(--green)">' + total + '</span>';
        h += '</div>';

        var attPct = total ? Math.round((totalAtt / total) * 100) : 0;
        h += fnRow('Asistieron', totalAtt, Math.max(attPct, 5), 'fn-amber', attPct + '% de inscritos', 'var(--amber)');

        var realAttPct = total ? Math.round((totalAttReal / total) * 100) : 0;
        h += fnRow('Asistencia real', totalAttReal, Math.max(Math.min(realAttPct, 100), 5), 'fn-blue', totalAttReal + ' total (incluye extras)', 'var(--blue)');

        var finPct = totalAtt ? Math.round((totalFin / totalAtt) * 100) : 0;
        h += fnRow('Finalizaron', totalFin, Math.max(finPct, 5), 'fn-pink', finPct + '% de asistentes', 'var(--pink)');

        var finRealPct = totalAttReal ? Math.round((totalFinReal / totalAttReal) * 100) : 0;
        h += fnRow('Finalizacion real', totalFinReal, Math.max(finRealPct, 5), 'fn-pink', finRealPct + '% de asistencia real', 'var(--pink)');

        var actPct = totalFin ? Math.round((totalAct / totalFin) * 100) : 0;
        h += fnRow('Activados 24h', totalAct, Math.max(actPct, 5), 'fn-purple', actPct + '% de finalizados', 'var(--purple)');

        h += '</div>'; // funnel

        // ===== Metrics =====
        h += '<div class="db-metrics">';
        h += mc('Internos / asistencia', pct(internalAttReal, totalAttReal), internalAttReal + ' de ' + totalAttReal + ' asistentes', 'var(--green)');
        h += mc('Externos / asistencia', pct(externalAttReal, totalAttReal), externalAttReal + ' de ' + totalAttReal + ' asistentes', 'var(--blue)');
        h += mc('Internos / comunidad', pct(internalAttReal, communitySize), internalAttReal + ' de ' + communitySize + ' miembros', 'var(--amber)');
        h += mc('Activacion 24h', pct(totalAct, totalFin), totalAct + ' de ' + totalFin + ' finalizados por formulario', 'var(--purple)');
        h += '</div>';
        h += '</div>'; // section

        // ===== Group comparison =====
        var groupKeys = Object.keys(groups).sort();
        if (groupKeys.length > 1) {
            h += '<div class="db-section">';
            h += '<div class="db-section-label">Comparacion por grupo</div>';
            h += '<div class="db-groups">';

            var groupMeta = {
                'grupo-1': { label: 'Grupo 1 — Tarde', badge: '2:00 PM', cls: 'gc-1' },
                'grupo-2': { label: 'Grupo 2 — Noche', badge: '9:00 PM', cls: 'gc-2' },
            };

            groupKeys.forEach(function (gk) {
                var g = groups[gk];
                var meta = groupMeta[gk] || { label: gk, badge: '', cls: '' };
                h += '<div class="db-gc ' + meta.cls + '">';
                h += '<div class="db-gc-title">' + esc(meta.label) + ' <span class="db-gc-badge">' + esc(meta.badge) + '</span></div>';
                h += stat('Inscritos', g.inscritos);
                h += stat('Asistieron', g.asistieron + ' (' + pct(g.asistieron, g.inscritos) + ')');
                h += stat('Finalizaron', g.finalizaron + ' (' + pct(g.finalizaron, g.asistieron) + ')');
                h += stat('Activados 24h', g.activados + ' (' + pct(g.activados, g.finalizaron) + ')');
                h += '</div>';
            });

            h += '</div></div>';
        }

        // ===== Participant map =====
        h += '<div class="db-section">';
        h += '<div class="db-section-label">Mapa de participantes</div>';
        h += '<div class="db-legend">';
        h += '<span class="db-legend-item"><span class="db-legend-dot" style="background:var(--blue)"></span> Miembro</span>';
        h += '<span class="db-legend-item"><span class="db-legend-dot" style="background:var(--dt3)"></span> Externo</span>';
        h += '<span class="db-legend-item"><span class="db-legend-dot" style="background:var(--green)"></span> Completo + activado</span>';
        h += '<span class="db-legend-item"><span class="db-legend-dot" style="background:var(--amber)"></span> Completo</span>';
        h += '<span class="db-legend-item"><span class="db-legend-dot" style="background:var(--red)"></span> Incompleto</span>';
        h += '<span class="db-legend-item"><span class="db-legend-dot" style="background:var(--dt3)"></span> Ausente</span>';
        h += '</div>';

        var groupLabels = { 'grupo-1': 'Grupo 1 — 2:00 PM', 'grupo-2': 'Grupo 2 — 9:00 PM' };

        // Grid — each group has its own title + members block
        h += '<div class="db-roster-grid">';
        groupKeys.forEach(function (gk) {
            var g = groups[gk];
            g.members.sort(function (a, b) {
                var sa = a.activated ? 0 : a.finished ? 1 : a.attended ? 2 : 3;
                var sb = b.activated ? 0 : b.finished ? 1 : b.attended ? 2 : 3;
                return sa !== sb ? sa - sb : a.name.localeCompare(b.name);
            });

            h += '<div class="db-roster-group">';
            h += '<div class="db-roster-col-title">' + esc(groupLabels[gk] || gk) + ' (' + g.inscritos + ' inscritos)</div>';
            g.members.forEach(function (m) {
                var dotColor, tagClass, tagText;
                if (m.activated)     { dotColor = 'var(--green)';  tagClass = 'db-tag-ok'; tagText = 'completo'; }
                else if (m.finished) { dotColor = 'var(--amber)';  tagClass = 'db-tag-ok'; tagText = 'completo'; }
                else if (m.attended) { dotColor = 'var(--red)';    tagClass = 'db-tag-part'; tagText = 'incompleto'; }
                else                 { dotColor = 'var(--dt3)';    tagClass = 'db-tag-no';   tagText = 'ausente'; }

                h += '<div class="db-p-row" title="' + esc(m.place) + '">';
                h += '<span class="db-p-dot" style="background:' + dotColor + '"></span>';
                h += '<span class="db-p-name">' + esc(m.name) + '</span>';
                h += '<span class="db-p-tag ' + (m.isMember ? 'db-tag-internal' : 'db-tag-external') + '">' + (m.isMember ? 'miembro' : 'no miembro') + '</span>';
                h += '<span class="db-p-tag ' + tagClass + '">' + tagText + '</span>';
                if (m.activated) {
                    h += '<span class="db-p-tag db-tag-act">activado 24h</span>';
                }
                h += '<button class="db-activation-toggle ' + (m.activated ? 'is-on' : 'is-off') + '" data-reg-id="' + m.id + '" data-attended="' + (m.attended ? '1' : '0') + '" data-finished="' + (m.finished ? '1' : '0') + '" data-activated="' + (m.activated ? '1' : '0') + '">' + (m.activated ? 'Quitar activacion' : 'Activar 24h') + '</button>';
                h += '<button class="db-member-toggle ' + (m.isMember ? 'is-active' : 'is-inactive') + '" data-reg-id="' + m.id + '" data-is-member="' + (m.isMember ? '1' : '0') + '">' + (m.isMember ? 'Pasar a externo' : 'Pasar a miembro') + '</button>';
                h += '</div>';
            });
            h += '</div>'; // roster-group
        });
        h += '</div>'; // roster-grid
        h += '</div>'; // section

        renderEl.innerHTML = h;
        bindEvents();
    }

    // ================================================================
    // Events
    // ================================================================
    function bindEvents() {
        var saveBtn = document.getElementById('db-community-save');
        var input = document.getElementById('db-community-input');
        var inputExtraInternal = document.getElementById('db-extra-internal-input');
        var inputExtraExternal = document.getElementById('db-extra-external-input');
        var inputRealFinished = document.getElementById('db-real-finished-input');
        var status = document.getElementById('db-community-status');
        if (saveBtn) {
            saveBtn.addEventListener('click', function () {
                var val = parseInt(input.value, 10);
                var valExtraInternal = parseInt(inputExtraInternal.value, 10);
                var valExtraExternal = parseInt(inputExtraExternal.value, 10);
                var valRealFinished = parseInt(inputRealFinished.value, 10);
                if (isNaN(val) || val < 0) { status.textContent = 'Numero invalido'; return; }
                if (isNaN(valExtraInternal) || valExtraInternal < 0) { status.textContent = 'Internos extra invalidos'; return; }
                if (isNaN(valExtraExternal) || valExtraExternal < 0) { status.textContent = 'Externos extra invalidos'; return; }
                if (isNaN(valRealFinished) || valRealFinished < 0) { status.textContent = 'Finalizacion real invalida'; return; }
                status.textContent = 'Guardando...';
                saveBtn.disabled = true;
                apiFetch('/api/events/' + currentSlug + '/snapshot', {
                    method: 'PUT', body: {
                        communitySize: val,
                        extraInternalAttendees: valExtraInternal,
                        extraExternalAttendees: valExtraExternal,
                        realFinishedTotal: valRealFinished,
                    }
                }).then(function () {
                    dashData.communitySize = val;
                    dashData.extraInternalAttendees = valExtraInternal;
                    dashData.extraExternalAttendees = valExtraExternal;
                    dashData.realFinishedTotal = valRealFinished;
                    status.textContent = 'Guardado';
                    render();
                }).catch(function (err) {
                    status.textContent = err.message;
                }).finally(function () { saveBtn.disabled = false; });
            });
        }

        var memberBtns = document.querySelectorAll('.db-member-toggle');
        memberBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var regId = btn.getAttribute('data-reg-id');
                var currentlyMember = btn.getAttribute('data-is-member') === '1';
                var nextIsMember = !currentlyMember;
                var originalText = btn.textContent;

                btn.disabled = true;
                btn.textContent = 'Guardando...';

                apiFetch('/api/events/' + currentSlug + '/registrations/' + regId + '/member', {
                    method: 'PUT', body: { isMember: nextIsMember }
                }).then(function () {
                    var targetId = parseInt(regId, 10);
                    dashData.registrations = dashData.registrations.map(function (r) {
                        if (r.id === targetId) {
                            r.isMember = nextIsMember;
                        }
                        return r;
                    });
                    render();
                }).catch(function () {
                    btn.textContent = originalText;
                    btn.disabled = false;
                });
            });
        });

        var activationBtns = document.querySelectorAll('.db-activation-toggle');
        activationBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var regId = btn.getAttribute('data-reg-id');
                var attended = btn.getAttribute('data-attended') === '1';
                var finished = btn.getAttribute('data-finished') === '1';
                var activated = btn.getAttribute('data-activated') === '1';

                var nextActivated = !activated;
                var nextAttended = nextActivated ? true : attended;
                var nextFinished = nextActivated ? true : finished;

                var originalText = btn.textContent;
                btn.disabled = true;
                btn.textContent = 'Guardando...';

                apiFetch('/api/events/' + currentSlug + '/attendance/' + regId, {
                    method: 'PUT', body: { attended: nextAttended, finished: nextFinished, activated: nextActivated }
                }).then(function () {
                    var targetId = parseInt(regId, 10);
                    dashData.attendance[targetId] = {
                        attended: nextAttended,
                        finished: nextFinished,
                        activated: nextActivated,
                    };
                    render();
                }).catch(function () {
                    btn.textContent = originalText;
                    btn.disabled = false;
                });
            });
        });
    }

    // ================================================================
    // Helpers
    // ================================================================
    function pct(n, d) { return d ? Math.round((n / d) * 100) + '%' : '0%'; }

    function esc(s) {
        var d = document.createElement('div');
        d.textContent = s || '';
        return d.innerHTML;
    }

    function fnRow(label, count, w, cls, text, numColor) {
        return '<div class="db-fn-row">' +
            '<span class="db-fn-label">' + esc(label) + '</span>' +
            '<div class="db-fn-track"><div class="db-fn-bar ' + cls + '" style="width:' + w + '%">' + esc(text) + '</div></div>' +
            '<span class="db-fn-num" style="color:' + numColor + '">' + count + '</span>' +
            '</div>';
    }

    function mc(label, value, sub, color) {
        return '<div class="db-mc">' +
            '<div class="db-mc-label">' + esc(label) + '</div>' +
            '<div class="db-mc-value" style="color:' + color + '">' + esc(String(value)) + '</div>' +
            '<div class="db-mc-sub">' + esc(sub) + '</div>' +
            '</div>';
    }

    function stat(label, value) {
        return '<div class="db-stat-row"><span class="db-stat-label">' + esc(label) + '</span><span class="db-stat-value">' + esc(String(value)) + '</span></div>';
    }
})();
