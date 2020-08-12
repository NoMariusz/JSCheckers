import { colors } from './vars.js';

export class ConfettiManager{
    constructor(parrentBlock){
        this.parrentBlock = parrentBlock;
        this.confettis = [];
        this.initConfetti();
    }

    initConfetti(){
        for (var iter = Math.random() * 5 + 12; iter > 0; iter--){
            let confetti = new Confetti;
            this.confettis.push(confetti);
            this.parrentBlock.appendChild(confetti.node);
        }
    }

    start(){
        console.log("confettiManager: start()");
        this.confettis.forEach(elem => {
            var id = null;
            let funParrent = this;
            function frame(){
                console.log(`Playing frame to ${elem}`);
                elem.top = elem.top - (Math.random() * 1.5 + 1) + (Math.random() * 6 + 15);
                elem.node.style.top = elem.top.toString() + "%";
                elem.left = elem.left - (Math.random() * 10 + 5) + (Math.random() * 10 + 5);
                elem.node.style.left = elem.left.toString() + "%";
                if (elem.top >= 97 || elem.left >= 97){
                    funParrent.parrentBlock.removeChild(elem.node);
                    if (id != null){
                        clearInterval(id);
                    }
                    funParrent.deleteConfetti(elem);
                }
            }
            id = setInterval(frame, elem.flowSpeed * 1000);
        });
    }

    deleteConfetti(confetti){
        confetti.node.remove();
        let confettiIndex = this.confettis.indexOf(confetti);
        if (confettiIndex > -1){
            this.confettis.splice(confettiIndex, 1);
        }
        confetti.killSelf();
    }
}

class Confetti{
    constructor(){
        this.top = -10;
        this.left = Math.random() * 95;
        this.flowSpeed = (Math.random() * 3 + 7) / 8;
        this.initNode();
        this.toString = this.newToString;
        console.log(`INIT confetti - top: ${this.top}, left: ${this.left}`);
    }

    initNode(){
        this.node = document.createElement("div");
        this.node.style.backgroundColor = colors[Math.floor(Math.random() * 13)];
        this.node.classList.add("confetti");
        this.node.style.top = this.top.toString() + "%";
        this.node.style.left = this.left.toString() + "%";
        this.node.style.height = (Math.random() * 2 + 1).toString() + "%";
        this.node.style.width = (Math.random() * 2 + 1).toString() + "%";
        this.node.style.transition = `top ${this.flowSpeed}s ease-out, left ${this.flowSpeed}s ease-out`;
    }

    newToString(){
        return `Confetti(color: ${this.node.style.backgroundColor}, pos(top, left): ${this.node.style.top} - ${this.top}, ${this.node.style.left} - ${this.left})`;
    }

    killSelf(){
        delete this;
    }
}