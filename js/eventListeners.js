function addEventListeners() {
    for (let i = 0; i < eachPieceObject.length; i++) {
        const each = eachPieceObject[i];
        each.ludoPieceEle.addEventListener("click", () => {
            console.log(each.isHighlight);
            if (each.isHighlight) {
                console.log("I am clickable");
                each.move(currentState.randomNumber);
                currentState.unSetHighlightAllCurrent();
            }
        });
    }

    for (let i = 0; i < diceRoller.length; i++) {
        diceRoller[i].addEventListener("click", () => {
            if (currentState.player - 1 === i && !currentState.isDiceRolled) {
                currentState.isDiceRolled = true;
                const diceNumber = Math.floor(Math.random() * 6 + 1);
                diceRoller[i].innerText = diceNumber;
                currentState.randomNumber = diceNumber;
                BrainLudoPieces.highlightValid(diceNumber);
                const highlightPieceArr = currentState.getHighlightedPiecesArray();
                if (highlightPieceArr.length === 0) {
                    currentState.update();
                }
            }
        });
    }

    addEventListener("resize", () => {
        updateSetUp();
        updateCreatedPieceInfo(false);
        fixFontSize();
    });
}
