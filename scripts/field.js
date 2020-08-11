import {letters } from './vars.js';

export class Field{
    constructor(color, codeLetterIndex, codeNumber, board){
        // console.log(`Field: initializing, color ${color}, code ${code}`);
        this.board = board;
        this.color = color;
        this.codeLetterIndex = codeLetterIndex;
        this.codeNumber = codeNumber;
        this.pawn = null;
        this.moveFunction = null;
        this.toString = this.newToString;
        this.initNode();
    }

    get code(){
        return letters[this.codeLetterIndex] + this.codeNumber.toString();
    }

    get canCaptured(){
        return this.color == "black" && this.pawn == null;
    }

    get occupied(){
        return this.pawn != null;
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

    markFieldPossibleToMove(color="#BD4D1A"){
        this.node.querySelector("p").style.color = color;
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

    addTakeMoveFunction(pawn, takedPawn){
        this.moveFunction = () => {
            this.board.makePawnTakedMove(pawn, this, takedPawn);
        };
        this.node.addEventListener("click", this.moveFunction);
    }

}