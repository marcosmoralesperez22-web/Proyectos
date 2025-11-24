import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const themes = [
    { id: 'default', name: 'Neon Cyber', color: '#6366f1' },
    { id: 'sunset', name: 'Sunset Vibes', color: '#f43f5e' },
    { id: 'matrix', name: 'Matrix', color: '#00ff41' },
    { id: 'party', name: 'Party Mode', color: '#ff00ff' }
];

const ThemeSwitcher = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentTheme, setCurrentTheme] = useState('default');

    useEffect(() => {
        document.body.className = '';
        if (currentTheme !== 'default') {
            document.body.classList.add(`theme-${currentTheme}`);
        }
    }, [currentTheme]);

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        style={{
                            position: 'absolute',
                            bottom: '70px',
                            right: '0',
                            background: 'rgba(10, 10, 18, 0.9)',
                            backdropFilter: 'blur(10px)',
                            padding: '1rem',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            minWidth: '160px'
                        }}
                    >
                        {themes.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => {
                                    setCurrentTheme(theme.id);
                                    setIsOpen(false);
                                }}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    textAlign: 'left',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                            >
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: theme.color, boxShadow: `0 0 10px ${theme.color}` }}></div>
                                {theme.name}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--gradient-main)',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px var(--primary-glow)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <i className="fas fa-palette"></i>
            </motion.button>
        </div>
    );
};

export default ThemeSwitcher;
