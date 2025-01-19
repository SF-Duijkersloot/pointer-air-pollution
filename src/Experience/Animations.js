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

        this.createTimeline()
        this.countPercentage()
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

    // setIntersectionObserver() {
    //     console.log('Setting IntersectionObserver for percentage header')
    //     const observer = new IntersectionObserver((entries) => {
    //         entries.forEach((entry) => {
    //             console.log(entry)
    //             if (entry.isIntersecting) {

    //                 console.log('Percentage header is visible')
    //                 this.countPercentage()
    //                 observer.unobserve(entry.target) // Stop observing once triggered
    //             }
    //         })
    //     }, {
    //         threshold: 0.5, // Trigger when 50% of the element is visible
    //         // rootMargin: '0px 0px -50% 0px',
    //     })

    //     // Observe the percentageHeader element
    //     observer.observe(this.percentageSection)
    // }

    countPercentage() {
        // set observer
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        console.log('Percentage header is visible')
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
                // rootMargin: '0px 0px -50% 0px',
            }
        )

        // Observe the percentageHeader element
        observer.observe(this.percentageSection)
    }
}
