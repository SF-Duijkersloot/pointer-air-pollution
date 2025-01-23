import { EventEmitter } from 'events'

export default class Sizes extends EventEmitter{
    constructor() {
        super()
        this.body = document.querySelector('body')
        this.width = window.innerWidth
        this.height = window.innerHeight
        
        this.aspect = this.width / this.height
        this.frustrum = 5
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
     
        window.addEventListener('resize', () => {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.aspect = this.width / this.height
            this.emit('resize')
        })
    }




}