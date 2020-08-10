export class Pawn{
    constructor(color, field){
        this.color = color;
        this.queen = false;
        this.field = field;
        this.active = false;
        this.initNode();

        this.toString = this.newToString;
    }

    newToString(){
        return `Pawn(${this.color}, ${this.field})`;
    }

    initNode(){
        this.node = document.createElement("img");
        this.node.classList.add("pawn");
        this.node.setAttribute("src", `assets/${this.color}Pan.png`);
        this.node.addEventListener("click", () => {
            console.log(`${this}, clicked`);
            this.selectPawn();
        })
    }

    selectPawn(){
        console.log(`Pawn: select pawn startFieldcode ${this.field.code}`);
        this.field.board.unselectAllPawns();
        this.setPawnActive();
        this.field.board.preparePawnMove(this);
    }

    setPawnActive(){
        this.active = true;
        this.node.classList.add("selectedPawn");
    }

    setPawnUnactive(){
        this.active = false;
        this.node.classList.remove("selectedPawn");
    }

    addPawnToNode(node){
        node.appendChild(this.node);
    }

    movePawn(newField){
        console.log(`Pawn: move pawn from ${this.field.code} to ${newField.code}`);
        this.field.removePawn();
        newField.addPawn(this);
        this.field = newField;
        this.setPawnUnactive();
    }
}