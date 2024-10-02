class CurrentState {
    constructor() {
        this.player = 1;
        this.numOf6 = 0;
        this.randomNumber = 1;
        this.isDiceRolled = false;

        const boundCells = boundaryCellNums;
        this.boundary = {};
        for (let i = 0; i < boundCells.length; i++) {
            this.boundary[boundCells[i]] = [];
        }
    }

    isBoundaryCell(cellNumber) {
        return this.boundary[cellNumber] !== undefined;
    }

    update() {
        function addClass(elements, className) {
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                element.classList.add(className);
            }
        }

        function removeClass(elements, className) {
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                element.classList.remove(className);
            }
        }
        setTimeout(() => {
            diceRoller[this.player - 1].innerText = "";
            removeClass(
                eachPieceObject
                    .filter((val) => val.player === this.player)
                    .map((val) => val.ludoPieceEle),
                "come-on-top"
            );
            const prevPlayerNum = this.player;
            do {
                this.player = (this.player % 4) + 1;
                if (prevPlayerNum === this.player) {
                    break;
                }
            } while (
                eachPieceObject
                    .filter((val) => val.player === this.player)
                    .filter((val) => val.currPos === 56).length === 4
            );
            addClass(
                eachPieceObject
                    .filter((val) => val.player === this.player)
                    .map((val) => val.ludoPieceEle),
                "come-on-top"
            );
            diceRoller[this.player - 1].innerText = this.randomNumber;
            this.isDiceRolled = false;
        }, 600);
    }

    getHighlightedPiecesArray() {
        const currPlayerPieces = eachPieceObject.filter(
            (val) => val.player === this.player
        );
        const array = [];
        for (let i = 0; i < currPlayerPieces.length; i++) {
            const pieceObj = currPlayerPieces[i];
            if (
                Array.from(
                    document.querySelector(
                        `#${pieceObj.ludoPieceEle.id} .highlight`
                    ).classList
                ).includes("rotate")
            ) {
                array.push(i);
            }
        }
        return array;
    }

    unSetHighlightAllCurrent() {
        const currPlayerPieces = eachPieceObject.filter(
            (val) => val.player === this.player
        );
        for (let i = 0; i < currPlayerPieces.length; i++) {
            this.setHighlight(currPlayerPieces[i], false);
        }
    }

    setHighlight(pieceObj, value) {
        const highlightEle = document.querySelector(
            `#${pieceObj.ludoPieceEle.id} .highlight`
        );
        if (value === true) {
            pieceObj.isHighlight = true;
            highlightEle.classList.add("rotate");
        } else if (value === false) {
            pieceObj.isHighlight = false;
            highlightEle.classList.remove("rotate");
        }
    }
}
