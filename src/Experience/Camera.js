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
        // this.perspectiveCamera.position.set(29, 14, 12)
        // this.perspectiveCamera.position.set(0, 4.5, 9)
        this.perspectiveCamera.position.set(0, 3.5, 6)
        // this.perspectiveCamera.lookAt(0, 0, 0)
    }

    createOrthographicCamera() {
        this.orthographicCamera = new THREE.OrthographicCamera(
            (-this.sizes.aspect * this.sizes.frustrum) / 2,
            (this.sizes.aspect * this.sizes.frustrum) / 2,
            this.sizes.frustrum / 2,
            -this.sizes.frustrum / 2,
            -10,
            10 
        )
        this.orthographicCamera.position.set(0, 0, 2)
        this.scene.add(this.orthographicCamera)

        // // Camera helper
        // this.cameraHelper = new THREE.CameraHelper(this.orthographicCamera)
        // this.scene.add(this.cameraHelper)

        // Grid helper
        const size = 10
        const divisions = 10

        const gridHelper = new THREE.GridHelper(size, divisions)
        // this.scene.add(gridHelper)

        // // Axes helper
        // const axesHelper = new THREE.AxesHelper(10)
        // this.scene.add(axesHelper)
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.perspectiveCamera, this.canvas)
        this.controls.enableDamping = true
        this.controls.enableZoom = true
    }
 
    resize() {
        // Updating perspective camera on resize
        this.perspectiveCamera.aspect = this.sizes.aspect
        this.perspectiveCamera.updateProjectionMatrix()
        
        // Updating orthographic camera on resize
        this.orthographicCamera.left = (-this.sizes.aspect * this.sizes.frustrum) / 2
        this.orthographicCamera.right = (this.sizes.aspect * this.sizes.frustrum) / 2
        this.orthographicCamera.top = this.sizes.frustrum / 2
        this.orthographicCamera.bottom  = -this.sizes.frustrum / 2
        this.orthographicCamera.updateProjectionMatrix()
    }

    update() {
        // console.log(this.perspectiveCamera.position)
        this.controls.update()

        // this.cameraHelper.matrixWorldNeedsUpdate = true
        // this.cameraHelper.update()
        // this.cameraHelper.position.copy(this.orthographicCamera.position)
        // this.cameraHelper.rotation.copy(this.orthographicCamera.rotation)
    }

}