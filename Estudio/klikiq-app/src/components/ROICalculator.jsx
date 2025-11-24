import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ROICalculator = () => {
    const [cloudSpend, setCloudSpend] = useState(5000);
    const [efficiency, setEfficiency] = useState(30);

    const annualSavings = (cloudSpend * 12 * (efficiency / 100)).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    return (
        <section style={{ padding: '100px 0', background: 'var(--bg-card)' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'white' }}>
                            Calcula tu <span className="neon-text" style={{ color: 'var(--accent)' }}>ROI</span>
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            Descubre cuánto podrías ahorrar optimizando tu infraestructura con Klikiq.
                        </p>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '1rem', color: 'white' }}>Gasto Mensual en Nube: <strong>${cloudSpend}</strong></label>
                            <input
                                type="range" min="500" max="50000" step="500"
                                value={cloudSpend} onChange={(e) => setCloudSpend(Number(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--primary)' }}
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '1rem', color: 'white' }}>Eficiencia Estimada: <strong>{efficiency}%</strong></label>
                            <input
                                type="range" min="10" max="60" step="5"
                                value={efficiency} onChange={(e) => setEfficiency(Number(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--accent)' }}
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        style={{
                            background: 'var(--bg-dark)',
                            padding: '3rem',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--primary)',
                            boxShadow: '0 0 30px rgba(99, 102, 241, 0.2)',
                            textAlign: 'center'
                        }}
                    >
                        <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Ahorro Anual Estimado</h3>
                        <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'white', marginBottom: '1rem', textShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}>
                            {annualSavings}
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            *Basado en optimizaciones promedio de nuestros clientes.
                        </p>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default ROICalculator;
