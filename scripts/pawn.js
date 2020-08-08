export class Pawn{
    constructor(color){
        this.color = color;
        this.queen = false;
        this.initNode();
    }

    initNode(){
        this.node = document.createElement("img");
        this.node.classList.add("pawn");
        this.node.setAttribute("src", `assets/${this.color}Pan.png`);
    }

    addPawnToNode(node){
        node.appendChild(this.node);
    }
}