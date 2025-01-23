import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)

import Experience from '../Experience.js'

export default class Controls {
    constructor() {
        this.experience = new Experience()

        this.setSmoothScroll()
    }

    setSmoothScroll() {
        // Source: https://github.com/darkroomengineering/lenis

        // Initialize a new Lenis instance for smooth scrolling
        const lenis = new Lenis({
            lerp: 0.1,
            smooth: true,
    })

        // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
        lenis.on('scroll', ScrollTrigger.update)

        // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
        // This ensures Lenis's smooth scroll animation updates on each GSAP tick
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000) // Convert time from seconds to milliseconds
        })

        // Disable lag smoothing in GSAP to prevent any delay in scroll animations
        gsap.ticker.lagSmoothing(0)
    }

    resize() {}

    update() {}
}
