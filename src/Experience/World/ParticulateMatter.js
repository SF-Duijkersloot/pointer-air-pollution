import * as THREE from "three";
import gsap from "gsap";
import Experience from "../Experience.js";

import pmVertexShader from "../shaders/pm/vertex.glsl";
import pmFragmentShader from "../shaders/pm/fragment.glsl";

export default class ParticulateMatter {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.time = this.experience.time;
        this.debug = this.experience.debug;

        this.parameters = {
            speedMultiplier: 0.003,
            intensity: 1,
            particleSize: 5,
            areaSize: 1.75,
        };

        this.categories = {
            bouw: { count: 1530, color: "#83383a", visible: true },
            landbouw: { count: 1598, color: "#8338ec", visible: true },
            industrie: { count: 7035, color: "#ff006e", visible: true },
            verkeer: { count: 15063, color: "#497bdf", visible: true },
            consumenten: { count: 16264, color: "#ffbe0b", visible: true },
            overig: { count: 3360, color: "#90be6d", visible: true },
        };

        this.totalParticles = Object.values(this.categories).reduce(
            (sum, cat) => sum + cat.count,
            0
        );

        this.particles = new Map(); // Store particle systems for each category
        this.createAllParticles();
        this.debugOptions();
    }

    createParticlesForCategory(category, data, startHeight, layerHeight) {
        const geometry = new THREE.BufferGeometry();
        const positionArray = new Float32Array(data.count * 3);
        const scaleArray = new Float32Array(data.count);

        for (let i = 0; i < data.count; i++) {
            positionArray[i * 3 + 0] = (Math.random() - 0.5) * this.parameters.areaSize;
            positionArray[i * 3 + 1] =
                startHeight + Math.random() * layerHeight;
            positionArray[i * 3 + 2] = (Math.random() - 0.5) * this.parameters.areaSize;
            scaleArray[i] = Math.random() * 0.9 + 0.1; // Scale between 0.1 and 1
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
        geometry.setAttribute("aScale", new THREE.BufferAttribute(scaleArray, 1));

        const material = new THREE.ShaderMaterial({
            vertexShader: pmVertexShader,
            fragmentShader: pmFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uSize: { value: this.parameters.particleSize },
                uColor: { value: new THREE.Color(data.color) },
                uVisibleCount: { value: data.visible ? data.count : 0 },
                uIntensity: { value: this.parameters.intensity },
            },
            transparent: true,
            depthWrite: false,
        });

        const particles = new THREE.Points(geometry, material);
        particles.position.set(-0.0625, 0.225, 0.075);
        particles.rotateY(Math.PI / 4);

        return {
            geometry,
            material,
            points: particles,
        };
    }

    createAllParticles() {
        // Clean up existing particles
        this.particles.forEach(({ geometry, material, points }) => {
            geometry.dispose();
            material.dispose();
            this.scene.remove(points);
        });
        this.particles.clear();

        // Variables for stacking layers
        const totalHeight = 1.52; // Total height of the stack
        let currentHeight = 0;

        for (const [category, data] of Object.entries(this.categories)) {
            const percentage = data.count / this.totalParticles;
            const layerHeight = totalHeight * percentage;

            const particleSystem = this.createParticlesForCategory(
                category,
                data,
                currentHeight,
                layerHeight
            );

            this.particles.set(category, particleSystem);
            currentHeight += layerHeight;

            if (data.visible) {
                this.scene.add(particleSystem.points);
            }
        }
    }

    toggleCategory(category, visible, duration = 1.5) {
        this.categories[category].visible = visible;
        const particleSystem = this.particles.get(category);

        if (!particleSystem) return;

        if (visible && !this.scene.children.includes(particleSystem.points)) {
            this.scene.add(particleSystem.points);
        }

        gsap.to(particleSystem.material.uniforms.uVisibleCount, {
            value: visible ? this.categories[category].count : 0,
            duration: duration,
            ease: "power1.inOut",
            onComplete: () => {
                if (!visible) {
                    this.scene.remove(particleSystem.points);
                }
            },
        });
    }

    debugOptions() {
        if (this.debug) {
            this.debugFolder = this.debug.gui.addFolder("Particulate Matter");

            // Category controls
            const categoryFolder = this.debugFolder.addFolder("Categories");
            for (const [category, data] of Object.entries(this.categories)) {
                const categorySubFolder = categoryFolder.addFolder(category);

                categorySubFolder
                    .add(data, "visible")
                    .name("Visible")
                    .onChange((visible) => {
                        this.toggleCategory(category, visible);
                    });

                categorySubFolder
                    .addColor(data, "color")
                    .name("Color")
                    .onChange((color) => {
                        this.updateCategoryColor(category, color);
                    });

                categorySubFolder.add(data, "count").name("Particle Count").disable();
            }

            const parametersFolder = this.debugFolder.addFolder("Parameters");
            parametersFolder
                .add(this.parameters, "particleSize", 0, 100, 0.1)
                .name("Particle Size")
                .onChange((value) => {
                    this.particles.forEach(({ material }) => {
                        material.uniforms.uSize.value = value;
                    });
                });

            parametersFolder
                .add(this.parameters, "speedMultiplier", 0, 0.02, 0.0001)
                .name("Speed Multiplier");

            parametersFolder
                .add(this.parameters, "intensity", 0.01, 50, 0.1)
                .name("FBM Intensity");

            parametersFolder
                .add(this.parameters, "areaSize", 0.1, 2, 0.01)
                .name("Area Size")
                .onChange(() => {
                    this.createAllParticles();
                });

            parametersFolder
                .add({ x: -0.075, y: 0, z: 0.11 }, 'x', -0.1, 0.1, 0.001)
                .name('Position X')
                .onChange((value) => {
                    this.particles.forEach(({ points }) => {
                        points.position.x = value;
                    });
                });

            parametersFolder
                .add({ x: -0.075, y: 0, z: 0.11 }, 'y', -1, 1, 0.001)
                .name('Position Y')
                .onChange((value) => {
                    this.particles.forEach(({ points }) => {
                        points.position.y = value;
                    });
                });

            parametersFolder
                .add({ x: -0.075, y: 0, z: 0.11 }, 'z', -0.1, .25, 0.001)
                .name('Position Z')
                .onChange((value) => {
                    this.particles.forEach(({ points }) => {
                        points.position.z = value;
                    });
                });



        }
    }

    resize() {
        const pixelRatio = Math.min(window.devicePixelRatio, 2);
        this.particles.forEach(({ material }) => {
            material.uniforms.uPixelRatio.value = pixelRatio;
        });
    }

    update() {
        const TIME_WRAP = 50;
        const elapsedTime = (this.time.elapsed * this.parameters.speedMultiplier) % TIME_WRAP;
        const wrappedTime =
            elapsedTime > TIME_WRAP / 2 ? TIME_WRAP - elapsedTime : elapsedTime;

        this.particles.forEach(({ material }) => {
            material.uniforms.uTime.value = wrappedTime;
        });
    }
}
