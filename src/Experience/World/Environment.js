import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug
        this.resources = this.experience.resources
        this.room = this.resources.items.room
        this.roomScene = this.room.scene

        this.parameters = {
            background: '#EFECE6'
            // background: '#f7f0e1'
        }

        this.setSunlight()
        this.setBackground()

    }

    setSunlight() {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 3)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 20
        this.sunLight.shadow.mapSize.set(2048, 2048)
        this.sunLight.shadow.normalBias = 0.05
        // const helper = new THREE.CameraHelper(this.sunLight.shadow.camera)
        // this.scene.add(helper)

        this.sunLight.position.set(-1.5, 7, 3)
        this.scene.add(this.sunLight)

        this.AmbientLight = new THREE.AmbientLight('#ffffff', 1)
        this.scene.add(this.AmbientLight)
    }

    setBackground() {
        this.scene.background = new THREE.Color(this.parameters.background)
        // add gui
        this.debugFolder = this.debug.gui.addFolder('environment')
        this.debugFolder.open()
        this.debugFolder.addColor(this.parameters, 'background').onChange(() => this.scene.background.set(this.parameters.background))

    }

    resize() {
    }

    update() {
    }

}