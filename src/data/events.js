/**
 * Configuración de eventos y talleres.
 *
 * Para agregar un nuevo evento:
 * 1. Agrega un objeto al array `events`
 * 2. Cada campo en `fields` genera un input en el formulario
 * 3. El `slug` se usa en la URL: /evento/{slug}
 *
 * Tipos de campo soportados:
 *   text, email, tel, number, select, textarea
 * 
 * @typedef {import('../types/events').Event} Event
 * @typedef {import('../types/events').EventField} EventField
 */

/** @type {Event[]} */
export const events = [
    {
        slug: "crea-tu-primera-web",
        title: "Construye tu primera página web y muestra Chitagá al mundo.",
        description: "Primera página web con HTML y CSS usando una foto de Chitagá.",
        date: "2026-03-20",
        time: "Grupo 1: 2:00 PM — 3:00 PM · Grupo 2: 9:00 PM — 10:00 PM",
        location: "Google Meet (el link se envía al inscribirte)",
        capacity: 30,
        status: "finished",
        badge: "Primer Taller",
        image: "/taller-web.jpg",
        fields: [
            { name: "name", label: "Nombre completo", type: "text", required: true, min: 3, placeholder: "Tu nombre completo" },
            { name: "email", label: "Correo electrónico", type: "email", required: true, placeholder: "tu@correo.com" },
            { name: "phone", label: "WhatsApp", type: "tel", required: true, placeholder: "300 123 4567" },
            { name: "group", label: "Horario", type: "select", required: true, options: [
                { value: "", label: "Escoge tu horario" },
                { value: "grupo-1", label: "Grupo 1 — 2:00 PM a 3:00 PM" },
                { value: "grupo-2", label: "Grupo 2 — 9:00 PM a 10:00 PM" },
            ]},
            { name: "place", label: "Lugar turístico de Chitagá que elegiste", type: "text", required: true, min: 3, placeholder: "Ej: Cascada de La Vieja, Páramo de Santurbán..." },
            { name: "has_photo", label: "¿Ya tienes la foto digital del lugar?", type: "select", required: true, options: [
                { value: "", label: "Selecciona una opción" },
                { value: "si", label: "Sí, ya la tengo lista" },
                { value: "no", label: "No, pero la tendré antes del viernes" },
            ]},
        ],
    },
    {
        slug: "chitaga-programa-con-ia",
        title: "Chitagá programa con IA su primera página web.",
        description: "Primera página web con ayuda de IA que te guía mientras programas.",
        date: "2026-03-27",
        time: "8:30 PM",
        location: "Google Meet (el link se envía al inscribirte)",
        capacity: 30,
        status: "finished",
        badge: "Segundo Taller",
        image: "/taller-web.jpg",
        fields: [
            { name: "name", label: "Nombre completo", type: "text", required: true, min: 3, placeholder: "Tu nombre completo" },
            { name: "email", label: "Correo electrónico", type: "email", required: true, placeholder: "tu@correo.com" },
            { name: "phone", label: "WhatsApp", type: "tel", required: true, placeholder: "300 123 4567" },
        ],
    },
    {
        slug: "introduccion-programacion",
        title: "Introducción a la Programación",
        description: "Aprende programación desde cero. Este fin de semana hacemos historia en Chitagá.",
        date: "2026-04-11",
        time: "3:00 PM",
        location: "Google Meet (el link se envía al inscribirte)",
        capacity: 40,
        status: "open",
        badge: "Nuevo Taller",
        image: "/taller-web.jpg",
        publishedDate: "2026-04-08",
        fields: [
            { name: "email", label: "Correo electrónico", type: "email", required: true, placeholder: "tu@correo.com" },
        ],
    },
    
];

/**
 * Busca un evento por su slug.
 * @param {string} slug
 * @returns {Event|undefined}
 */
export function getEventBySlug(slug) {
    return events.find(e => e.slug === slug);
}

/**
 * Devuelve los eventos con status "open".
 * @returns {Event[]}
 */
export function getOpenEvents() {
    return events.filter(e => e.status === "open");
}

/**
 * Devuelve los eventos con status "finished".
 * @returns {Event[]}
 */
export function getFinishedEvents() {
    return events.filter(e => e.status === "finished");
}

/**
 * Devuelve todos los eventos ordenados por fecha (más recientes primero).
 * @returns {Event[]}
 */
export function getAllEvents() {
    return [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
}
