export function buildInvitationEmail({ name, eventTitle, groupLabel, calendarLink, meetLink }) {
    const safeName = escapeHtml(name);
    const safeTitle = escapeHtml(eventTitle);
    const safeLink = escapeHtml(calendarLink);

    const groupLine = groupLabel
        ? `<p>Tu horario es: <strong>${escapeHtml(groupLabel)}</strong></p>`
        : '';
    const meetLine = meetLink
        ? `<p>Enlace de la reunion: <a href="${escapeHtml(meetLink)}" style="color: #B93A05; font-weight: bold;">${escapeHtml(meetLink)}</a></p>`
        : '';

    const html = `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 520px; margin: 0 auto; color: #222;">
    <h2 style="color: #184014; border-bottom: 2px solid #B93A05; padding-bottom: 8px;">
        Hola, ${safeName}
    </h2>
    <p>Ya estas inscrito en <strong>${safeTitle}</strong></p>
    ${groupLine}
    ${meetLine}
    <p>Agrega la reunion a tu calendario para que no se te olvide:</p>
    <p style="text-align: center; margin: 28px 0;">
        <a href="${safeLink}"
           style="background-color: #B93A05; color: #ffffff; padding: 14px 28px; border-radius: 8px;
                  text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
            Agregar a Google Calendar
        </a>
    </p>
    <p style="font-size: 14px; color: #555;">
        Si tienes alguna pregunta, responde este correo o escribenos por WhatsApp.
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin-top: 24px;" />
    <p style="font-size: 12px; color: #999;">Chitaga Tech</p>
</div>`;

    const textLines = [
        `Hola ${name},`,
        '',
        `Ya estas inscrito en: ${eventTitle}`,
    ];
    if (groupLabel) textLines.push(`Tu horario es: ${groupLabel}`);
    if (meetLink) textLines.push(`Enlace de la reunion: ${meetLink}`);
    textLines.push(
        '',
        `Agrega la reunion a tu calendario: ${calendarLink}`,
        '',
        'Si tienes alguna pregunta, responde este correo o escribenos por WhatsApp.',
        '',
        '-- Chitaga Tech',
    );

    return { html, text: textLines.join('\n') };
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
