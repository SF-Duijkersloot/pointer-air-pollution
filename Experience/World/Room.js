import * as THREE from 'three'
import Experience from '../Experience.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.room = this.resources.items.room
        this.roomScene = this.room.scene
        
        console.log(this.roomScene)

        this.setModel()

    }

    setModel() {
        this.scene.add(this.roomScene)
        this.roomScene.scale.set(0.1, 0.1, 0.1)
    }

    resize() {
    }

    update() {
    }

}