export class Field{
    constructor(color, number){
        console.log(`Field: initializing, color ${color}, number ${number}`);
        this.color = color;
        this.number = number;
        this.isCaptured = false;
        this.initNode();
    }

    get canCaptured(){
        return this.color == "black";
    }

    initNode(){
        this.node = document.createElement("div");
        let textNode = document.createTextNode(this.number);
        this.node.appendChild(textNode);
        this.node.style.backgroundColor = this.color;
        this.node.classList.add("field");
    }

    addNodeToBoard(board){
        console.log(`Field: adding ${this.node} to board ${board}`);
        board.appendChild(this.node);
    }


}