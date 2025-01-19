import './style.css'
import Experience from './Experience/Experience.js'

import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const experience = new Experience(document.querySelector('.experience-canvas'))