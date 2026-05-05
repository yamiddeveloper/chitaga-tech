# 🚀 Chitagá Tech - Sistema de Producción

## 📋 Arquitectura del Sistema

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Nginx (80)    │────▶│   Frontend      │────▶│   Usuario       │
│   Proxy/Static  │     │   Astro Build   │     │   Navegador     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                        │
         │                        │
         ▼                        ▼
┌─────────────────┐     ┌─────────────────┐
│   Backend API   │◀────│   JavaScript    │
│   Node.js (4324)│     │   Formularios   │
└─────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│   SQLite DB     │
│   chitaga.db    │
└─────────────────┘
```

## 🛠️ Scripts de Administración

### 1. **Instalación Completa** (Primera vez)
```bash
sudo ./install-production.sh
```

### 2. **Iniciar Sistema** (Después de instalación)
```bash
sudo ./start-production.sh
```

### 3. **Detener Sistema**
```bash
sudo ./stop-production.sh
```

### 4. **Solo Backend** (Desarrollo)
```bash
./start-server-tmux.sh
```

### 5. **Prueba Rápida**
```bash
./serve-test.sh
```

## 📁 Estructura de Archivos

```
/home/yamiddev/chitaga-tech/
├── dist/                          # Build de Astro (frontend)
├── server/                        # Backend Node.js
│   ├── index.js                   # Servidor principal
│   ├── chitaga.db                 # Base de datos SQLite
│   ├── config/                    # Configuraciones
│   └── templates/                 # Plantillas de email
├── src/                           # Código fuente Astro
├── public/                        # Archivos públicos
├── package.json                   # Dependencias
├── chitaga-tech-nginx.conf        # Config nginx
├── chitaga-tech.service           # Service systemd
└── scripts/                       # Scripts de administración
```

## 🔧 Configuración de Servicios

### Nginx
- **Configuración:** `/etc/nginx/sites-available/chitaga-tech`
- **Logs:** `/var/log/nginx/chitaga-tech-*.log`
- **Reiniciar:** `systemctl restart nginx`
- **Verificar:** `nginx -t`

### Backend (Systemd)
- **Servicio:** `chitaga-tech`
- **Iniciar:** `systemctl start chitaga-tech`
- **Estado:** `systemctl status chitaga-tech`
- **Logs:** `journalctl -u chitaga-tech -f`

### Backend (Tmux - Alternativa)
- **Sesión:** `chitaga-server`
- **Conectar:** `tmux attach -t chitaga-server`
- **Logs:** `/tmp/chitaga-server.log`

## 🌐 URLs del Sistema

### En Producción
- **Sitio Web:** `http://chitaga.tech` (o `http://localhost`)
- **API Health:** `http://chitaga.tech/api/health`
- **Formulario:** `http://chitaga.tech/evento/introduccion-programacion/`

### En Desarrollo
- **Frontend:** `http://localhost:8080` (con `./serve-test.sh`)
- **Backend:** `http://localhost:4324`
- **API Directa:** `http://localhost:4324/api/health`

## 📧 Sistema de Correos

### Plantillas
- **Introducción a Programación:** `server/templates/taller-introduccion-email.js`
- **Invitación Genérica:** `server/templates/invitation-email.js`
- **Notificación Admin:** `server/templates/registration-email.js`

### Configuración
Archivo: `server/.env`
```env
GMAIL_USER=tu-email@gmail.com
GMAIL_APP_PASSWORD=tu-contraseña-app
NOTIFY_EMAIL=admin@chitaga.tech
ADM_KEY=tu-clave-secreta
```

## 🗄️ Base de Datos

### SQLite
- **Archivo:** `server/chitaga.db`
- **Tablas:**
  - `event_registrations` - Inscripciones a eventos
  - `contacts` - Contactos del formulario
  - `suggestions` - Sugerencias
  - `attendance` - Asistencia a eventos

### Consultas Útiles
```bash
# Ver todas las inscripciones
sqlite3 server/chitaga.db "SELECT * FROM event_registrations;"

# Contar inscripciones por evento
sqlite3 server/chitaga.db "SELECT event_slug, COUNT(*) FROM event_registrations GROUP BY event_slug;"

# Ver últimas 10 inscripciones
sqlite3 server/chitaga.db "SELECT * FROM event_registrations ORDER BY id DESC LIMIT 10;"
```

## 🐛 Solución de Problemas

### 1. Modal no se muestra
**Síntoma:** El formulario envía pero no aparece el modal.
**Solución:**
1. Abrir consola del navegador (F12)
2. Verificar que no haya errores CORS
3. Verificar que `API` esté configurada correctamente en `public/scripts/evento-form.js`

### 2. Error 502 Bad Gateway
**Síntoma:** Nginx devuelve error 502.
**Solución:**
```bash
# Verificar que backend esté corriendo
systemctl status chitaga-tech

# Ver logs del backend
journalctl -u chitaga-tech -f

# Verificar puerto 4324
netstat -tlnp | grep :4324
```

### 3. Correos no se envían
**Síntoma:** Inscripción exitosa pero no llega correo.
**Solución:**
1. Verificar archivo `.env` en `server/`
2. Verificar logs: `tail -f /tmp/chitaga-server.log`
3. Probar credenciales de Gmail

### 4. Base de datos no se actualiza
**Síntoma:** Los registros no se guardan.
**Solución:**
```bash
# Verificar permisos
ls -la server/chitaga.db

# Verificar que SQLite pueda escribir
touch server/test.db && rm server/test.db
```

## 🔒 Seguridad

### 1. Firewall
```bash
# Verificar puertos abiertos
sudo ufw status

# Abrir puertos necesarios
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw allow 22/tcp   # SSH
```

### 2. HTTPS (Recomendado)
1. Obtener certificados Let's Encrypt:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d chitaga.tech -d www.chitaga.tech
```

2. Actualizar configuración nginx para usar SSL (ver `chitaga-tech-nginx.conf`)

### 3. Actualizaciones
```bash
# Actualizar sistema
sudo apt-get update && sudo apt-get upgrade -y

# Actualizar Node.js
sudo npm install -g npm@latest
sudo -u yamiddev npm update
```

## 📊 Monitoreo

### Logs
```bash
# Logs en tiempo real
tail -f /var/log/nginx/chitaga-tech-access.log
tail -f /tmp/chitaga-server.log

# Logs systemd
journalctl -u chitaga-tech -f
```

### Métricas
```bash
# Uso de memoria
free -h

# Uso de CPU
top -u yamiddev

# Espacio en disco
df -h
```

## 🚀 Despliegue Continuo

Para actualizar el sistema:

1. **Actualizar código:**
```bash
cd /home/yamiddev/chitaga-tech
git pull origin main
```

2. **Reconstruir frontend:**
```bash
sudo -u yamiddev npm run build
```

3. **Reiniciar servicios:**
```bash
sudo systemctl restart chitaga-tech
sudo systemctl restart nginx
```

## 📞 Soporte

- **Issues:** https://github.com/tu-usuario/chitaga-tech/issues
- **Email:** info@chitaga.tech
- **Documentación:** Ver archivos en `docs/`

---

**Estado del Sistema:** ✅ **Listo para Producción**

Última actualización: $(date)
Versión: 1.0.0