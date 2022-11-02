export class InfosUi {
    constructor() { }

    showInfo(msg) {
        let p = document.createElement("p")
        p.innerHTML = msg
        document.getElementById("infos").append(p)
    }

    clearElement(id) {
        document.getElementById(id).innerHTML = ""
    }
}