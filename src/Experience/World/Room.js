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
                })
            }
            child.castShadow = true
            child.receiveShadow = true  
        })

        this.scene.add(this.roomScene)
        this.roomScene.scale.set(0.1, 0.1, 0.1)
        this.roomScene.position.y = -.5
    }

    resize() {
    }

    update() {
    }

}