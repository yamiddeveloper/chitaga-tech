const DEFAULT_BRAND = 'Chitagá Tech';
const DEFAULT_FONT = 'font-family: "Inter", "Segoe UI", system-ui, sans-serif';

export function buildEventReminderEmail({
    name,
    eventTitle,
    eventDate,
    eventTime,
    groupLabel,
    calendarLink,
    meetLink,
    needsPhoto,
}) {
    const safeName = escapeHtml(name || 'Participante');
    const safeTitle = escapeHtml(eventTitle);
    const safeGroup = escapeHtml(groupLabel || 'Horario pendiente');
    const safeDate = escapeHtml(eventDate);
    const safeTime = escapeHtml(eventTime || 'Hora por confirmar');
    const safeLink = calendarLink ? escapeHtml(calendarLink) : null;
    const safeMeetLink = meetLink ? escapeHtml(meetLink) : null;
    const subject = needsPhoto
        ? `Hoy es el taller: ${eventTitle}. Prepárate y ten lista tu foto`
        : `Hoy es el taller: ${eventTitle}. Prepárate para comenzar`
    ;

    const bodyIntro = needsPhoto
        ? `Hoy se realiza <strong>${safeTitle}</strong>. Prepárate porque hoy es el taller y te esperamos con tus ganas de mostrar Chitagá.`
        : `Hoy se realiza <strong>${safeTitle}</strong>. Prepárate porque hoy es el taller y queremos verte conectado a tiempo.`
    ;

    const reminderText = needsPhoto
        ? 'Si aún no tienes la foto digital, ve obteniéndola desde ahora y responde este correo con el archivo o un enlace para descargarla.'
        : (safeLink ? 'Guarda el evento en tu calendario con el botón de abajo para no olvidarlo.' : 'Te esperamos conectado a la hora indicada.')
    ;

    const cta = safeLink
        ? `<a href="${safeLink}" style="background:#B93A05;color:#fff;padding:12px 26px;border-radius:999px;text-decoration:none;font-weight:600;display:inline-block;margin-top:18px;">Agregar ${needsPhoto ? 'o revisar' : 'al'} calendario</a>`
        : '';

    const meetCta = safeMeetLink
        ? `<a href="${safeMeetLink}" style="background:#0f3b2b;color:#fff;padding:12px 26px;border-radius:999px;text-decoration:none;font-weight:600;display:inline-block;margin-top:10px;">Unirse a Google Meet</a>`
        : '';

    const html = `
<div style="max-width:520px;margin:0 auto;${DEFAULT_FONT};color:#1c1c1c;">
    <h2 style="margin-bottom:8px;color:#0f3b2b;border-bottom:2px solid #f2b366;padding-bottom:6px;">Hola, ${safeName}</h2>
    <p style="margin-bottom:6px;">${bodyIntro}</p>
    <p style="margin:0;font-size:15px;color:#3a3a3a;">🗓️ ${safeDate} · ${safeTime}</p>
    <p style="margin:4px 0 18px;font-size:15px;color:#3a3a3a;">Horario: <strong>${safeGroup}</strong></p>
    <p style="margin-top:6px;font-size:15px;color:#3a3a3a;">${reminderText}</p>
    <div style="margin-top:12px;text-align:center;">
        ${meetCta}
        ${cta}
    </div>
    <hr style="margin:24px 0;border:none;border-top:1px solid #e5e5e5;" />
    <p style="font-size:13px;color:#777;">Si necesitas ayuda, responde este correo o contáctanos en WhatsApp.</p>
    <p style="font-size:11px;color:#aaa;">${DEFAULT_BRAND}</p>
</div>`;

    const textLines = [
        `Hola ${name || 'Participante'},`,
        '',
        needsPhoto
            ? `Hoy se realiza ${eventTitle}. Prepárate porque hoy es el taller y te esperamos con tus ganas de mostrar Chitagá.`
            : `Hoy se realiza ${eventTitle}. Prepárate porque hoy es el taller y queremos verte conectado a tiempo.`
        ,
        `Fecha: ${eventDate}`,
        `Horario: ${eventTime || 'Por definir'}`,
        `Tu horario asignado: ${groupLabel || 'Sin asignar'}`,
        '',
        reminderText.replace(/<[^>]+>/g, ''),
    ];

    if (calendarLink) textLines.push(`Calendario: ${calendarLink}`);

    textLines.push('', 'Chitaga Tech');

    return {
        subject,
        html,
        text: textLines.join('\n'),
    };
}

function escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
