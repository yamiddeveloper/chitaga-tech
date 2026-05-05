import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PromoModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleShow = () => {
            setIsOpen(true);
        };
        window.addEventListener('show-promo-modal', handleShow);

        const type = localStorage.getItem('visitor-type');
        if (type === 'business') {
            const seen = localStorage.getItem('promo-modal-seen');
            if (!seen) {
                const timer = setTimeout(() => setIsOpen(true), 800);
                return () => {
                    clearTimeout(timer);
                    window.removeEventListener('show-promo-modal', handleShow);
                };
            }
        }

        return () => window.removeEventListener('show-promo-modal', handleShow);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('promo-modal-seen', 'true');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="promo-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={handleClose}
                >
                    <motion.div
                        className="promo-modal-content"
                        initial={{ scale: 0.92, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.92, opacity: 0, y: 30 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="promo-modal-close" onClick={handleClose} aria-label="Cerrar">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <div className="promo-modal-body">
                            <div className="promo-modal-visual">
                                <div className="promo-visual-bg">
                                    <svg className="promo-visual-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                        <line x1="8" y1="21" x2="16" y2="21"></line>
                                        <line x1="12" y1="17" x2="12" y2="21"></line>
                                    </svg>
                                    <div className="promo-visual-dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>

                            <div className="promo-modal-info">
                                <div className="promo-badge">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                    Talento chitagüense
                                </div>

                                <h2 className="promo-modal-title">
                                    Tu negocio merece estar en internet
                                </h2>

                                <p className="promo-modal-subtitle">
                                    Creamos tu página web con diseño profesional y precios pensados para nuestra comunidad.
                                </p>

                                <div className="promo-modal-features">
                                    <div className="promo-feature">
                                        <div className="promo-feature-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <span>Diseño profesional</span>
                                    </div>
                                    <div className="promo-feature">
                                        <div className="promo-feature-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <span>Soporte continuo</span>
                                    </div>
                                    <div className="promo-feature">
                                        <div className="promo-feature-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <span>Desde $150.000 COP</span>
                                    </div>
                                </div>

                                <div className="promo-modal-actions">
                                    <a href="#planes" className="promo-modal-cta" onClick={handleClose}>
                                        Ver planes
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </a>
                                    <button className="promo-modal-secondary" onClick={handleClose}>
                                        Después
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
