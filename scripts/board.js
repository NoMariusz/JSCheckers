import { Field } from "./field.js";
import { Pawn } from "./pawn.js";
import { ConfettiManager } from './confetti.js';

export class Board{
    constructor(){
        this.fields = [];
        this.pawns = [];
        this.documentBlock = document.querySelector(".board");
        this.activeColor = 'white';
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
            let tempfield = new Field(nextFieldColor, letterNumber, rowNumber, this);
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
            // console.log(`Initing fields pawn: field ${field}, fieldPawn ${field.pawn}, fieldOccupied: ${field.occupied}`);
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
        console.log(`Board: makePawnMove(pawn: ${pawn}, newField:${nField})`);
        pawn.movePawn(nField);
        this.makeAfterPawnMoveOperations();
    }

    makePawnTakedMove(pawn, nField, takedPawns){
        console.log(`Board: makePawnTakedMove(pawn: ${pawn}, newField:${nField}, takedPawnS:${takedPawns})`);
        pawn.movePawn(nField);
        takedPawns.forEach(takedPawn => {
            takedPawn.takeThisPawn();
        });
        this.makeAfterPawnMoveOperations();
    }

    makeAfterPawnMoveOperations(){
        this.clearFieldsMovePosibility();
        this.changeActiveColor();
        let checkWinResult = this.checkPlayerWin();
        console.log(`Board: makeAfterPawnMoveOperations() - checkingWinResult: ${checkWinResult}`);
        if (checkWinResult === 'white' || checkWinResult === 'black'){
            window.setTimeout(() => {this.prepareColorWin(checkWinResult)}, 1000);
        }
    }

    addFieldsMovePosibility(pawn){
        this.fields.forEach(field => {
            let checking = this.checkPawnCanMove(pawn, field);
            // console.log(`Board: addFieldsMovePossibility: field ${field}, result: ${checking}`);
            if (checking === true){     // make normal, not taked pawn move
                field.markFieldPossibleToMove();
                field.addMoveFunction(pawn);
            } else if (checking instanceof Field){  // make taking one pawn move
                field.markFieldPossibleToMove('#F2AE76');
                field.addTakeMoveFunction(pawn, [checking.pawn]);
            } else if (checking instanceof Array){     // make taking many pawns move
                field.markFieldPossibleToMove('#F2AE76');
                field.addTakeMoveFunction(pawn, checking);
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
        // false is pawn can not move, true is can move, returning field is mean pawn can take other pawn
        let pawnColumn = pawn.field.codeLetterIndex;
        let pawnRow = pawn.field.codeNumber;
        let fieldColumn = field.codeLetterIndex;
        let fieldRow = field.codeNumber;
        if (pawn.queen){      // move for queens
            if (field.canCaptured){
                let slantDistance = Math.abs(pawnColumn - fieldColumn)  // slant tiles distance beetween pawn and checking field
                if (slantDistance === Math.abs(pawnRow - fieldRow)){
                    let takedPawnsArray = [];
                    for (var slantDistanceIter = slantDistance - 1; slantDistanceIter > 0; slantDistanceIter --){   // to check every field beetween pawn and checking field
                        let takedPawnRow = (pawnRow - fieldRow > 0) ? (pawnRow - slantDistanceIter) : (pawnRow + slantDistanceIter);
                        let takedPawnColumn =  (pawnColumn - fieldColumn > 0) ? (pawnColumn - slantDistanceIter) : (pawnColumn + slantDistanceIter);
                        let takedPawnField = this.findFieldByCords(takedPawnRow, takedPawnColumn);
                        if (takedPawnField.occupied){       // check field to take, has pawn
                            if (takedPawnField.pawn.color == pawn.color){   // pawn can not jump over allies pawns, so an not move
                                return false;
                            } else {    // if field has enemy pawn, add them to taked pawn array
                                takedPawnsArray.push(takedPawnField.pawn);
                            }
                        }
                    }
                    if (takedPawnsArray.length > 0){    // if is any pawn to took, return array of them
                        return takedPawnsArray;
                    }
                    return true;           // if takedArray is empty, none ally at line beetween field and pawn, return true
                }
            }
        } else if (Math.abs(pawnColumn - fieldColumn) <= 2 && Math.abs(pawnRow - fieldRow) <= 2){  // check move only for nearest fields
            if (field.canCaptured){
                if (pawn.color == "black" && pawnRow - fieldRow == 1){  // normal move to front
                    return true;
                }  else if (pawn.color == "white" && pawnRow - fieldRow == -1){     // normal move to front
                    return true;
                } else {    // taking a pawn
                    if (pawn.color == 'black' && Math.abs(pawnColumn - fieldColumn) == 2 && pawnRow - fieldRow == 2){
                        let takedPawnRow = pawnRow - 1;
                        let takedPawnColumn = (pawnColumn - fieldColumn < 0) ? (pawnColumn + 1) : (pawnColumn - 1);
                        let takedPawnField = this.findFieldByCords(takedPawnRow, takedPawnColumn);  //getting middle filed, to check it has enemy pawn
                        if (takedPawnField.occupied && takedPawnField.pawn.color != 'black'){
                            // console.log(`Board: find field to take field: ${field},takedPawnField: ${takedPawnField}, takedPawnField.pawn: ${takedPawnField.pawn}`);
                            return takedPawnField;
                        }
                    } else if (pawn.color == 'white' && Math.abs(pawnColumn - fieldColumn) == 2 && pawnRow - fieldRow == -2){
                        let takedPawnRow = pawnRow + 1;
                        let takedPawnColumn =  (pawnColumn - fieldColumn < 0) ? (pawnColumn + 1) : (pawnColumn - 1);
                        let takedPawnField = this.findFieldByCords(takedPawnRow, takedPawnColumn); //getting middle filed, to check it has enemy pawn
                        if (takedPawnField.occupied && takedPawnField.pawn.color != 'white'){
                            // console.log(`Board: find field to take field: ${field},takedPawnField: ${takedPawnField}, takedPawnField.pawn: ${takedPawnField.pawn}`);
                            return takedPawnField;
                        }
                    }
                }
            }
        }
        return false;
    }

    findFieldByCords(row, column){
        // console.log(`Board: findFieldByCords(row: ${row}, column: ${column})`);
        return this.fields.find((e) => {
            return e.codeNumber == row && e.codeLetterIndex == column;
        });
    }

    changeActiveColor(){
        const colorHavingTurn = document.getElementById('colorHavingTurn');
        if (this.activeColor === 'white'){
            this.activeColor = 'black';
            colorHavingTurn.textContent = 'black'.toUpperCase();
        } else {
            this.activeColor = 'white';
            colorHavingTurn.textContent = 'white'.toUpperCase();
        }
    }

    removePawnFromBoardPawnList(pawn){
        let removedPawnIndex = this.pawns.indexOf(pawn);
        console.log(`Board: removePawnFromBoardPawnList(pawn: ${pawn}) - get index: ${removedPawnIndex}`);
        if (removedPawnIndex > -1){
            this.pawns.splice(removedPawnIndex, 1);
        } else {
            console.log(`ERROR: Board: removePawnFromBoardPawnList(pawn: ${pawn}) - can not find this pawn in pawns list`);
        }
    }

    checkPlayerWin(){
        console.log(`Board: checkPlayerWin() - pawns ${this.pawns}`);
        let isBlack = this.pawns.find((e) => {  //checking is left any black pawn if not return win color white
            return e.color == 'black';
        });
        if (!isBlack){
            console.log('Board: checkPlayerWin() - no black pawns left, white win');
            return 'white';
        } else {
            let isWhite = this.pawns.find((e) => {  //checking is left any white pawn if not return win color black
                return e.color == 'white';
            });
            if (!isWhite){
                console.log('Board: checkPlayerWin() - no white pawns left, black win');
                return 'black';
            }
        }
        return false;
    }

    prepareColorWin(color){
        let gameBlock = document.querySelector(".game");
        let winBlock = document.querySelector(".winPage");
        let winColorName = document.getElementById('winColorName');
        winColorName.textContent = color.toUpperCase();
        gameBlock.classList.add("hidden");
        winBlock.classList.remove("hidden");

        let sunnyFanfarSound = document.getElementById('sunnyFanfarSound');
        sunnyFanfarSound.play();

        let confettiManager = new ConfettiManager(winBlock);
        confettiManager.start();
    }
}