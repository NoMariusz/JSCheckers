import { Board } from './board.js';

function startGame(){
    var board = null;

    function loadGameUi(){
        let introBlock = document.querySelector(".intro");
        let gameBlock = document.querySelector(".game");
        introBlock.classList.add("hidden");
        gameBlock.classList.remove("hidden");
        initBoard();
    }

    function initBoard(){
        board = new Board;
    }

    loadGameUi();
}

window.addEventListener("load", () => {
    let startBtn = document.querySelector(".startButton");
    startBtn.addEventListener("click", () => {startGame()});
});