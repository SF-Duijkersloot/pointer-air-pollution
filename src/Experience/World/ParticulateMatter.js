import * as THREE from 'three'
import gsap from 'gsap'
import Experience from '../Experience.js'
import pmVertexShader from '../shaders/pm/vertex.glsl'
import pmFragmentShader from '../shaders/pm/fragment.glsl'

export default class ParticulateMatter {
    constructor(roomGroup) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.roomGroup = roomGroup
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.parameters = {
            speedMultiplier: 0.005,
            intensity: 1,
            particleSize: 7,
            areaSize: 3.95,
            greyDelay: 1,
            greyColor: '#d1d1d1',
        }

        this.categories = {
            bouw: {
                count: 1530,
                color: '#fed000',
                visible: false,
                active: false,
            },
            landbouw: {
                count: 1598,
                color: '#ff8205',
                visible: false,
                active: false,
            },
            industrie: {
                count: 7035,
                color: '#ff5362',
                visible: false,
                active: false,
            },
            consumenten: {
                count: 16264,
                color: '#98005e',
                visible: false,
                active: false,
            },
            verkeer: {
                count: 15063,
                color: '#09b592',
                visible: false,
                active: false,
            },
            overig: {
                count: 3360,
                color: '#2a3700',
                visible: false,
                active: false,
            },
        }

        this.activeCategory = null
        this.categoryHistory = []
        this.isTransitioning = false
        this.particles = new Map()

        this.init()
        // this.setupDebug()
    }

    init() {
        // Create particle systems for each category
        Object.entries(this.categories).forEach(([name, category]) => {
            const particleSystem = this.createParticleSystem(
                category.count,
                category.color
            )
            this.particles.set(name, particleSystem)
            this.roomGroup.add(particleSystem.points)
        })
    }

    createParticleSystem(count, color) {
        const geometry = new THREE.BufferGeometry()
        const positionArray = new Float32Array(count * 3)
        const scaleArray = new Float32Array(count)

        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            positionArray[i3] = (Math.random() - 0.5) * this.parameters.areaSize
            positionArray[i3 + 1] = Math.random() * 3.5
            positionArray[i3 + 2] =
                (Math.random() - 0.5) * this.parameters.areaSize
            scaleArray[i] = Math.random() * 0.9 + 0.1
        }

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positionArray, 3)
        )
        geometry.setAttribute(
            'aScale',
            new THREE.BufferAttribute(scaleArray, 1)
        )

        const material = new THREE.ShaderMaterial({
            vertexShader: pmVertexShader,
            fragmentShader: pmFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uSize: { value: this.parameters.particleSize },
                uColor: { value: new THREE.Color(color) },
                uVisibleCount: { value: 0 },
                uIntensity: { value: this.parameters.intensity },
            },
            transparent: true,
            depthWrite: false,
        })

        const points = new THREE.Points(geometry, material)
        points.position.set(-0.02, 0.15, 0.04)
        points.rotateY(Math.PI / 4)

        return { geometry, material, points, count }
    }

    showCategory(categoryName) {
        if (this.isTransitioning) return

        const category = this.categories[categoryName]
        if (!category) return

        // If this is the 'total' category, show all categories
        if (categoryName === 'totaal') {
            console.log('show all categories')
            this.showAllCategories()
            return
        }

        this.isTransitioning = true

        // Grey out previous category
        if (this.activeCategory) {
            const prevCategory = this.categories[this.activeCategory]
            prevCategory.active = false
            const prevParticles = this.particles.get(this.activeCategory)

            gsap.to(prevParticles.material.uniforms.uColor.value, {
                r: new THREE.Color(this.parameters.greyColor).r,
                g: new THREE.Color(this.parameters.greyColor).g,
                b: new THREE.Color(this.parameters.greyColor).b,
                duration: this.parameters.greyDelay,
            })
        }

        // Show new category
        category.visible = true
        category.active = true
        const particles = this.particles.get(categoryName)

        // Animate particles appearing one by one
        gsap.to(particles.material.uniforms.uVisibleCount, {
            value: particles.count,
            duration: 2,
            ease: 'power1.inOut',
            onComplete: () => {
                this.isTransitioning = false
            },
        })

        // Animate color after grey delay
        gsap.to(particles.material.uniforms.uColor.value, {
            r: new THREE.Color(category.color).r,
            g: new THREE.Color(category.color).g,
            b: new THREE.Color(category.color).b,
            duration: 1,
            delay: this.parameters.greyDelay,
        })

        this.activeCategory = categoryName
        this.categoryHistory.push(categoryName)
    }

    showAllCategories() {
        console.log('showing categories')
        Object.entries(this.categories).forEach(([name, category]) => {
            category.active = true
            category.visible = true
            const particles = this.particles.get(name)

            gsap.to(particles.material.uniforms.uVisibleCount, {
                value: particles.count,
                duration: 2,
                ease: 'power2.out',
            })

            gsap.to(particles.material.uniforms.uColor.value, {
                r: new THREE.Color(category.color).r,
                g: new THREE.Color(category.color).g,
                b: new THREE.Color(category.color).b,
                duration: 1,
            })
        })
    }

    resize() {
        const pixelRatio = Math.min(window.devicePixelRatio, 2)
        this.particles.forEach(({ material }) => {
            material.uniforms.uPixelRatio.value = pixelRatio
        })
    }

    update() {
        const elapsedTime =
            (this.time.elapsed * this.parameters.speedMultiplier) % 50
        const wrappedTime = elapsedTime > 25 ? 50 - elapsedTime : elapsedTime
        this.particles.forEach(({ material }) => {
            material.uniforms.uTime.value = wrappedTime
        })
    }
}
