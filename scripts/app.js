import { Board } from './board.js';

function startGame(){
    var board = null;

    function loadGameUi(){
        let introBlock = document.querySelector(".intro");
        let gameBlock = document.querySelector(".game");
        introBlock.classList.add("hidden");
        gameBlock.classList.remove("hidden");
        prepareBoard();
    }

    function prepareBoard(){
        board = new Board;
        board.initFields();
        board.initPawns();      //after board init pawns, game started, by theirs eventListeners
    }

    loadGameUi();
    playClickSound();
}

function playClickSound(){
    let clickSound = document.getElementById('clickSound');
    clickSound.play();
}

window.addEventListener("load", () => {
    let startBtn = document.querySelector(".startButton");  // add start game event
    startBtn.addEventListener("click", startGame);

    const reloadButton = document.getElementById('reloadButton');   // add reload event
    reloadButton.addEventListener("click", () => {
        playClickSound();
        window.setTimeout(() => {
            window.location.reload();
        }, 250);
    });
});