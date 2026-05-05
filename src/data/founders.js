/**
 * Datos de los miembros fundadores de Chitagá Tech
 */
export const founders = [
    {
        name: "Yamid Horacio Rodriguez",
        role: "Fundador",
        description: "Tecnólogo en software del SENA. Fundador de Chitagá Tech.",
        image: "/images/founders/yamiddev.png",
        skills: ["Comunicación", "Liderazgo", "Enseñanza"],
        linkedin: "https://linkedin.com/in/yamiddev",
        github: "https://github.com/yamiddevofic"
    },
    {
        name: "Anderson García",
        role: "Líder de Alcance",
        description: "Tecnólogo en redes del ISER. Líder de alcance comunitario.",
        image: "/images/founders/anderson-2.jpg",
        skills: ["Redes", "Telecomunicaciones", "Networking"],
        linkedin: "#miembros-fundadores",
        github: "#miembros-fundadores"
    },
    {
        name: "Pablo Rojas",
        role: "Director de Operaciones",
        description: "Técnico en sistemas. Experto en mantenimiento y domótica.",
        skills: ["Mantenimiento", "Domótica", "Automatización"],
        image: "/images/founders/pablo-2.jpg",
        linkedin: "#miembros-fundadores",
        github: "#miembros-fundadores"
    },
    {
        name: "Leider Solano",
        role: "Líder Técnico",
        description: "Ingeniero de sistemas. Líder técnico y mentor de programación.",
        skills: ["Programación", "Enseñanza", "Mentoría"],
        image: "/images/founders/leider-solano.jpg",
        linkedin: "#miembros-fundadores",
        github: "#miembros-fundadores"
    },
    {
        name: "Mariana Rojas",
        role: "Líder de Estrategia",
        description: "Ingeniera de sistemas. Líder de estrategia y gestión de proyectos.",
        skills: ["Sistemas", "Estrategia", "Gestión de Proyectos"],
        image: "/images/founders/marita-2.jpg",
        linkedin: "#miembros-fundadores",
        github: "#miembros-fundadores"
    },
    {
        name: "Yulieth Vera",
        role: "Líder de Comunidad",
        description: "Ingeniera de sistemas. Líder de comunidad y soporte.",
        skills: ["Comunicación", "Gestión", "Soporte"],
        image: "/images/founders/yuli.jpg",
        linkedin: "#miembros-fundadores",
        github: "#miembros-fundadores"
    },
    {
        name: "David Suárez",
        role: "Director Creativo",
        description: "Estudiante de Chitagá Tech. Director creativo y diseñador.",
        skills: ["Curiosidad", "Inteligencia", "Creatividad"],
        image: "/images/founders/david.PNG",
        linkedin: "#miembros-fundadores",
        github: "#miembros-fundadores"
    }
];

/**
 * Obtiene todos los miembros fundadores
 * @returns {object[]}
 */
export function getFounders() {
    return founders;
}