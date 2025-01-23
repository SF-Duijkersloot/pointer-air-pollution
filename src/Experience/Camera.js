import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Experience from './Experience.js'

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.createPerspectiveCamera()
        this.createOrthographicCamera()
        this.setOrbitControls()
    }

    createPerspectiveCamera() {
        this.perspectiveCamera = new THREE.PerspectiveCamera(
            35,
            this.sizes.aspect,
            0.1,
            1000
        )
        this.scene.add(this.perspectiveCamera)
        this.perspectiveCamera.position.set(0, 3.5, 6)
    }

    createOrthographicCamera() {
        this.orthographicCamera = new THREE.OrthographicCamera(
            (-this.sizes.aspect * this.sizes.frustrum) / 2,
            (this.sizes.aspect * this.sizes.frustrum) / 2,
            this.sizes.frustrum / 2,
            -this.sizes.frustrum / 2,
            -50,
            50
        )
        this.orthographicCamera.position.set(0, 3.5, 6)
        this.orthographicCamera.lookAt(new THREE.Vector3(0, 1, 0))
        this.scene.add(this.orthographicCamera)
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.perspectiveCamera, this.canvas)
        this.controls.target.set(0, 0, -1)
        this.controls.enabled = false
        this.controls.enableDamping = true
    }

    resize() {
        // Updating perspective camera on resize
        this.perspectiveCamera.aspect = this.sizes.aspect
        this.perspectiveCamera.updateProjectionMatrix()

        // Updating orthographic camera on resize
        this.orthographicCamera.left =
            (-this.sizes.aspect * this.sizes.frustrum) / 2
        this.orthographicCamera.right =
            (this.sizes.aspect * this.sizes.frustrum) / 2
        this.orthographicCamera.top = this.sizes.frustrum / 2
        this.orthographicCamera.bottom = -this.sizes.frustrum / 2
        this.orthographicCamera.updateProjectionMatrix()
    }

    update() {
        this.controls.update()
    }
}
