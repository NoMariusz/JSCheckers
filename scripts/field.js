export class Field{
    constructor(color, number){
        // console.log(`Field: initializing, color ${color}, number ${number}`);
        this.color = color;
        this.number = number;
        this.pawn = null;
        this.initNode();
    }

    get canCaptured(){
        return this.color == "black";
    }

    get isCaptured(){
        return this.pawn != null;
    }

    initNode(){
        this.node = document.createElement("div");
        this.pText = document.createElement("p");
        let textNode = document.createTextNode(this.number);
        this.pText.appendChild(textNode);
        this.node.appendChild(this.pText);
        this.node.style.backgroundColor = this.color;
        this.node.classList.add("field");
    }

    addNodeToBoard(board){
        console.log(`Field: adding ${this.node} to board ${board}`);
        board.appendChild(this.node);
    }

    addPawn(pawn){
        this.pawn = pawn;
        pawn.addPawnToNode(this.node);
    }


}