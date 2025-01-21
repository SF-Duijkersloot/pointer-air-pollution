import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Experience from './Experience'

export default class Animations {
    constructor() {
        gsap.registerPlugin(ScrollTrigger)

        this.experience = new Experience()

        // Store DOM elements
        this.magnifyingGlass = document.querySelector('.magnifying-glass')
        this.whiteFiller = this.magnifyingGlass.querySelector('.white-filler')
        this.textWrapper = document.querySelector('.text-wrapper')
        this.introSection = document.querySelector('.intro-section')
        this.percentageSection = document.querySelector(
            '.impact-section.percentage'
        )
        this.percentageHeader = this.percentageSection.querySelector('h2 span')
        this.iconGrid = document.querySelector('.icon-grid')
        this.categories = document.querySelectorAll('.category-container')

        // keep this in the constructor
        // this.createTimeline()
        // this.countPercentage()
        // this.instanceIconGrid()
        // this.gridAnimation()

        // Wait for resources to be ready before initializing
        this.experience.resources.on('ready', () => {
            this.particleObserver()
        })
    }

    particleObserver() {
        this.particulateMatter = this.experience.world.particulateMatter

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Get the category name from the class list
                        const categoryClass = Array.from(
                            entry.target.classList
                        ).find(
                            (className) => className !== 'category-container'
                        )

                        if (categoryClass === 'totaal') {
                            console.log('show all categories')
                            this.particulateMatter.showAllCategories()
                        }

                        this.particulateMatter.showCategory(categoryClass)
                    }
                })
            },
            {
                threshold: 0.5, // Trigger when element is 50% visible
            }
        )

        // Observe all category containers
        this.categories.forEach((category) => observer.observe(category))
    }
}
