import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CrowdVisualization } from "../3D/CrowdVisualization";
import "./LandingPage.css";

gsap.registerPlugin(ScrollTrigger);

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    // GSAP Animations
    gsap.from(".feature-card", {
      scrollTrigger: {
        trigger: ".features-section",
        start: "top center",
        end: "bottom center",
        scrub: 1,
      },
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
    });
  }, []);

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="logo">Singulix</div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#benefits">Benefits</a>
          <a href="#about">About</a>
        </div>
        <div className="nav-buttons">
          <button onClick={() => navigate("/login")} className="nav-button">
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="nav-button signup"
          >
            Sign Up
          </button>
        </div>
      </nav>

      <main className="landing-main">
        <motion.section
          className="hero-section"
          ref={heroRef}
          style={{ y, opacity }}
        >
          <div className="hero-content">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Revolutionize Event Management
            </motion.h1>
            <motion.p
              className="subtitle"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Intelligent crowd control meets elegant design
            </motion.p>
            <motion.div
              className="cta-buttons"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button
                onClick={() => navigate("/signup")}
                className="cta-button primary"
              >
                Get Started
              </button>
              <button className="cta-button secondary">Watch the Demo</button>
            </motion.div>
          </div>
          <div className="hero-visualization">
            <CrowdVisualization />
          </div>
        </motion.section>

        <section className="features-section" ref={featuresRef}>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Powerful Features
          </motion.h2>
          <div className="features-grid">
            <motion.div
              className="feature-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="feature-icon">📊</div>
              <h3>Real-time Analytics</h3>
              <p>Monitor crowd density and movement patterns with precision</p>
            </motion.div>
            <motion.div
              className="feature-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="feature-icon">🎫</div>
              <h3>Smart Ticketing</h3>
              <p>Seamless digital ticket management and validation</p>
            </motion.div>
            <motion.div
              className="feature-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="feature-icon">🔐</div>
              <h3>Secure Access</h3>
              <p>Advanced security measures for controlled entry</p>
            </motion.div>
            <motion.div
              className="feature-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="feature-icon">📱</div>
              <h3>Mobile Integration</h3>
              <p>Manage events on-the-go with our intuitive mobile app</p>
            </motion.div>
          </div>
        </section>

        <section className="benefits-section">
          <div className="benefits-content">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Transform Your Events
            </motion.h2>
            <motion.ul
              className="benefits-list"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <li>✓ Reduce wait times with AI-powered queue management</li>
              <li>✓ Enhanced security with real-time monitoring</li>
              <li>✓ Optimize staff deployment with predictive analytics</li>
              <li>✓ Generate comprehensive insights and reports</li>
            </motion.ul>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Singulix</h4>
            <p>Making events smarter and safer</p>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>info@singulix.com</p>
            <p>+1 (555) 123-4567</p>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <p>Privacy Policy</p>
            <p>Terms of Service</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Singulix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
