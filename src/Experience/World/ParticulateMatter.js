import * as THREE from "three";
import gsap from "gsap";
import Experience from "../Experience.js";
import pmVertexShader from "../shaders/pm/vertex.glsl";
import pmFragmentShader from "../shaders/pm/fragment.glsl";

export default class ParticulateMatter {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.parameters = {
            speedMultiplier: 0.003,
            intensity: 1,
            particleSize: 6,
            areaSize: 1.75,
            greyDelay: 1,
            greyColor: "#d1d1d1",
        };

        this.categories = {
            bouw: { count: 1530, color: "#83383a", visible: false },
            landbouw: { count: 1598, color: "#8338ec", visible: false },
            industrie: { count: 7035, color: "#ff006e", visible: false },
            verkeer: { count: 15063, color: "#497bdf", visible: false },
            consumenten: { count: 16264, color: "#ffbe0b", visible: false },
            overig: { count: 3360, color: "#90be6d", visible: false },
        };

        this.activeCategory = null;
        this.categoryHistory = [];
        this.isTransitioning = false;
        this.particles = new Map();

        this.createAllParticles();
        this.setupDebug();
    }

    createParticles(category, { count, color }) {
        const geometry = new THREE.BufferGeometry();
        const positionArray = new Float32Array(count * 3);
        const scaleArray = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positionArray[i3] = (Math.random() - 0.5) * 1.8;
            positionArray[i3 + 1] = Math.random() * 1.85;
            positionArray[i3 + 2] = (Math.random() - 0.5) * 1.8;
            scaleArray[i] = Math.random() * 0.9 + 0.1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
        geometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));

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
        });

        const points = new THREE.Points(geometry, material);
        points.position.set(0.037, 0, 0.235);
        points.rotateY(Math.PI / 4);
        
        return { geometry, material, points };
    }

    createAllParticles() {
        this.particles.forEach(({ geometry, material, points }) => {
            geometry.dispose();
            material.dispose();
            this.scene.remove(points);
        });
        this.particles.clear();

        Object.entries(this.categories).forEach(([category, data]) => {
            this.particles.set(category, this.createParticles(category, data));
        });
    }

    async toggleCategory(category, visible) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const duration = 1.5;
        

        if (visible && category !== this.activeCategory) {
            if (this.activeCategory) {
                const current = this.particles.get(this.activeCategory);
                gsap.to(current.material.uniforms.uColor.value, {
                    r: new THREE.Color(this.parameters.greyColor).r,
                    g: new THREE.Color(this.parameters.greyColor).g,
                    b: new THREE.Color(this.parameters.greyColor).b,
                    duration: duration / 2
                });
            }

            await new Promise(resolve => setTimeout(resolve, this.parameters.greyDelay * 1000));
            const newSystem = this.particles.get(category);
            
            if (!this.scene.children.includes(newSystem.points)) {
                this.scene.add(newSystem.points);
            }

            gsap.to(newSystem.material.uniforms.uVisibleCount, {
                value: this.categories[category].count,
                duration,
                ease: "power1.inOut"
            });

            const targetColor = new THREE.Color(this.categories[category].color);
            gsap.to(newSystem.material.uniforms.uColor.value, {
                r: targetColor.r,
                g: targetColor.g,
                b: targetColor.b,
                duration
            });

            this.categoryHistory = [...new Set([...this.categoryHistory, category])];
            this.activeCategory = category;
        } else if (!visible && category === this.activeCategory) {
            const system = this.particles.get(category);
            await new Promise(resolve => {
                gsap.to(system.material.uniforms.uVisibleCount, {
                    value: 0,
                    duration,
                    ease: "power1.inOut",
                    onComplete: () => {
                        this.scene.remove(system.points);
                        resolve();
                    }
                });
            });

            this.categoryHistory = this.categoryHistory.filter(cat => cat !== category);
            const previousCategory = this.categoryHistory[this.categoryHistory.length - 1];
            
            if (previousCategory) {
                const prevSystem = this.particles.get(previousCategory);
                const prevColor = new THREE.Color(this.categories[previousCategory].color);
                gsap.to(prevSystem.material.uniforms.uColor.value, {
                    r: prevColor.r,
                    g: prevColor.g,
                    b: prevColor.b,
                    duration
                });
            }
            
            this.activeCategory = previousCategory;
        }
        this.isTransitioning = false;
    }

    setupDebug() {
        if (!this.debug) return;

        const gui = this.debug.gui.addFolder("Particulate Matter");
        const categories = gui.addFolder("Categories");
        
        Object.entries(this.categories).forEach(([category, data]) => {
            const folder = categories.addFolder(category);
            folder.add(data, "visible").name("Visible").onChange(v => this.toggleCategory(category, v));
            folder.addColor(data, "color").name("Color");
            folder.add(data, "count").name("Particle Count").disable();
        });

        const params = gui.addFolder("Parameters");
        const updates = {
            particleSize: v => this.particles.forEach(({material}) => material.uniforms.uSize.value = v),
            areaSize: () => this.createAllParticles(),
            position: axis => v => this.particles.forEach(({points}) => points.position[axis] = v)
        };

        Object.entries(this.parameters).forEach(([key, value]) => {
            if (updates[key]) {
                params.add(this.parameters, key, 0, 100, 0.1).onChange(updates[key]);
            }
        });

        ['x', 'y', 'z'].forEach(axis => {
            params.add({[axis]: 0}, axis, -1, 1, 0.001).onChange(updates.position(axis));
        });
    }

    resize() {
        const pixelRatio = Math.min(window.devicePixelRatio, 2);
        this.particles.forEach(({material}) => material.uniforms.uPixelRatio.value = pixelRatio);
    }

    update() {
        const elapsedTime = (this.time.elapsed * this.parameters.speedMultiplier) % 50;
        const wrappedTime = elapsedTime > 25 ? 50 - elapsedTime : elapsedTime;
        this.particles.forEach(({material}) => material.uniforms.uTime.value = wrappedTime);
    }
}