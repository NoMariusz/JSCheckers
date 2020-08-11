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
        this.node.setAttribute("src", `assets/${this.color}Pawn.png`);
        this.node.addEventListener("click", () => {
            console.log(`${this}, clicked`);
            this.selectPawn();
        })
    }

    selectPawn(){
        if (this.color == this.field.board.activeColor){
            console.log(`Pawn: select pawn startFieldcode ${this.field.code}`);
            this.field.board.unselectAllPawns();
            this.setPawnActive();
            this.field.board.preparePawnMove(this);
        } else {
            this.playWrongPawnAnimation();
        }
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
        this.checkCanBeQueen();
    }

    takeThisPawn(){
        this.node.style.animation = 'pawnTaked 0.5s ease';
        this.field.board.removePawnFromBoardPawnList(this); //outside timeout, because, after this function is made checking win with this.field.board array
        window.setTimeout(() => {
            this.field.removePawn();
            this.field = null;
            console.log(`${this} deleting self`);
            delete this;
        }, 500);
    }

    checkCanBeQueen(){
        if ((this.color === 'white' && this.field.codeNumber == 8) || (this.color === 'black' && this.field.codeNumber == 1)){
            console.log(`Pawn: checkCanBeQueen() - ${this} is now queen`);
            this.makeQueen();
        }
    }

    makeQueen(){
        this.queen = true;
        this.node.setAttribute("src", `assets/${this.color}QueenPawn.png`);
    }

    playWrongPawnAnimation(){
        this.node.style.animation = 'wrongPawnSelected 1s ease';
        window.setTimeout(() => {
            this.node.style.animation = '';
        }, 1000);
    }
}