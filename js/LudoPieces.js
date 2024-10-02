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

    placeInside(size = 1, parentObj = {}) {
        let {
            startXPerc: parStartXPerc,
            endXPerc: parEndXPerc,
            startYPerc: parStartYPerc,
            endYPerc: parEndYPerc,
        } = parentObj;

        parStartXPerc = parStartXPerc || 0;
        parEndXPerc = parEndXPerc || 0;
        parStartYPerc = parStartYPerc || 0;
        parEndYPerc = parEndYPerc || 0;
        
        const {
            left: parentStartX,
            top: parentStartY,
            right: parentEndX,
            bottom: parentEndY,
        } = this.parent.getBoundingClientRect();

        const { left: containerX, top: containerY } =
            pieceMovingArea.getBoundingClientRect();

        const modParentStartX =
            parentStartX + (parentEndX - parentStartX) * parStartXPerc;
        const modParentStartY =
            parentStartY + (parentEndY - parentStartY) * parStartYPerc;
        const modParentEndX =
            parentStartX + (parentEndX - parentStartX) * (1 - parEndXPerc);
        const modParentEndY =
            parentStartY + (parentEndY - parentStartY) * (1 - parEndYPerc);

        const dimension = Math.min(
            (modParentEndX - modParentStartX) * size,
            (modParentEndY - modParentStartY) * size
        );

        this.width = dimension;
        this.height = dimension;
        this.left =
            modParentStartX -
            containerX +
            (modParentEndX - modParentStartX) / 2 -
            this.width / 2;
        this.top =
            modParentStartY -
            containerY +
            (modParentEndY - modParentStartY) / 2 -
            this.height / 2;
    }

    #isCapture(cellNum) {
        if (cellNum !== undefined) {
            if (currentState.isBoundaryCell(cellNum) && starCellNums[cellNum] !== true) {
                const futureCellNumPiecesArr = currentState.boundary[cellNum];
                for (let i = 0; i < futureCellNumPiecesArr.length; i++) {
                    const pieceObj = futureCellNumPiecesArr[i];
                    if (pieceObj.player !== this.player) {
                        futureCellNumPiecesArr.splice(i, 1);
                        this.moveReverse(pieceObj);
                        return true;
                    }
                }
            }
        }
        return false;
    }

    moveReverse(pieceObj) {
        const link = { 0: "t-l", 1: "t-r", 2: "b-l", 3: "b-r" };
        for (let i = 0; i < pieceObj.currPos + 1; i++) {
            setTimeout(() => {
                pieceObj.currPos--;
                if (pieceObj.currPos === -1) {
                    pieceObj.parent = document.querySelector(
                        `.home-box-outer.color-${
                            pieceObj.player
                        } .piece-container.${link[pieceObj.pieceNum]}`
                    );
                } else {
                    pieceObj.parent =
                        eachPathSteps[pieceObj.path[pieceObj.currPos]];
                }
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
            if (currentState.isBoundaryCell(futureCellNum)) {
                currentState.boundary[futureCellNum].push(this);
            }
        }

        for (let i = 0; i < modifiedSteps; i++) {
            setTimeout(() => {
                this.currPos++;
                let hasReachedDestination = false;
                if (this.currPos === 56) {
                    const linkPlayerToPosition = {
                        1: "left",
                        2: "top",
                        3: "right",
                        4: "bottom",
                    };
                    this.parent = document.querySelector(
                        `.each-destination-box.${
                            linkPlayerToPosition[this.player]
                        }`
                    );
                    
                    const parentObj = {};
                    switch (this.player) {
                        case 1:
                            parentObj.startXPerc = 0.5;
                            parentObj.endXPerc = 0.1;
                            break;
                        case 2:
                            parentObj.startYPerc = 0.5;
                            parentObj.endYPerc = 0.1;
                            break;
                        case 3:
                            parentObj.endXPerc = 0.5;
                            parentObj.startXPerc = 0.1;
                            break;
                        case 4:
                            parentObj.endYPerc = 0.5;
                            parentObj.startYPerc = 0.1;
                            break;
                    }
                    this.placeInside(1, parentObj);
                    hasReachedDestination = true;
                } else {
                    this.parent = eachPathSteps[this.path[this.currPos]];
                    this.placeInside();
                }
                this.updateDom();

                if (i === modifiedSteps - 1) {
                    const hasCaptured = this.#isCapture(futureCellNum);
                    if (
                        originalSteps === 6 ||
                        hasCaptured ||
                        hasReachedDestination
                    ) {
                        currentState.isDiceRolled = false;
                    } else {
                        currentState.update();
                    }
                }
            }, 250 * (i + 1));
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
