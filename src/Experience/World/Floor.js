import * as THREE from 'three'
import Experience from '../Experience'

export default class Floor {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug

        this.parameters = {
            color: '#e5e2e0',
        }

        this.setFloor()
        if (this.debug.active) this.setDebug()
    }

    setFloor() {
        this.geometry = new THREE.PlaneGeometry(100, 100, 1, 1)
        this.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(this.parameters.color),
            toneMapped: false,
        })
        this.plane = new THREE.Mesh(this.geometry, this.material)
        this.plane.rotation.x = -Math.PI / 2
        this.plane.position.y = -0.6
        this.plane.receiveShadow = true
        this.scene.add(this.plane)
    }

    setDebug() {
        this.debugFolder = this.debug.gui.addFolder('floor').open()
        this.debugFolder
            .addColor(this.parameters, 'color')
            .name('color')
            .onChange(() => {
                this.material.color.set(new THREE.Color(this.parameters.color))
            })
    }
}
