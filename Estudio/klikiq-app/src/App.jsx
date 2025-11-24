import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Components
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Team from './components/Team';
import ROICalculator from './components/ROICalculator';
import QuestionnaireModal from './components/QuestionnaireModal';
import ParticleBackground from './components/ParticleBackground';
import ThemeSwitcher from './components/ThemeSwitcher';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="app-container">
      <ParticleBackground />
      <ThemeSwitcher />

      <header className="header">
        <div className="container nav-container">
          <a href="#" className="logo">Klikiq<span>.</span></a>
          <nav className="nav-links">
            <a href="#features">Soluciones</a>
            <a href="#pricing">Precios</a>
            <a href="#calculator">Calculadora</a>
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openModal}
            >
              Empezar
            </motion.button>
          </nav>
        </div>
      </header>

      <main>
        <Hero openModal={openModal} />
        <Features />
        <ROICalculator />
        <Pricing openModal={openModal} />
        <Team />
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="#" className="logo">Klikiq<span>.</span></a>
            <p>Infraestructuras personalizadas para el futuro de la tecnología.</p>
          </div>
          <div className="footer-col">
            <h4>Servicios</h4>
            <ul>
              <li><a href="#">Cloud Híbrido</a></li>
              <li><a href="#">Seguridad</a></li>
              <li><a href="#">DevOps</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Compañía</h4>
            <ul>
              <li><a href="#">Sobre Nosotros</a></li>
              <li><a href="#">Carreras</a></li>
              <li><a href="#">Contacto</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Klikiq. Todos los derechos reservados.</p>
        </div>
      </footer>

      <AnimatePresence>
        {isModalOpen && <QuestionnaireModal onClose={closeModal} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
