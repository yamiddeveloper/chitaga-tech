(function () {
    'use strict';
    console.log('=== EVENTO-FORM.JS INICIANDO ===');
    
    var form = document.getElementById('evento-form');
    var btn = document.getElementById('ef-submit-btn');
    console.log('Form:', !!form, 'Btn:', !!btn);
    
    if (!form || !btn) {
        console.error('Elementos no encontrados');
        return;
    }
    
    var slug = form.dataset.slug;
    var fieldsJson = form.dataset.fields;
    console.log('Slug:', slug, 'Fields:', fieldsJson);
    
    function getField(name) {
        return document.getElementById('ef-' + name);
    }
    
    function submitForm(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('=== SUBMIT CLICK ===');
        
        var email = getField('email').value.trim();
        console.log('Email:', email);
        
        if (!email) {
            alert('Ingresa tu correo');
            return;
        }
        
        btn.disabled = true;
        btn.textContent = 'Enviando...';
        
        var api = 'https://server.chitaga.tech'; // Actualizado: 2026-04-09
        var url = api + '/api/events/' + slug + '/register';
        console.log('URL:', url);
        
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email: email})
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
            console.log('RESPUESTA:', data);
            if (data.success) {
                alert('¡Inscripción exitosa! Revisa tu correo.');
            } else {
                alert('Error: ' + (data.error || 'Error desconocido'));
            }
            btn.disabled = false;
            btn.textContent = '¡Quiero entrar!';
        })
        .catch(function(err) {
            console.error('ERROR:', err);
            alert('Error de conexión');
            btn.disabled = false;
            btn.textContent = '¡Quiero entrar!';
        });
    }
    
    btn.addEventListener('click', submitForm);
    form.addEventListener('submit', submitForm);
    console.log('Event listeners agregados');
})();
