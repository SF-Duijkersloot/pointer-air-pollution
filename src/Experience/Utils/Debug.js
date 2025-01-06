import GUI from 'lil-gui'

export default class Debug {
    constructor() {
        this.gui = new GUI()
        this.gui.width = '400px'
        this.gui.close()
    }
}