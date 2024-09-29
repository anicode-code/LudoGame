class PieceTypes {
    static getType(type, color) {
        switch (type) {
            case 1:
            default:
                const pieceA = document.createElement("div");
                pieceA.classList.add("piece-A");
                const highlight = document.createElement("div");
                highlight.classList.add("highlight");
                pieceA.append(highlight);
                const border = document.createElement("div");
                border.classList.add("border");
                const pieceColor = document.createElement("div");
                pieceColor.classList.add("piece-color");
                pieceColor.classList.add(color);
                border.append(pieceColor);
                pieceA.append(border);
            // return 
            //     `<div class="piece-A">
            // <div class="rotate"></div>
            // <div class="border">
            //     <div class="piece-color ${color}"></div>
            // </div>
            // </div>`;
            return pieceA;
        }
    }
}
