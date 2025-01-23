import Experience from '../Experience.js'

import Room from './Room.js'
import Floor from './Floor.js'
import Controls from './Controls.js'
import Environment from './Environment.js'
import ParticulateMatter from './ParticulateMatter.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.resources = this.experience.resources

        this.resources.on('ready', () => {
            this.environment = new Environment()
            this.room = new Room()
            this.floor = new Floor()
            this.controls = new Controls()
            this.particulateMatter = new ParticulateMatter(this.room.group)
        })
    }

    resize() {}

    update() {
        if (this.room) {
            this.room.update()
        }

        if (this.controls) {
            this.controls.update()
        }

        if (this.particulateMatter) {
            this.particulateMatter.update()
        }
    }
}
