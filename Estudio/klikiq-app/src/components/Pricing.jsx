import React from 'react';
import { motion } from 'framer-motion';

const plans = [
    {
        name: 'Startup',
        price: '$499',
        period: '/mes',
        features: ['Infraestructura Básica', 'Monitoreo 9/5', 'Soporte por Email', '1 Servidor Dedicado'],
        recommended: false
    },
    {
        name: 'Scale',
        price: '$1,299',
        period: '/mes',
        features: ['Cloud Híbrido', 'Monitoreo 24/7', 'Soporte Prioritario', 'Escalado Automático', 'Auditoría de Seguridad'],
        recommended: true
    },
    {
        name: 'Enterprise',
        price: 'Personalizado',
        period: '',
        features: ['Arquitectura Multi-Cloud', 'DevOps Dedicado', 'SLA 99.99%', 'Compliance (SOC2, HIPAA)', 'Disaster Recovery'],
        recommended: false
    }
];

const Pricing = ({ openModal }) => {
    return (
        <section id="pricing" style={{ padding: '100px 0' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>
                        Planes Flexibles
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>Escala tu infraestructura a medida que creces.</p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                            style={{
                                background: plan.recommended ? 'linear-gradient(145deg, rgba(79, 70, 229, 0.1), rgba(6, 182, 212, 0.1))' : 'var(--bg-card)',
                                padding: '3rem 2rem',
                                borderRadius: 'var(--radius-lg)',
                                border: plan.recommended ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
                                position: 'relative',
                                transform: plan.recommended ? 'scale(1.05)' : 'scale(1)'
                            }}
                        >
                            {plan.recommended && (
                                <div style={{
                                    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                                    background: 'var(--gradient-main)', padding: '4px 12px', borderRadius: '20px',
                                    fontSize: '0.8rem', fontWeight: 'bold', color: 'white'
                                }}>
                                    Más Popular
                                </div>
                            )}

                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>{plan.name}</h3>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '2rem' }}>
                                {plan.price}<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>{plan.period}</span>
                            </div>

                            <ul style={{ marginBottom: '2.5rem', textAlign: 'left' }}>
                                {plan.features.map((feature, i) => (
                                    <li key={i} style={{ marginBottom: '1rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <i className="fas fa-check" style={{ color: 'var(--accent)' }}></i> {feature}
                                    </li>
                                ))}
                            </ul>

                            <motion.button
                                className={`btn ${plan.recommended ? 'btn-primary' : 'btn-outline'}`}
                                style={{ width: '100%' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={openModal}
                            >
                                Elegir Plan
                            </motion.button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
