import { Field } from "./field.js";
import { Pawn } from "./pawn.js";
import {letters } from './vars.js';

export class Board{
    constructor(){
        this.fields = [];
        this.pawns = [];
        this.documentBlock = document.querySelector(".board");
    }

    initFields(){
        console.log("Board: initFields()");
        function swapFieldColor(currentColor){
            if (currentColor == "white"){
                return "black";
            } else {
                return "white";
            }
        }

        var nextFieldColor = "white";
        var rowNumber = 8;
        for (var fieldNumber = 0; fieldNumber < 64; fieldNumber ++){
            // console.log(`Board: loop ${fieldNumber}`);
            let letterNumber = fieldNumber % 8;
            if (letterNumber == 0 && fieldNumber != 0){
                rowNumber --;
                nextFieldColor = swapFieldColor(nextFieldColor);
            }
            let tempfield = new Field(nextFieldColor, letters[letterNumber], rowNumber, this);
            nextFieldColor = swapFieldColor(nextFieldColor);

            this.fields.push(tempfield);
            tempfield.addNodeToBoard(this.documentBlock);
        }
    }

    initPawns(){
        console.log("Board: initPawns()");
        var remainingBlackPawns = 8;
        var canStartAddingWhite = false;
        var color = "black"
        this.fields.forEach(field => {;
            if (field.canCaptured){
                if (color === "black"){
                    if (remainingBlackPawns > 0){
                        let pawn = new Pawn(color, field);
                        this.pawns.push(pawn);
                        field.addPawn(pawn);
                        remainingBlackPawns --;
                    } else {
                        // console.log("Board: initPawns() - change pan color");
                        color = "white";
                    }
                } else {
                    if (field.code === "B2"){
                        canStartAddingWhite = true;
                    }
                    if (canStartAddingWhite){
                        let pawn = new Pawn(color, field);
                        this.pawns.push(pawn);
                        field.addPawn(pawn);
                    }
                }
            }
        });
    }

    unselectAllPawns(){
        this.pawns.forEach(pawn => {
            pawn.setPawnUnactive();
        });
    }

    preparePawnMove(pawn){
        console.log(`Board: preparePawnMove (${pawn})`);
        this.clearFieldsMovePosibility();
        this.addFieldsMovePosibility(pawn);
    }

    makePawnMove(pawn, nField){
        pawn.movePawn(nField);
        this.clearFieldsMovePosibility();
    }

    addFieldsMovePosibility(pawn){
        this.fields.forEach(field => {
            if (this.checkPawnCanMove(pawn, field)){
                field.markFieldPossibleToMove();
                field.addMoveFunction(pawn);
            }
        });
    }

    clearFieldsMovePosibility(){
        this.fields.forEach(field => {
            field.unmarkFieldPossibleToMove();
            field.removeMovefunction();       // remove someway old event listener after move pawn
        });
    }

    checkPawnCanMove(pawn, field){
        if (field.canCaptured){
            return true;
        }
        return false;
    }
}