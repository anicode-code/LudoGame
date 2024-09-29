class BrainLudoPieces {
    static highlightValid(diceNumber) {
        function updateNumOf6(value = undefined) {
            const finalValue =
                value !== undefined ? value : currentState.numOf6 + 1;
            currentState.numOf6 = finalValue;
        }

        function markValidToMove(pieceObj) {
            const currPos = pieceObj.currPos;
            // if the piece is inside the home box
            if (currPos === -1) {
                if (diceNumber === 6) {
                    currentState.setHighlight(pieceObj, true);
                } else {
                    currentState.setHighlight(pieceObj, false);
                    updateNumOf6(0);
                }
            }

            // if the piece is on the boundary
            else if (currPos >= 0 && currPos <= 50) {
                for (let i = 0; i < diceNumber; i++) {
                    const nextPos = currPos + 1 + i;
                    const nextCellNumber =
                        pathOfDiffPlayer[pieceObj.player - 1][nextPos];
                    if (currentState.isBoundaryCell(nextCellNumber)) {
                        if (currentState.boundary[nextCellNumber].length > 1) {
                            currentState.setHighlight(pieceObj, false);
                            return;
                        }
                    } else {
                        break;
                    }
                }
                currentState.setHighlight(pieceObj, true);
            }

            // if the piece is on the respective home path
            else if (currPos > 50 && currPos < 56) {
                if (currPos + diceNumber <= 56) {
                    currentState.setHighlight(pieceObj, true);
                } else {
                    currentState.setHighlight(pieceObj, false);
                }
            }
        }
        
        const currPlayerPieces = eachPieceObject.filter(
            (val) => val.player === currentState.player
        );
        for (let i = 0; i < currPlayerPieces.length; i++) {
            markValidToMove(currPlayerPieces[i]);
        }
    }
}
