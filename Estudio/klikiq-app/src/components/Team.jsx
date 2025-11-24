import React from 'react';
import { motion } from 'framer-motion';

const team = [
    { name: 'Marcos Morales', role: 'CEO & Founder', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { name: 'Elena Rodriguez', role: 'CTO', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { name: 'David Chen', role: 'Lead DevOps', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { name: 'Sarah Jones', role: 'Head of Security', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' }
];

const Team = () => {
    return (
        <section style={{ padding: '100px 0', background: 'rgba(255,255,255,0.02)' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>
                        Nuestro Equipo
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>Expertos apasionados por la infraestructura.</p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    {team.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -10 }}
                            transition={{ delay: index * 0.1 }}
                            style={{
                                background: 'var(--bg-card)',
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}
                        >
                            <div style={{ height: '300px', overflow: 'hidden' }}>
                                <motion.img
                                    src={member.img}
                                    alt={member.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>{member.name}</h3>
                                <p style={{ color: 'var(--primary)', fontWeight: 600 }}>{member.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
