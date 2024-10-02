const components = document.querySelector(".components");
const allDiceParentContainer = document.querySelector(
    ".all-dice-parent-container"
);
const eachDiceContainer = document.querySelectorAll(".dice-container");
const diceRoller = document.querySelectorAll(
    ".dice-container .dice-roller-box"
);
const ludoContainer = document.querySelector(".ludo-container");
const homePieceContainers = document.querySelectorAll(".piece-container");
const eachPathSteps = document.querySelectorAll(".each-path-step");
const pieceMovingArea = document.querySelector(".piece-moving-area");

const boundaryCellNums = [
    5, 8, 11, 14, 17, 33, 30, 27, 24, 21, 18, 19, 20, 23, 26, 29, 32, 35, 51,
    48, 45, 42, 39, 36, 37, 38, 41, 44, 47, 50, 53, 69, 66, 63, 60, 57, 54, 55,
    56, 59, 62, 65, 68, 71, 15, 12, 9, 6, 3, 0, 1, 2,
];

const starCellNums = {
    5: true,
    6: true,
    23: true,
    24: true,
    41: true,
    42: true,
    59: true,
    60: true,
};

const currentState = new CurrentState();
const pathOfDiffPlayer = [];
const eachPieceObject = [];

//tobedeleted
// for (let i = 0; i < eachPathSteps.length; i++) {
//     eachPathSteps[i].innerText = i;
// }

// creating object code

function createPath() {
    for (let i = 0; i < 4; i++) {
        pathOfDiffPlayer.push([]);
        for (let j = 0; j < 51; j++) {
            pathOfDiffPlayer[i].push(boundaryCellNums[(j + i * 13) % 52]);
        }
        for (let j = 0; j < 5; j++) {
            pathOfDiffPlayer[i].push(pathOfDiffPlayer[i][50] + 3 * (j + 1));
        }
    }
}

function createPiece() {
    const len = homePieceContainers.length;
    for (let i = 0; i < len; i++) {
        eachPieceObject.push(new LudoPiece(i + 1));
    }
    updateCreatedPieceInfo(true);
}

// updating object code

function initialDiceNumber() {
    diceRoller[currentState.player - 1].innerText = currentState.randomNumber;
}

function fixFontSize() {
    for (let i = 0; i < diceRoller.length; i++) {
        const dim = diceRoller[i].getBoundingClientRect();
        diceRoller[i].style.fontSize =
            Math.min(dim.width, dim.height) * 0.85 + "px";
    }
}

function updateCreatedPieceInfo(isFirst = true) {
    const len = homePieceContainers.length;
    for (let i = 0; i < len; i++) {
        if (isFirst) {
            eachPieceObject[i].update({
                // x: 500,
                // y: 500,
                parent: homePieceContainers[i],
                path: pathOfDiffPlayer[Math.floor(i / 4)],
                player: Math.floor(i / 4) + 1,
                pieceNum: i % 4,
                color: `color-${Math.floor(i / 4 + 1)}`,
            });
        } else {
            eachPieceObject[i].update();
        }
    }
}

function updateSetUp() {
    function getPercentage(difference) {
        const absDiff = Math.abs(difference);
        if (difference > 0) {
            if (absDiff <= 100) {
                return 0.3;
            } else if (absDiff <= 200) {
                return 0.35;
            }
            return 0.4;
        } else {
            if (absDiff <= 50) {
                return 0.2;
            } else if (absDiff <= 100) {
                return 0.25;
            } else if (absDiff <= 200) {
                return 0.3;
            } else if (absDiff <= 300) {
                return 0.35;
            }
            return 0.4;
        }
    }
    const compObj = components.getBoundingClientRect();
    const compWidth = compObj.width;
    const compHeight = compObj.height;
    const minDim = Math.min(compWidth, compHeight);
    const diceContPerc = getPercentage(compHeight - compWidth);
    // const diceContPerc = Math.abs(compHeight - compWidth) <= 100 ? 0.15 : 0.35;
    // const diceContPerc = Math.abs(compHeight - compWidth)  * 0.0025;
    const diceContWidth = minDim * diceContPerc;
    const diceContHeight = (minDim * diceContPerc * 337) / 617;
    for (let i = 0; i < eachDiceContainer.length; i++) {
        eachDiceContainer[i].style.width = diceContWidth + "px";
        eachDiceContainer[i].style.height = diceContHeight + "px";
    }

    let min2, max2;
    if (compWidth > compHeight) {
        // landscape
        min2 = Math.min(compHeight, compWidth - 2 * diceContWidth);
        max2 = min2 + 2 * diceContWidth;
        allDiceParentContainer.style.width = max2 + "px";
        allDiceParentContainer.style.height = min2 + "px";
    } else {
        // portrait
        min2 = Math.min(compWidth, compHeight - 2 * diceContHeight);
        max2 = min2 + 2 * diceContHeight;
        allDiceParentContainer.style.width = min2 + "px";
        allDiceParentContainer.style.height = max2 + "px";
    }

    ludoContainer.style.width = min2 + "px";
    ludoContainer.style.height = min2 + "px";
}

updateSetUp();
fixFontSize();
initialDiceNumber();
createPath();
createPiece();

addEventListeners();
