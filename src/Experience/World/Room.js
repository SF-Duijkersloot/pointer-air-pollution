import * as THREE from 'three'
import gsap from 'gsap'
import Experience from '../Experience.js'

export default class Room {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.room = this.resources.items.room
        this.roomScene = this.room.scene
        this.roomGroup = new THREE.Group()

        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        }

        this.setModel()
        this.onMouseMove()
    }

    setModel() {
        this.roomScene.children.forEach((child) => {
            if (child instanceof THREE.Group) {
                child.children.forEach((groupChild) => {
                    groupChild.castShadow = true
                    groupChild.receiveShadow = true
                    groupChild.material.side = THREE.DoubleSide
                })
            }
            child.castShadow = true
            child.receiveShadow = true
        })

        this.roomGroup.add(this.roomScene)
        this.scene.add(this.roomGroup)

        this.roomGroup.scale.set(0.7, 0.7, 0.7)
        this.roomGroup.position.y = -0.5
    }

    onMouseMove() {
        window.addEventListener('mousemove', (e) => {
            this.rotation =
                ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth
            this.lerp.target = this.rotation * 0.05
        })
    }

    get group() {
        return this.roomGroup
    }

    resize() {}

    update() {
        this.lerp.current = gsap.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        )

        this.roomGroup.rotation.y = this.lerp.current
    }
}
