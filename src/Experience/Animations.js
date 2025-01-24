import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

import Experience from './Experience'

export default class Animations {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes

        this.magnifyingGlass = document.querySelector('.magnifying-glass')
        this.whiteFiller = this.magnifyingGlass.querySelector('.white-filler')
        this.textWrapper = document.querySelector('.text-wrapper')
        this.introSection = document.querySelector('.intro-section')
        this.particleGroup = document.querySelector('.particle-group')
        this.percentageSection = document.querySelector(
            '.impact-section.percentage'
        )
        this.percentageHeader = this.percentageSection.querySelector('h2 span')
        this.iconGrid = document.querySelector('.icon-grid')
        this.medalElement = document.querySelector('.one-in-five img')
        this.categories = document.querySelectorAll('.category-container')
        this.progressCircles = document.querySelectorAll('.progress-circle')

        this.parralaxEffect()
        this.magnifyEffect()
        this.countPercentage()
        this.instanceIconGrid()
        this.oneInFiveAnimation()

        // Wait for resources to be loaded
        this.experience.resources.on('ready', () => {
            this.setPath()
            this.particleObserver()
        })
    }

    parralaxEffect() {
        this.foregroundParticles = document.querySelectorAll(
            '.hero-wrapper .foreground'
        )
        this.backgroundParticles = document.querySelectorAll(
            '.hero-wrapper .background'
        )

        gsap.to(this.foregroundParticles, {
            y: -125,
            ease: 'power1.inOut',
            scrollTrigger: {
                trigger: '.hero-wrapper',
                start: 'bottom bottom',
                end: '50% top',
                scrub: 0.8,
            },
        })

        gsap.to(this.backgroundParticles, {
            y: -75,
            ease: 'power1.inOut',
            scrollTrigger: {
                trigger: '.hero-wrapper',
                start: 'top bottom',
                end: '50% top',
                scrub: 0.8,
            },
        })
    }

    magnifyEffect() {
        this.timeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.sticky-wrapper',
                start: 'top 100%',
                end: '80% bottom',
                scrub: true,
                onUpdate: (self) => {
                    if (self.progress === 1) {
                        this.introSection.style.backgroundColor =
                            'var(--color-beige)'
                        this.magnifyingGlass.style.display = 'none'
                    } else {
                        this.introSection.style.backgroundColor = ''
                        this.magnifyingGlass.style.display = 'block'
                    }
                },
            },
        })

        this.timeline
            .to(this.magnifyingGlass, {
                keyframes: [
                    {
                        transform:
                            'translate3d(150%, 10%, 0) scale(1) rotate(300deg)',
                        duration: 0,
                    },
                    {
                        transform:
                            'translate3d(-115%, 10%, 0) scale(1) rotate(330deg)',
                        duration: 0.4,
                    },
                    {
                        transform:
                            'translate3d(-35%, 170%, 0) scale(7.5) rotate(340deg)',
                        duration: 0.6,
                    },
                ],
                ease: 'power1.inOut',
            })

            .to(
                this.whiteFiller,
                {
                    keyframes: [
                        { opacity: 0, duration: 0 },
                        { opacity: 0, duration: 0.3 },
                        { opacity: 1, duration: 0.7 },
                    ],
                    ease: 'linear',
                },
                '<' // start at the same time as the previous animation
            )

            .to(
                this.textWrapper,
                {
                    keyframes: [
                        { opacity: 0, scale: 0.5, duration: 0.6 },
                        { opacity: 0, scale: 0.5, duration: 0.1 },
                        { opacity: 1, scale: 1, duration: 0.3 },
                    ],
                    ease: 'linear',
                },
                '<'
            )

            .to(
                this.particleGroup,
                {
                    keyframes: [
                        { opacity: 0, scale: 0.5, duration: 0.6 },
                        { opacity: 0, scale: 0.5, duration: 0.2 },
                        { opacity: 1, scale: 1, duration: 0.2 },
                    ],
                },
                '<'
            )
    }

    countPercentage() {
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
                threshold: 0.5,
            }
        )

        observer.observe(this.percentageSection)
    }

    instanceIconGrid() {
        const gridContainer = document.querySelector('.icon-grid')
        const rows = 6
        const columns = 20
        const highlightIndices = [
            1, 4, 10, 15, 23, 27, 32, 38, 40, 43, 50, 53, 60, 65, 71, 79, 87,
            95, 102, 105, 109, 110, 113, 119,
        ]

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
            use.setAttribute('href', '#person')
            svg.appendChild(use)

            if (highlightIndices.includes(i)) {
                svg.classList.add('target')
            }

            gridContainer.appendChild(svg)
        }
    }

    oneInFiveAnimation() {
        const targetIcons = this.iconGrid.querySelectorAll('.icon.target')

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        observer.unobserve(entry.target)

                        const iconsArray = Array.from(targetIcons)
                        this.shuffleArray(iconsArray)

                        const delay = 1500 / iconsArray.length

                        iconsArray.forEach((icon, index) => {
                            setTimeout(() => {
                                icon.classList.add('active')
                            }, index * delay)
                        })

                        // Medal animation
                        setTimeout(() => {
                            this.medalElement.classList.add('active')
                        }, 1250)
                    }
                })
            },
            {
                threshold: 1,
            }
        )

        observer.observe(this.iconGrid)
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
        }
    }

    particleObserver() {
        this.particulateMatter = this.experience.world.particulateMatter
        this.introduciontText = document.querySelector('.introduction-text')

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Convert categories to an array and find the index
                        const categoriesArray = Array.from(this.categories)
                        const index = categoriesArray.indexOf(entry.target)

                        const categoryClass = Array.from(
                            entry.target.classList
                        ).find(
                            (className) => className !== 'category-container'
                        )

                        if (categoryClass === 'totaal') {
                            console.log('show all categories')
                            this.particulateMatter.showAllCategories()
                        } else if (categoryClass === 'introduction') {
                            this.particulateMatter.hideAllCategories()
                        } else {
                            this.particulateMatter.updateCategoryState(
                                categoryClass
                            )
                        }

                        this.progressIndicator(index - 1)
                    }
                })
            },
            {
                threshold: 0.75,
            }
        )

        this.categories.forEach((category) => observer.observe(category))
    }

    progressIndicator(index) {
        const progressCircles = this.progressCircles

        progressCircles.forEach((circle, i) => {
            if (i === index) {
                circle.classList.add('active')
            } else {
                circle.classList.remove('active')
            }
        })
    }

    setPath() {
        // Animate room movement
        this.roomGroup = this.experience.world.room.roomGroup
        this.timeline = gsap.timeline().to(this.roomGroup.position, {
            x: () => {
                return this.sizes.width * 0.0011
            },
            scrollTrigger: {
                trigger: '.white-space',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.6,
                invalidateOnRefresh: true,
            },
        })
    }
}
