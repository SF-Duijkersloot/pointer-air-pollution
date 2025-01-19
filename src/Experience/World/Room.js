import * as THREE from 'three'
import Experience from '../Experience.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.room = this.resources.items.room
        this.roomScene = this.room.scene
    
        this.setModel()

    }

    setModel() {
        this.roomScene.children.forEach(child => {
            if(child instanceof THREE.Group) {
                child.children.forEach(groupChild => {
                    groupChild.castShadow = true
                    groupChild.receiveShadow = true
                    groupChild.material.side = THREE.DoubleSide                    
                })
            }
            child.castShadow = true
            child.receiveShadow = true  
        })

        // const curtains = this.roomScene.children.find(child => child.name === 'curtain')
        // curtains.material.transparent = true
        // curtains.material.opacity = 0.7

        this.scene.add(this.roomScene)
        // this.roomScene.scale.set(0.5, 0.5, 0.5)
        this.roomScene.scale.set(0.7, 0.7, 0.7)
        this.roomScene.position.y = -.5
        this.roomScene.position.x = 1.5
    }

    resize() {
    }

    update() {
    }

}