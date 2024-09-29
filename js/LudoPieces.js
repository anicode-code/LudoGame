class LudoPiece {
    constructor(id) {
        this.ludoPieceEle = document.createElement("div");
        this.ludoPieceEle.id = `each-ludo-piece-${id}`;
        this.ludoPieceEle.classList.add("each-ludo-piece");
        pieceMovingArea.append(this.ludoPieceEle);

        this.left = undefined;
        this.top = undefined;
        this.width = undefined;
        this.height = undefined;

        this.parent = undefined;
        this.path = undefined;
        this.player = undefined;
        this.pieceNum = undefined;
        this.type = 1;
        this.color = undefined;
        this.isHighlight = false;
        this.currPos = -1;
    }

    placeInside(size = 1) {
        const {
            left: x1,
            top: y1,
            right: x2,
            bottom: y2,
        } = this.parent.getBoundingClientRect();
        const { left: x3, top: y3 } = pieceMovingArea.getBoundingClientRect();
        this.width = (x2 - x1) * size;
        this.height = (y2 - y1) * size;
        this.left = x1 - x3 + (x2 - x1) / 2 - this.width / 2;
        this.top = y1 - y3 + (y2 - y1) / 2 - this.height / 2;
    }

    #isCapture(cellNum) {
        if (cellNum !== undefined) {
            if (currentState.isBoundaryCell(cellNum)) {
                const futureCellNumPiecesArr = currentState.boundary[cellNum];
                for (let i = 0; i < futureCellNumPiecesArr.length; i++) {
                    const pieceObj = futureCellNumPiecesArr[i];
                    if (pieceObj.player !== this.player) {
                        futureCellNumPiecesArr.splice(i, 1);
                        this.moveReverse(pieceObj);
                        break;
                    }
                }
            }
        }
    }

    moveReverse(pieceObj) {
        const link = { 0: "t-l", 1: "t-r", 2: "b-l", 3: "b-r" };
        for (let i = 0; i < pieceObj.currPos + 1; i++) {
            console.log(pieceObj.currPos);
            setTimeout(() => {
                pieceObj.currPos--;
                if (pieceObj.currPos === -1) {
                    pieceObj.parent = document.querySelector(
                        `.home-box-outer.color-${pieceObj.player} .piece-container.${
                            link[pieceObj.pieceNum]
                        }`
                    );
                } else {
                    pieceObj.parent =
                    eachPathSteps[pieceObj.path[pieceObj.currPos]];
                }
                    console.log(pieceObj.parent);
                pieceObj.placeInside();
                pieceObj.updateDom();
            }, 100 * (i + 1));
        }
    }

    move(originalSteps) {
        let modifiedSteps = originalSteps;
        if (originalSteps === 6 && this.currPos === -1) {
            modifiedSteps = 1;
        }

        console.log(originalSteps);

        // inserting into the currentState Boundary
        if (this.currPos > -1) {
            // removing from the currPos
            const currCellNum = this.path[this.currPos];
            if (currentState.isBoundaryCell(currCellNum)) {
                const currCellNumPiecesArr = currentState.boundary[currCellNum];
                for (let i = 0; i < currCellNumPiecesArr.length; i++) {
                    if (currCellNumPiecesArr[i] === this) {
                        currCellNumPiecesArr.splice(i, 1);
                        break;
                    }
                }
            }
        }

        // adding to the futurePos
        const futureCellNum = this.path[this.currPos + modifiedSteps];
        if (futureCellNum !== undefined) {
            currentState.boundary[futureCellNum].push(this);
        }

        for (let i = 0; i < modifiedSteps; i++) {
            setTimeout(() => {
                this.currPos++;
                this.parent = eachPathSteps[this.path[this.currPos]];
                this.placeInside();
                this.updateDom();

                if (i === modifiedSteps - 1) {
                    // capture logic
                    this.#isCapture(futureCellNum);

                    if (originalSteps !== 6) {
                        currentState.update();
                    } else {
                        currentState.isDiceRolled = false;
                    }
                }
            }, 400 * (i + 1));
        }
    }

    update(object) {
        for (const prop in object) {
            this[prop] = object[prop];
            if (prop === "type" || prop === "color") {
                if (this.ludoPieceEle.children.length > 0) {
                    this.ludoPieceEle.children[0].remove();
                }
                this.ludoPieceEle.append(
                    PieceTypes.getType(this.type, this.color)
                );
            }
        }
        this.placeInside();
        this.updateDom();
    }

    updateDom() {
        this.ludoPieceEle.style.left = this.left + "px";
        this.ludoPieceEle.style.top = this.top + "px";
        this.ludoPieceEle.style.width = this.width + "px";
        this.ludoPieceEle.style.height = this.height + "px";
    }
}
