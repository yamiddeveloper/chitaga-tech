export function buildTallerIntroduccionEmail({ name, email }) {
    const safeName = escapeHtml(name || 'Participante');
    const safeEmail = escapeHtml(email);
    
    const html = `
<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>¡Una oportunidad única en Chitagá! Taller de Programación</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Montserrat:wght@700;800&display=swap');
        
        body, p, h1, h2, h3, h4, h5, h6 {
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #f1f5f9;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        img {
            border: 0;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            max-width: 100%;
            height: auto;
        }
        
        .email-wrapper {
            width: 100%;
            background-color: #f1f5f9;
            background-image: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            padding: 20px 10px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
        }
        
        .header {
            background-color: #184014;
            background-image: linear-gradient(135deg, #184014 0%, #2a6c23 100%);
            color: #ffffff;
            padding: 40px 24px;
            text-align: center;
        }
        
        .logo-container {
            width: 80px;
            height: 80px;
            background-color: #ffffff;
            border-radius: 50%;
            margin: 0 auto 24px auto;
            padding: 16px;
            box-sizing: border-box;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }
        
        h1 {
            font-family: 'Montserrat', -apple-system, sans-serif;
            font-weight: 800;
            font-size: 28px;
            line-height: 1.2;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
        }
        
        .subtitle {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 400;
            margin: 0;
        }
        
        .content {
            padding: 40px 32px;
        }
        
        .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #184014;
            margin-bottom: 32px;
        }
        
        .greeting span {
            color: #B93A05;
        }
        
        .story-title {
            font-family: 'Montserrat', -apple-system, sans-serif;
            font-weight: 700;
            font-size: 22px;
            color: #184014;
            margin-bottom: 16px;
        }
        
        .story-text {
            font-size: 16px;
            line-height: 1.8;
            color: #4a5568;
            margin-bottom: 20px;
        }
        
        .highlight {
            background-color: #fff5f2;
            border-left: 4px solid #B93A05;
            padding: 20px;
            border-radius: 0 12px 12px 0;
            margin: 24px 0;
        }

        .instructor-card {
            width: 100%;
            background-color: #ffffff;
            border: 2px solid #fbece7;
            border-radius: 16px;
            margin: 32px 0;
            border-collapse: separate;
            overflow: hidden;
        }

        .instructor-avatar-cell {
            padding: 24px 0 24px 24px;
            width: 80px;
            vertical-align: top;
        }

        .instructor-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: block;
        }
        
        .instructor-info-cell {
            padding: 24px;
            vertical-align: top;
        }
        
        .instructor-badge {
            display: inline-block;
            background-color: #fbece7;
            color: #B93A05;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 12px;
        }
        
        .instructor-name {
            font-family: 'Montserrat', -apple-system, sans-serif;
            font-weight: 700;
            font-size: 20px;
            color: #184014;
            margin-bottom: 8px;
        }
        
        .instructor-desc {
            font-size: 15px;
            color: #4a5568;
            line-height: 1.6;
            margin: 0;
        }
        
        .cta-section {
            text-align: center;
            margin: 48px 0 32px;
        }
        
        .cta-title {
            font-family: 'Montserrat', -apple-system, sans-serif;
            font-weight: 700;
            font-size: 24px;
            color: #184014;
            margin-bottom: 16px;
        }
        
        .important-note {
            background-color: #184014;
            color: #ffffff;
            padding: 24px;
            border-radius: 16px;
            margin: 40px 0;
            text-align: center;
        }
        
        .important-note h3 {
            font-family: 'Montserrat', -apple-system, sans-serif;
            font-size: 20px;
            margin-bottom: 12px;
            color: #ffffff;
        }
        
        .footer {
            background-color: #f8fafc;
            padding: 32px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer-logo {
            font-family: 'Montserrat', -apple-system, sans-serif;
            font-weight: 800;
            font-size: 20px;
            color: #184014;
            margin-bottom: 8px;
        }
        
        .footer-tagline {
            font-size: 15px;
            color: #4a5568;
            font-style: italic;
        }
        
        .contact-info {
            font-size: 13px;
            color: #718096;
            margin-top: 24px;
        }
        
        .contact-info a {
            color: #B93A05;
            text-decoration: none;
        }
        
        @media only screen and (max-width: 600px) {
            .email-container {
                border-radius: 16px !important;
            }
            .header {
                padding: 32px 20px !important;
            }
            h1 {
                font-size: 24px !important;
            }
            .content {
                padding: 32px 20px !important;
            }
            .instructor-avatar-cell, .instructor-info-cell {
                display: block !important;
                width: 100% !important;
                text-align: center !important;
                padding: 20px !important;
                box-sizing: border-box !important;
            }
            .instructor-avatar-cell {
                padding-bottom: 0 !important;
            }
            .instructor-avatar {
                margin: 0 auto !important;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center">
                    <div class="email-container">
                        
                        <div class="header">
                            <div class="logo-container">
                                <img src="https://chitaga.tech/favicon.ico" alt="Chitagá Tech" style="width: 48px; height: 48px; display: block; margin: 0 auto;" />
                            </div>
                            <h1>Introducción a la Programación</h1>
                            <p class="subtitle">Tu primer paso en tecnología, sin salir de nuestro pueblo.</p>
                        </div>
                        
                        <div class="content">
                            <p class="greeting">
                                Hola <span>${safeName}</span>, ¡qué orgullo tenerte con nosotros!
                            </p>
                            
                            <h2 class="story-title">✨ Una oportunidad escasa en Chitagá</h2>
                            <p class="story-text">
                                Sabemos lo difícil que es salir a estudiar y competir con quienes llevan años programando. 
                                Por eso creamos este espacio. Un evento que rara vez se ve en nuestro municipio, 
                                diseñado específicamente para que no tengas que irte lejos a buscar oportunidades.
                            </p>
                            
                            <div class="highlight">
                                <p class="story-text" style="margin: 0;">
                                    <strong>Lo mejor de todo: es talento 100% nuestro.</strong> 
                                    Aprenderás sin tecnicismos enredados, en un ambiente de confianza y entre paisanos.
                                </p>
                            </div>
                            
                            <table class="instructor-card" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td class="instructor-avatar-cell">
                                        <img src="https://chitaga.tech/images/founders/leider-solano.jpg" alt="Leider Solano" class="instructor-avatar" />
                                    </td>
                                    <td class="instructor-info-cell">
                                        <span class="instructor-badge">De un chitaguense para chitaguenses</span>
                                        <h3 class="instructor-name">Leider Solano</h3>
                                        <p class="instructor-desc">
                                            Estudiante de Ingeniería y desarrollador. Leider conoce nuestra realidad, 
                                            empezó desde cero aquí mismo, y hoy quiere compartir su conocimiento 
                                            para que el talento crezca en nuestro pueblo.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <div class="important-note">
                                <h3>📅 Agéndate</h3>
                                <p style="margin: 0; font-size: 16px; opacity: 0.9;">
                                    Nos vemos <strong>este fin de semana</strong>.<br>
                                    En las próximas 24 horas te enviaremos el lugar y la hora exacta del encuentro.
                                </p>
                            </div>
                            
                            <div class="cta-section">
                                <h2 class="cta-title">¿Por qué no puedes faltar?</h2>
                                <p class="story-text" style="margin-bottom: 24px;">
                                    Porque espacios como este no se repiten todos los días en Chitagá. 
                                    Es tu momento de escribir tu primera línea de código y descubrir el mundo de la tecnología 
                                    junto a personas de tu misma tierra.
                                </p>
                                <p class="story-text" style="font-weight: 600; color: #184014; margin: 0;">
                                    No es solo un taller. Es el comienzo de una comunidad tecnológica en Chitagá.
                                </p>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <div class="footer-logo">Chitagá Tech</div>
                            <p class="footer-tagline">Para que irse sea opción, no obligación.</p>
                            
                            <div class="contact-info">
                                <p>¿Tienes dudas? Escríbenos a <a href="mailto:info@chitaga.tech">info@chitaga.tech</a></p>
                                <p style="margin-top: 8px; opacity: 0.8;">
                                    Este correo fue enviado a ${safeEmail}
                                </p>
                            </div>
                        </div>

                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>`;
    
    const text = `
¡Hola ${name || 'Participante'}, qué orgullo tenerte con nosotros!

TALLER DE INTRODUCCIÓN A LA PROGRAMACIÓN
Tu primer paso en tecnología, sin salir de nuestro pueblo.
===========================================================

UNA OPORTUNIDAD ESCASA EN CHITAGÁ
Sabemos lo difícil que es salir a estudiar y competir con quienes llevan años programando. 
Por eso creamos este espacio. Un evento que rara vez se ve en nuestro municipio, 
diseñado específicamente para que no tengas que irte lejos a buscar oportunidades.

Lo mejor de todo: es talento 100% nuestro. 
Aprenderás sin tecnicismos enredados, en un ambiente de confianza y entre paisanos.

DE UN CHITAGUENSE PARA CHITAGUENSES: LEIDER SOLANO
Estudiante de Ingeniería y desarrollador. Leider conoce nuestra realidad, 
empezó desde cero aquí mismo, y hoy quiere compartir su conocimiento 
para que el talento crezca en nuestro pueblo.

📅 AGÉNDATE:
Nos vemos ESTE FIN DE SEMANA. 
En las próximas 24 horas te enviaremos el lugar y la hora exacta del encuentro.

¿POR QUÉ NO PUEDES FALTAR?
Porque espacios como este no se repiten todos los días en Chitagá. 
Es tu momento de escribir tu primera línea de código y descubrir el mundo de la tecnología 
junto a personas de tu misma tierra.

No es solo un taller. Es el comienzo de una comunidad tecnológica en Chitagá.

--
Chitagá Tech
"Para que irse sea opción, no obligación."

¿Tienes dudas? Escríbenos a: info@chitaga.tech
Este correo fue enviado a: ${email}
`;
    
    return { html, text };
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}