import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// import Experience from './Experience'

export default class Animations {
    constructor() {
        this.magnifyingGlass = document.querySelector('.magnifying-glass')
        this.whiteFiller = this.magnifyingGlass.querySelector('.white-filler')
        this.textWrapper = document.querySelector('.text-wrapper')
        this.introSection = document.querySelector('.intro-section')
        this.percentageSection = document.querySelector(
            '.impact-section.percentage'
        )
        this.percentageHeader = this.percentageSection.querySelector('h2 span')
        this.iconGrid = document.querySelector('.icon-grid')

        this.createTimeline()
        this.countPercentage()
        this.instanceIconGrid()
        this.gridAnimation()
    }

    createTimeline() {
        this.timeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.sticky-wrapper',
                start: 'top top', // Start animation when .sticky-wrapper hits the top
                end: '80% bottom', // End animation when .sticky-wrapper leaves the viewport
                scrub: true, // Tie animation progress to scroll
                // pin: '.intro-section', // Pin the intro-section during the animation
                // markers: true, // Debug markers
                onUpdate: (self) => {
                    // Dynamically toggle display based on progress
                    if (self.progress === 1) {
                        this.introSection.style.backgroundColor =
                            'var(--color-beige)'
                        this.magnifyingGlass.style.display = 'none' // Hide at the end
                    } else {
                        this.introSection.style.backgroundColor = ''
                        this.magnifyingGlass.style.display = 'block' // Show at any other scroll position
                    }
                },
            },
        })

        // Magnifying glass animation
        this.timeline
            .to(this.magnifyingGlass, {
                keyframes: [
                    {
                        transform:
                            'translate3d(150%, 10%, 0) scale(1) rotate(300deg)', // Start
                        duration: 0,
                    },
                    {
                        transform:
                            'translate3d(-115%, 10%, 0) scale(1) rotate(330deg)', // 50%
                        duration: 0.4, // Adjust for mid-point
                    },
                    {
                        transform:
                            'translate3d(-35%, 170%, 0) scale(7.5) rotate(340deg)', // 100%
                        duration: 0.6, // Adjust for end-point
                    },
                ],
                ease: 'power1.inOut',
            })

            // Filler opacity animation
            .to(
                this.whiteFiller,
                {
                    keyframes: [
                        { opacity: 0, duration: 0 }, // 0-50%
                        { opacity: 0, duration: 0.3 }, // Hold
                        { opacity: 1, duration: 0.7 }, // Fade in
                    ],
                    ease: 'linear',
                },
                '<' // Start at the same time as the magnifying glass animation
            )

            // Text wrapper opacity and scale animation
            .to(
                this.textWrapper,
                {
                    keyframes: [
                        { opacity: 0, scale: 0.5, duration: 0.6 }, // 0-60%
                        { opacity: 0, scale: 0.5, duration: 0.1 }, // Hold
                        { opacity: 1, scale: 1, duration: 0.3 }, // Fade in and scale up
                    ],
                    ease: 'linear',
                },
                '<' // Start at the same time as the other animations
            )
    }

    countPercentage() {
        // set observer
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const targerPercentage = 100
                        const increment = 5
                        const duration = 2000
                        const stepTime =
                            duration / (targerPercentage / increment)
                        let currentNumber = 0

                        setTimeout(() => {
                            const interval = setInterval(() => {
                                currentNumber += increment
                                this.percentageHeader.textContent = `${currentNumber}`

                                if (currentNumber >= targerPercentage) {
                                    clearInterval(interval)
                                }
                            }, stepTime)
                        }, 500)

                        observer.unobserve(entry.target)
                    }
                })
            },
            {
                threshold: 0.5, // Trigger when 50% of the element is visible
            }
        )

        // Observe the percentageHeader element
        observer.observe(this.percentageSection)
    }

    instanceIconGrid() {
        const gridContainer = document.querySelector('.icon-grid')
        const rows = 6
        const columns = 18
        const highlightIndices = [
            0, 3, 9, 10, 13, 25, 35, 36, 41, 46, 51, 54, 57, 63, 64, 67, 79, 89,
            90, 95, 100, 105,
        ] // Highlight these icons

        // Create 18 icons using the symbol reference
        for (let i = 0; i < rows * columns; i++) {
            const svg = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'svg'
            )
            svg.setAttribute('class', 'icon')

            const use = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'use'
            )
            use.setAttribute('href', '#person') // Use the symbol ID directly

            svg.appendChild(use)

            // Check if the index i is in the list of highlight indices
            if (highlightIndices.includes(i)) {
                svg.classList.add('target')
            }

            gridContainer.appendChild(svg)
        }
    }

    gridAnimation() {
        const targetIcons = this.iconGrid.querySelectorAll('.icon.target')

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        observer.unobserve(entry.target)

                        // Randomly shuffle targetIcons array
                        const iconsArray = Array.from(targetIcons)
                        this.shuffleArray(iconsArray)

                        const delay = 1500 / iconsArray.length

                        // Add the '.active' class to each icon with a delay
                        iconsArray.forEach((icon, index) => {
                            setTimeout(() => {
                                icon.classList.add('active')
                            }, index * delay) // Delay each by 200ms for staggered effect
                        })
                    }
                })
            },
            {
                threshold: 1, // Trigger when 50% of the element is visible
            }
        )

        // Observe the iconGrid element
        observer.observe(this.iconGrid)
    }
    // Helper function to shuffle the array
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]] // Swap elements
        }
    }
}
