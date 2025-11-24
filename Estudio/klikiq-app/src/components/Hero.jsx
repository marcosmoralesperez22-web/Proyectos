import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = ({ openModal }) => {
    const { scrollY } = useScroll();
    // Parallax for background - subtle movement
    const yBg = useTransform(scrollY, [0, 500], [0, 100]);
    const opacityBg = useTransform(scrollY, [0, 300], [1, 0.5]);

    // Text content fade out on scroll
    const yText = useTransform(scrollY, [0, 300], [0, 50]);
    const opacityText = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section className="hero-section" style={{ position: 'relative', minHeight: '100vh', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', paddingTop: '100px' }}>

            {/* Neon Background - Forced Full Width with Parallax */}
            <motion.div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                x: '-50%', // Centering with motion style
                y: yBg,
                opacity: opacityBg,
                width: '100vw',
                height: '100%',
                zIndex: -2
            }}>
                <img src="/neon-hero-bg.png" alt="Neon Background" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
            </motion.div>

            {/* Circular Glows - Adjusted to prevent overflow */}
            <div className="circle-shape" style={{ top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.5 }}></div>
            <div className="circle-shape" style={{ bottom: '10%', right: '0', transform: 'translateX(30%)', width: '400px', height: '400px', background: 'var(--accent)', filter: 'blur(100px)', opacity: 0.5 }}></div>

            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto' }}>

                {/* Text Content */}
                <motion.div
                    style={{ y: yText, opacity: opacityText }}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>
                        Infraestructuras <br /><span style={{ color: 'transparent', background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 10px rgba(99,102,241,0.5))' }}>Neon Future</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.8 }}>
                        La plataforma definitiva para startups que buscan velocidad, seguridad y estilo. Escala tu tecnología con el poder del futuro.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <motion.button
                            className="btn btn-primary"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(99, 102, 241, 0.6)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={openModal}
                        >
                            Apuntarme a la lista de espera
                        </motion.button>
                        <motion.a
                            href="#features"
                            className="btn btn-outline"
                            whileHover={{ scale: 1.05, borderColor: 'var(--accent)', boxShadow: '0 0 15px rgba(6,182,212,0.3)' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Explorar
                        </motion.a>
                    </div>
                </motion.div>

                {/* Product Image (Dashboard) - Floating Animation Only */}
                <motion.div
                    style={{ display: 'flex', justifyContent: 'center' }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                >
                    <motion.div
                        animate={{ y: [0, -15, 0] }} // Subtle floating
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            position: 'relative',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(99,102,241,0.2)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(10,10,18,0.8)',
                            backdropFilter: 'blur(10px)',
                            maxWidth: '500px',
                            width: '100%'
                        }}
                    >
                        <img src="/product-dashboard.png" alt="Klikiq Dashboard" style={{ width: '100%', height: 'auto', display: 'block' }} />

                        {/* Floating Elements Overlay */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            style={{ position: 'absolute', top: '20%', right: '-20px', background: 'rgba(6,182,212,0.9)', padding: '10px 20px', borderRadius: '10px', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}
                        >
                            <span style={{ fontWeight: 'bold', color: 'white' }}>99.9% Uptime</span>
                        </motion.div>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
};

export default Hero;
