import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VisitorTypeModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const type = localStorage.getItem('visitor-type');
        if (!type) {
            const timer = setTimeout(() => setIsOpen(true), 300);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleSelect = () => {
        localStorage.setItem('visitor-type', 'student');
        setIsOpen(false);
    };

    const handleLater = () => {
        localStorage.setItem('visitor-type', 'student');
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="visitor-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="visitor-modal-content"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="visitor-modal-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 16v-4"></path>
                                <path d="M12 8h.01"></path>
                            </svg>
                        </div>

                        <h2 className="visitor-modal-title">
                            Bienvenido a Chitagá Tech
                        </h2>

                        <p className="visitor-modal-subtitle">
                            ¡Nos alegra que quieras aprender y crecer en tecnología!
                        </p>

                        <div className="visitor-options-single">
                            <button
                                className="visitor-option-card"
                                onClick={handleSelect}
                            >
                                <div className="visitor-option-icon">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                                        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                                    </svg>
                                </div>
                                <span className="visitor-option-label">Soy estudiante</span>
                                <span className="visitor-option-desc">Quiero aprender y crecer en tecnología</span>
                            </button>
                        </div>

                        <button className="visitor-modal-later" onClick={handleLater}>
                            Continuar como visitante
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
