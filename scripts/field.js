export class Field{
    constructor(color, codeLetter, codeNumber, board){
        // console.log(`Field: initializing, color ${color}, code ${code}`);
        this.board = board;
        this.color = color;
        this.codeLetter = codeLetter;
        this.codeNumber = codeNumber;
        this.pawn = null;
        this.moveFunction = null;
        this.toString = this.newToString;
        this.initNode();
    }

    get code(){
        return this.codeLetter + this.codeNumber.toString();
    }

    get canCaptured(){
        return this.color == "black" && this.pawn == null;
    }

    get isCaptured(){
        return this.pawn != null;
    }

    newToString(){
        return `Field(${this.color}, ${this.code})`;
    }


    initNode(){
        this.node = document.createElement("div");
        this.pText = document.createElement("p");
        let textNode = document.createTextNode(this.code);
        this.pText.appendChild(textNode);
        this.node.appendChild(this.pText);
        this.node.style.backgroundColor = this.color;
        this.node.classList.add("field");
    }
    addNodeToBoard(board){
        // console.log(`Field: adding ${this.node} to board ${board}`);
        board.appendChild(this.node);
    }

    addPawn(pawn){
        this.pawn = pawn;
        pawn.addPawnToNode(this.node);
    }

    removePawn(){
        this.node.removeChild(this.pawn.node);
        this.pawn = null;
    }

    markFieldPossibleToMove(){
        this.node.querySelector("p").style.color ="#BD4D1A";
    }

    unmarkFieldPossibleToMove(){
        this.node.querySelector("p").style.color = "gray";
    }

    addMoveFunction(pawn){
        this.moveFunction = () => {
            this.board.makePawnMove(pawn, this)
        };
        this.node.addEventListener("click", this.moveFunction);
    }

    removeMovefunction(){
        this.node.removeEventListener("click", this.moveFunction);
    }

}