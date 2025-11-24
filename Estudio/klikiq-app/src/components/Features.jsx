import React from 'react';
import { motion } from 'framer-motion';

const features = [
    { title: 'Cloud Híbrido', icon: 'fa-cloud', desc: 'Lo mejor de ambos mundos. Flexibilidad y seguridad.', img: '/feature-cloud.png' },
    { title: 'Ciberseguridad', icon: 'fa-shield-alt', desc: 'Protección de grado militar para tus datos.', img: '/feature-security.png' },
    { title: 'DevOps', icon: 'fa-rocket', desc: 'Pipelines de CI/CD optimizados.', img: '/feature-devops.png' },
    { title: 'Servidores Dedicados', icon: 'fa-server', desc: 'Hardware de alto rendimiento.', img: '/hero-bg.png' }, // Reusing bg for now or placeholder
    { title: 'Monitoreo 24/7', icon: 'fa-chart-line', desc: 'Dashboards y alertas en tiempo real.', img: '/feature-cloud.png' },
    { title: 'Escalado Auto', icon: 'fa-code-branch', desc: 'Crece automáticamente con tu tráfico.', img: '/feature-security.png' }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const Features = () => {
    return (
        <section id="features" style={{ padding: '100px 0' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Nuestras Soluciones
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>Tecnología de vanguardia adaptada a tus necesidades.</p>
                </motion.div>

                <motion.div
                    className="features-grid"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            className="feature-card"
                            whileHover={{ y: -10 }}
                            style={{
                                background: 'var(--bg-card)',
                                padding: '2.5rem',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'pointer'
                            }}
                        >
                            {/* Background Image on Hover */}
                            <motion.div
                                initial={{ opacity: 0, scale: 1 }}
                                whileHover={{ opacity: 0.2, scale: 1.1 }}
                                transition={{ duration: 0.4 }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: `url(${feature.img})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    zIndex: 0
                                }}
                            />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    width: '50px', height: '50px',
                                    background: 'rgba(79, 70, 229, 0.1)',
                                    borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--primary)', fontSize: '1.5rem', marginBottom: '1.5rem'
                                }}>
                                    <i className={`fas ${feature.icon}`}></i>
                                </div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{feature.title}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
