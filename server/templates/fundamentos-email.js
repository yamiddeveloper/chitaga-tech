export function buildFundamentosEmail({ name, eventTitle, email }) {
    const safeName = escapeHtml(name || 'Participante');
    const safeTitle = escapeHtml(eventTitle);
    const safeEmail = escapeHtml(email);

    const html = `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 520px; margin: 0 auto; color: #222;">
    <h2 style="color: #184014; border-bottom: 2px solid #B93A05; padding-bottom: 8px;">
        ¡Hola, ${safeName}!
    </h2>
    
    <p style="font-size: 16px; line-height: 1.6;">
        <strong>✅ Tu registro ha sido exitoso</strong> para el taller:
    </p>
    
    <div style="background: #f9fafb; border-left: 4px solid #B93A05; padding: 16px; margin: 20px 0; border-radius: 4px;">
        <h3 style="color: #184014; margin: 0 0 8px 0;">${safeTitle}</h3>
        <p style="margin: 0; color: #555;">
            Dictado por Leider Solano, Estudiante de Ingeniería de Sistemas de la UniPamplona
        </p>
    </div>
    
    <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #bae6fd; border-radius: 12px; padding: 20px; margin: 28px 0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
        <h4 style="color: #0369a1; margin: 0 0 16px 0; font-size: 18px; border-bottom: 2px solid #bae6fd; padding-bottom: 8px;">📖 Una historia de Chitagá</h4>
        <p style="margin: 0 0 16px 0; color: #555; line-height: 1.7; font-size: 16px;">
            <a href="https://chitaga.tech/#miembros-fundadores" style="color: #B93A05; text-decoration: none; font-weight: 600; border-bottom: 2px dotted #B93A05; transition: all 0.3s ease; padding: 2px 4px; border-radius: 4px; background-color: rgba(185, 58, 5, 0.1);">Mariana Rojas</a> salió de Chitagá a estudiar ingeniería de sistemas. En la universidad 
            vio que sus compañeros ya sabían programación básica. Ella se preguntó: 
            <span style="color: #184014; font-weight: 600; font-style: italic; animation: pulse 2s infinite; background-color: rgba(24, 64, 20, 0.1); padding: 2px 6px; border-radius: 4px;">"¿Por qué a mí no me enseñaron eso?"</span>
        </p>
        <p class="call-to-action" style="margin: 0; color: #555; line-height: 1.7; font-size: 16px; font-weight: 600; background: linear-gradient(90deg, #184014, #B93A05); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; padding: 8px 12px; background-color: rgba(24, 64, 20, 0.05); border-radius: 8px; border-left: 4px solid #B93A05;">
            Este fin de semana Leider Solano nos enseñará a programar desde cero. Vamos a hacer historia en Chitagá.
        </p>
        <style>
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.8; }
            }
            @media (prefers-color-scheme: dark) {
                div {
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;
                    border-color: #475569 !important;
                }
                h4 {
                    color: #60a5fa !important;
                    border-bottom-color: #475569 !important;
                }
                p {
                    color: #cbd5e1 !important;
                }
                a {
                    color: #f97316 !important;
                    border-bottom-color: #f97316 !important;
                    background-color: rgba(249, 115, 22, 0.2) !important;
                }
                a:hover {
                    color: #fff !important;
                    background-color: #f97316 !important;
                }
                span {
                    color: #86efac !important;
                    background-color: rgba(34, 197, 94, 0.2) !important;
                }
                .call-to-action {
                    background: linear-gradient(90deg, #22c55e, #f97316) !important;
                    -webkit-background-clip: text !important;
                    -webkit-text-fill-color: transparent !important;
                    background-clip: text !important;
                    background-color: rgba(34, 197, 94, 0.1) !important;
                    border-left-color: #f97316 !important;
                }
            }
        </style>
    </div>
    
    <p style="font-size: 16px; line-height: 1.6;">
        <strong>📅 Fecha:</strong> Sábado 11 de Abril de 2026
    </p>
    
    <p style="font-size: 16px; line-height: 1.6;">
        <strong>⏰ Hora:</strong> 3:00 PM (hora Colombia)
    </p>
    
    <p style="font-size: 16px; line-height: 1.6;">
        <strong>📅 Agrega el evento a tu calendario:</strong>
        <br>
        <a href="https://calendar.app.google/g9i3vUScwk7wVqSC9" style="display: inline-block; background: #B93A05; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 8px;">
            📅 Agregar a Google Calendar
        </a>
    </p>
    
    <p style="font-size: 16px; line-height: 1.6;">
        <strong>📧 Confirmación:</strong> Recibirás el enlace de Google Meet y materiales adicionales a este correo:
        <br>
        <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${safeEmail}</code>
    </p>
    
    <div style="background: #fff8f0; border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <h4 style="color: #ea580c; margin: 0 0 8px 0;">📝 ¿Qué aprenderás?</h4>
        <ul style="margin: 0; padding-left: 20px; color: #555;">
            <li>Conceptos básicos de programación desde cero</li>
            <li>Lógica de programación y algoritmos</li>
            <li>Introducción a un lenguaje de programación</li>
            <li>Ejercicios prácticos y resolución de problemas</li>
        </ul>
    </div>
    
    <p style="font-size: 16px; line-height: 1.6;">
        <strong>👨‍🏫 Instructor:</strong> Leider Solano<br>
        <em>Estudiante de Ingeniería de Sistemas, UniPamplona</em>
    </p>
    
    <p style="font-size: 14px; color: #555; margin-top: 24px;">
        Si tienes alguna pregunta, responde este correo o escríbenos por WhatsApp.
    </p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin-top: 24px;" />
    
    <div style="text-align: center; margin-top: 24px;">
        <p style="font-size: 12px; color: #999;">
            <strong>Chitagá Tech</strong><br>
            Que irse sea opción, no obligación
        </p>
        <p style="font-size: 11px; color: #aaa;">
            Comunidad de profesionales chitagüenses que construyen oportunidades reales en tecnología.
        </p>
    </div>
</div>`;

    const textLines = [
        `¡Hola ${name || 'Participante'}!`,
        '',
        '✅ TU REGISTRO HA SIDO EXITOSO',
        '',
        `Taller: ${eventTitle}`,
        'Dictado por Leider Solano, Estudiante de Ingeniería de Sistemas de la UniPamplona',
        '',
        '📖 UNA HISTORIA DE CHITAGÁ',
        'Mariana Rojas salió de Chitagá a estudiar ingeniería de sistemas. En la universidad',
        'vio que sus compañeros ya sabían programación básica. Ella se preguntó:',
        '"¿Por qué a mí no me enseñaron eso?"',
        '',
        'Este fin de semana Leider Solano nos enseñará a programar desde cero. Vamos a hacer historia en Chitagá.',
        '',
        '📅 FECHA:',
        'Sábado 11 de Abril de 2026',
        '',
        '⏰ HORA:',
        '3:00 PM (hora Colombia)',
        '',
        '📅 AGREGA EL EVENTO A TU CALENDARIO:',
        'Enlace: https://calendar.app.google/g9i3vUScwk7wVqSC9',
        '',
        '📧 CONFIRMACIÓN:',
        `Recibirás el enlace de Google Meet y materiales adicionales a este correo: ${email}`,
        '',
        '📝 ¿QUÉ APRENDERÁS?',
        '- Conceptos básicos de programación desde cero',
        '- Lógica de programación y algoritmos',
        '- Introducción a un lenguaje de programación',
        '- Ejercicios prácticos y resolución de problemas',
        '',
        '👨‍🏫 INSTRUCTOR:',
        'Leider Solano',
        'Estudiante de Ingeniería de Sistemas, UniPamplona',
        '',
        'Si tienes alguna pregunta, responde este correo o escríbenos por WhatsApp.',
        '',
        '--',
        'Chitagá Tech',
        'Que irse sea opción, no obligación',
        'Comunidad de profesionales chitagüenses que construyen oportunidades reales en tecnología.',
    ];

    return { html, text: textLines.join('\n') };
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}