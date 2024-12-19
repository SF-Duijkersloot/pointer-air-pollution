import * as THREE from "three"
import gsap from "gsap"
import Experience from "../Experience.js"

import pmVertexShader from "../shaders/pm/vertex.glsl"
import pmFragmentShader from "../shaders/pm/fragment.glsl"

export default class ParticulateMatter {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug

        this.parameters = {}
        this.parameters.maxCount = 50000 // Large max count
        this.parameters.count = 5000 // Initial visible count
        this.parameters.color = "#878787"

        this.geometry = null
        this.material = null
        this.pm = null

        this.createParticulateMatter()
        this.debugOptions()
    }

    createParticulateMatter() {
        // Clean up existing particles
        if (this.pm) {
            this.geometry.dispose()
            this.material.dispose()
            this.scene.remove(this.pm)
        }

        // Create large geometry buffer
        this.geometry = new THREE.BufferGeometry()
        this.positionArray = new Float32Array(this.parameters.maxCount * 3)
        this.scaleArray = new Float32Array(this.parameters.maxCount)

        for (let i = 0; i < this.parameters.maxCount; i++) {
            this.positionArray[i * 3 + 0] = (Math.random() - 0.5) * 1.8
            this.positionArray[i * 3 + 1] = Math.random() * 1.85
            this.positionArray[i * 3 + 2] = (Math.random() - 0.5) * 1.8

            this.scaleArray[i] = Math.random()
        }

        this.geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(this.positionArray, 3)
        )
        this.geometry.setAttribute(
            "aScale",
            new THREE.BufferAttribute(this.scaleArray, 1)
        )

        // Shader material
        this.material = new THREE.ShaderMaterial({
            vertexShader: pmVertexShader,
            fragmentShader: pmFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uSize: { value: 4 },
                uColor: { value: new THREE.Color(this.parameters.color) },
                uVisibleCount: { value: this.parameters.count }, // Pass visible count to the shader
            },
            transparent: true,
            depthWrite: false,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
        })

        // Create Points
        this.pm = new THREE.Points(this.geometry, this.material)
        this.pm.position.set(0.037, 0, 0.235)
        this.pm.rotateY(Math.PI / 4) // Rotate to match the room
        this.scene.add(this.pm)
    }

    smoothUpdateCount(newCount, duration = 1) {
        // Use GSAP for smooth interpolation of the count
        gsap.to(this.parameters, {
            count: newCount,
            duration: duration,
            ease: "power1.inOut",
            onUpdate: () => {
                this.material.uniforms.uVisibleCount.value =
                    this.parameters.count
            },
        })
    }

    debugOptions() {
        if (this.debug) {
            this.debugFolder = this.debug.gui.addFolder("Particulate Matter")
            this.debugFolder.open()

            this.debugFolder
                .add(this.parameters, "count")
                .min(100)
                .max(this.parameters.maxCount)
                .step(1)
                .onChange((value) => {
                    this.smoothUpdateCount(value, 1) // Smoothly update count
                })

            this.debugFolder
                .add(this.material.uniforms.uSize, "value")
                .min(0)
                .max(100)
                .step(0.1)
                .name("Size")

            this.debugFolder.addColor(this.parameters, "color").onChange(() => {
                this.material.uniforms.uColor.value.set(this.parameters.color)
            })

            this.positionFolder = this.debugFolder.addFolder("Position")
            this.positionFolder
                .add(this.pm.position, "x")
                .min(-1)
                .max(2.5)
                .step(0.001)
                .name("PM X")

            this.positionFolder
                .add(this.pm.position, "y")
                .min(-1)
                .max(2.5)
                .step(0.001)
                .name("PM Y")

            this.positionFolder
                .add(this.pm.position, "z")
                .min(-1)
                .max(2.5)
                .step(0.001)
                .name("PM Z")
        }
    }

    resize() {}

    update() {}
}
