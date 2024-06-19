// ==UserScript==
// @name         KenKen Puzzle Enhancements
// @namespace    http://tampermonkey.net/
// @version      2024-06-19
// @description  Enhances KenKen Puzzle website functionalities
// @author       You
// @match        https://www.kenkenpuzzle.com/game
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kenkenpuzzle.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to save completed game into localStorage
    function saveCompletedGame() {
        var topInfoBoxContent = document.getElementById('topInfoBox').innerHTML;
        var puzzleContainerContent = document.getElementById('puzzleContainer').innerHTML;
        var currentTime = new Date().toLocaleString();
        var completedGameHtml = '<div>' + topInfoBoxContent + '<br>' + currentTime + '<br>' + puzzleContainerContent + '</div>';

        var savedGame = localStorage.getItem('completedKenKenGame') || '';
        var updatedGame = completedGameHtml + savedGame;

        localStorage.setItem('completedKenKenGame', updatedGame);

        console.log('Completed game HTML saved to localStorage:', completedGameHtml);
    }

    // Function to disable buttons and elements
    function checkAndDisableElements() {
        var btnReveal = document.getElementById('btnReveal');
        var btnCheck = document.getElementById('btnCheck');
        var btnSolution = document.getElementById('btnSolution');
        var notesAll = document.getElementById('notesAll');
        var btnNote = document.getElementById('btnNote');
        var adContainer = document.querySelector('div[class="ad"]');

        if (btnReveal && btnCheck && btnSolution && notesAll && btnNote && adContainer) {
            btnReveal.disabled = true;
            btnCheck.disabled = true;
            btnSolution.disabled = true;
            notesAll.hidden = true;
            btnNote.classList.add('autoNotesBox');
            btnNote.disabled = true;

            var completedGameHtml = localStorage.getItem('completedKenKenGame');
            if (completedGameHtml) {
                adContainer.innerHTML = completedGameHtml;
            }

            clearInterval(intervalId);
        }
    }

    // Check every 200ms until the elements are found and disabled
    var intervalId = setInterval(checkAndDisableElements, 200);

    // Function to wait for solveButton and save completed game
    function waitForSolveButton() {
        var solveButton = document.querySelector('button[onclick="kenken.game.solveAnother()"]');
        if (solveButton) {
            solveButton.addEventListener('click', function() {
                console.log('Solve another puzzle button clicked');
                saveCompletedGame();
            });
        } else {
            console.log('Button not found yet, retrying in 500ms...');
            setTimeout(waitForSolveButton, 500); // Retry after 500ms
        }
    }

    // Call waitForSolveButton on window load
    window.addEventListener('load', waitForSolveButton);

})();
