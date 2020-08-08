import { Field } from "./field.js";
import { Pawn } from "./pawn.js";

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

        let letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
        var nextFieldColor = "white";
        var rowNumber = 8;
        for (var fieldNumber = 0; fieldNumber < 64; fieldNumber ++){
            console.log(`Board: loop ${fieldNumber}`);
            let letterNumber = fieldNumber % 8;
            if (letterNumber == 0 && fieldNumber != 0){
                rowNumber --;
                nextFieldColor = swapFieldColor(nextFieldColor);
            }
            let fieldCode = letters[letterNumber] + rowNumber.toString();
            let tempfield = new Field(nextFieldColor, fieldCode);
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
                        let pawn = new Pawn(color);
                        this.pawns.push(pawn);
                        field.addPawn(pawn);
                        remainingBlackPawns --;
                    } else {
                        console.log("Board: initPawns() - change pan color");
                        color = "white";
                    }
                } else {
                    if (field.number === "B2"){
                        canStartAddingWhite = true;
                    }
                    if (canStartAddingWhite){
                        let pawn = new Pawn(color);
                        this.pawns.push(pawn);
                        field.addPawn(pawn);
                    }
                }
            }
        });
    }
}

// export {Board};