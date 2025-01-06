import * as THREE from 'three'
import Experience from './Experience.js'
import { EventEmitter } from 'events'

export default class Renderer extends EventEmitter {
    constructor() {
        super()
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.camera = this.experience.camera

        this.setRenderer()
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        })
        this.renderer.physicallyCorrectLights = true
        this.renderer.outputEncoding = THREE.sRGBEncoding
        this.renderer.toneMapping = THREE.CineonToneMapping
        this.renderer.toneMappingExposure = 1.75
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(this.sizes.pixelRatio)
        this.emit('ready')
    }

    resize() {
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(this.sizes.pixelRatio)
    }

    update() {
        this.renderer.render(this.scene, this.camera.orthographicCamera)
        // this.renderer.render(this.scene, this.camera.perspectiveCamera)
    }

}