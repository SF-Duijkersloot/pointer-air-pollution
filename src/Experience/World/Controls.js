import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Controls {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.room = this.resources.items.room
        this.roomScene = this.room.scene
    }

    resize() {
    }

    update() {
        
    }

}