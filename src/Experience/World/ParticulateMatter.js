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
            particleSize: 8,
            areaSize: 3.95,
            colorTransitionDuration: 2,
            visibilityTransitionDuration: 2,
            greyColor: '#d1d1d1',
        }

        /* Particle scaling -----------------------
         * Avg concentration: 8 µg/m³
         * Dimension: 2m x 2m x 2m = 8m³
         * 8 µg/m³ * 8m³ = 64 µg
         * Avg mass of a PM10 (+pm2.5) particle: 5.24*10^−13 kg
         * amount of particles: 1.22×10^5 = 122000
         * The particle count of each category is defined by the share of the total mass
         * Particles calculation based on: https://spacemath.gsfc.nasa.gov/earth/10Page105.pdf
         -------------------------------------------*/

        this.scaleFactor = 2

        this.categories = {
            bouw: {
                count: 5734 / this.scaleFactor,
                color: '#fed000',
                visible: false,
                active: false,
                index: 0,
            },
            landbouw: {
                count: 16226 / this.scaleFactor,
                color: '#ff8205',
                visible: false,
                active: false,
                index: 1,
            },
            industrie: {
                count: 20740 / this.scaleFactor,
                color: '#ff5362',
                visible: false,
                active: false,
                index: 2,
            },
            consumenten: {
                count: 34892 / this.scaleFactor,
                color: '#98005e',
                visible: false,
                active: false,
                index: 3,
            },
            verkeer: {
                count: 36844 / this.scaleFactor,
                color: '#09b592',
                visible: false,
                active: false,
                index: 4,
            },
            overig: {
                count: 7564 / this.scaleFactor,
                color: '#2a3700',
                visible: false,
                active: false,
                index: 5,
            },
        }

        this.particles = new Map()
        this.currentIndex = -1

        this.init()
        if (this.debug.active) this.setupDebug()
    }

    init() {
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
            },
            transparent: true,
            depthWrite: false,
        })

        const points = new THREE.Points(geometry, material)
        points.position.set(-0.02, 0.15, 0.04)
        points.rotateY(Math.PI / 4)

        return { geometry, material, points, count }
    }

    updateCategoryState(categoryName) {
        if (categoryName === 'totaal') {
            this.showAllCategories()
            return
        }

        const category = this.categories[categoryName]
        if (!category) {
            console.warn('❌ Invalid category:', categoryName)
            return
        }

        const newIndex = category.index

        Object.entries(this.categories).forEach(([name, cat]) => {
            if (cat.active) {
                cat.active = false
                this.updateParticleColor(name, false)
            }
        })

        setTimeout(() => {
            Object.entries(this.categories).forEach(([name, cat]) => {
                // Update visibility states
                const shouldBeVisible = cat.index <= newIndex
                if (cat.visible !== shouldBeVisible) {
                    cat.visible = shouldBeVisible
                    this.updateParticleVisibility(name)
                }

                // Update active state for target category
                if (cat.index === newIndex) {
                    cat.active = true
                    this.updateParticleColor(name, true)
                }

                // Hide categories above new index
                if (cat.index > newIndex) {
                    cat.visible = false
                    cat.active = false
                    this.updateParticleVisibility(name)
                }
            })
        }, 500)

        this.currentIndex = newIndex
    }

    updateParticleVisibility(categoryName) {
        const category = this.categories[categoryName]
        const particles = this.particles.get(categoryName)

        gsap.to(particles.material.uniforms.uVisibleCount, {
            value: category.visible ? particles.count : 0,
            duration: this.parameters.visibilityTransitionDuration,
            ease: 'power1.inOut',
        })
    }

    updateParticleColor(categoryName, isActive) {
        const particles = this.particles.get(categoryName)
        const targetColor = isActive
            ? new THREE.Color(this.categories[categoryName].color)
            : new THREE.Color(this.parameters.greyColor)

        gsap.to(particles.material.uniforms.uColor.value, {
            r: targetColor.r,
            g: targetColor.g,
            b: targetColor.b,
            duration: this.parameters.colorTransitionDuration,
        })
    }

    updateParticleSystem(categoryName) {
        const category = this.categories[categoryName]
        this.updateParticleVisibility(categoryName)
        this.updateParticleColor(categoryName, category.active)
    }

    showAllCategories() {
        Object.entries(this.categories).forEach(([name, category]) => {
            category.visible = true
            category.active = true
            this.updateParticleSystem(name)
        })
    }

    hideAllCategories() {
        Object.entries(this.categories).forEach(([name, category]) => {
            category.visible = false
            category.active = false
            this.updateParticleSystem(name)
        })
    }

    setupDebug() {
        const gui = this.debug.gui.addFolder('Particulate Matter')
        const categories = gui.addFolder('Categories')

        Object.entries(this.categories).forEach(([category, data]) => {
            const folder = categories.addFolder(category)
            folder
                .add(data, 'visible')
                .name('Visible')
                .onChange((v) => this.toggleCategory(category, v))
            folder.addColor(data, 'color').name('Color')
            folder.add(data, 'count').name('Particle Count').disable()
        })

        const params = gui.addFolder('Parameters')
        const updates = {
            particleSize: (v) =>
                this.particles.forEach(
                    ({ material }) => (material.uniforms.uSize.value = v)
                ),
            areaSize: () => this.createAllParticles(),
            position: (axis) => (v) =>
                this.particles.forEach(
                    ({ points }) => (points.position[axis] = v)
                ),
        }

        Object.entries(this.parameters).forEach(([key, value]) => {
            if (updates[key]) {
                params
                    .add(this.parameters, key, 0, 100, 0.1)
                    .onChange(updates[key])
            }
        })
        ;['x', 'y', 'z'].forEach((axis) => {
            params
                .add({ [axis]: 0 }, axis, -1, 1, 0.001)
                .onChange(updates.position(axis))
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
