import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitToGoogleSheet } from '../services/submitToSheet';

const questions = [
    {
        id: 'role',
        text: '1. ¿Cuál es tu rol en el proyecto?',
        options: ['Fundador / CEO', 'CTO / Líder Técnico', 'Desarrollador', 'Otro']
    },
    {
        id: 'stage',
        text: '2. ¿En qué etapa está tu proyecto?',
        options: ['Solo Idea', 'MVP (Producto Mínimo)', 'Product-Market Fit', 'Escalando (Growth)']
    },
    {
        id: 'infrastructure',
        text: '3. ¿Dónde alojas tu infraestructura hoy?',
        options: ['Vercel / Netlify', 'AWS / Google Cloud / Azure', 'VPS (DigitalOcean, Hetzner)', 'Aún no tengo nada']
    },
    {
        id: 'pain_point',
        text: '4. ¿Cuál es tu mayor dolor de cabeza actual?',
        options: ['Costos impredecibles', 'Lentitud / Rendimiento', 'Complejidad de gestión', 'Seguridad y Compliance']
    },
    {
        id: 'team_size',
        text: '5. ¿Tamaño de tu equipo técnico?',
        options: ['Solo yo', '2-5 personas', '5-10 personas', '+10 personas']
    },
    {
        id: 'traffic',
        text: '6. ¿Tráfico mensual aproximado?',
        options: ['< 1k visitas', '1k - 10k visitas', '10k - 100k visitas', '+100k visitas']
    },
    {
        id: 'budget',
        text: '7. ¿Presupuesto mensual para infraestructura?',
        options: ['< €50 (Bootstrapping)', '€50 - €200 (Startup)', '€200 - €1000 (Growth)', '> €1000 (Scale)']
    },
    {
        id: 'timeline',
        text: '8. ¿Cuándo te gustaría migrar/empezar?',
        options: ['¡Ayer! (Urgente)', 'Este mes', 'En 3 meses', 'Solo estoy mirando']
    },
    {
        id: 'commitment',
        text: '9. Si te damos acceso a la Beta, ¿migrarías?',
        options: ['Sí, de inmediato', 'Sí, si es fácil', 'Quizás, necesito probar', 'No estoy seguro']
    },
    {
        id: 'source',
        text: '10. ¿Cómo nos conociste?',
        options: ['LinkedIn', 'Twitter / X', 'Recomendación', 'Búsqueda']
    }
];

const QuestionnaireModal = ({ onClose }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [contactInfo, setContactInfo] = useState({ name: '', email: '', company: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOptionSelect = (option) => {
        setAnswers({ ...answers, [questions[step].id]: option });
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            setStep('contact');
        }
    };

    const handleContactChange = (e) => {
        setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const finalData = {
            ...contactInfo,
            ...answers
        };

        // 1. Send to Google Sheet
        await submitToGoogleSheet(finalData);

        // 2. Open Mailto as fallback/confirmation
        const subject = `Lista de Espera Klikiq: ${contactInfo.company}`;
        const body = `Nombre: ${contactInfo.name}%0D%0AEmail: ${contactInfo.email}%0D%0AEmpresa: ${contactInfo.company}%0D%0A%0D%0ARespuestas:%0D%0A${Object.entries(answers).map(([k, v]) => `${k}: ${v}`).join('%0D%0A')}`;
        window.location.href = `mailto:contacto@klikiq.com?subject=${subject}&body=${body}`;

        setIsSubmitting(false);
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                style={{
                    background: 'var(--bg-dark)', border: '1px solid var(--primary)',
                    padding: '2rem', borderRadius: 'var(--radius-lg)',
                    maxWidth: '500px', width: '90%', position: 'relative',
                    boxShadow: '0 0 50px rgba(99, 102, 241, 0.3)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>

                {step !== 'contact' ? (
                    <>
                        <div style={{ marginBottom: '2rem' }}>
                            <span style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 'bold' }}>PASO {step + 1} DE {questions.length}</span>
                            <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem', color: 'white' }}>{questions[step].text}</h3>
                        </div>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {questions[step].options.map((option, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(99, 102, 241, 0.2)', borderColor: 'var(--accent)' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleOptionSelect(option)}
                                    style={{
                                        padding: '1rem', background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)',
                                        color: 'white', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    {option}
                                </motion.button>
                            ))}
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'white' }}>Lista de Espera Exclusiva</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Estamos seleccionando proyectos para nuestra Beta Privada. Asegura tu plaza.</p>

                        <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                            <input required type="text" name="name" placeholder="Tu Nombre" value={contactInfo.name} onChange={handleContactChange} style={inputStyle} />
                            <input required type="email" name="email" placeholder="Tu Email" value={contactInfo.email} onChange={handleContactChange} style={inputStyle} />
                            <input required type="text" name="company" placeholder="Nombre de la Empresa" value={contactInfo.company} onChange={handleContactChange} style={inputStyle} />
                        </div>

                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            {isSubmitting ? 'Procesando...' : 'Apuntarme a la lista de espera'}
                        </motion.button>
                    </form>
                )}
            </motion.div>
        </motion.div>
    );
};

const inputStyle = {
    width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    color: 'white', fontSize: '1rem', outline: 'none'
};

export default QuestionnaireModal;
