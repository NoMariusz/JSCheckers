import { Field } from "./field.js";

export class Board{
    constructor(){
        this.fields = [];
        this.documentBlock = document.querySelector(".board");
        this.initFields();
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
}

// export {Board};