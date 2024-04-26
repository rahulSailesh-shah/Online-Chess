"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.startTime = new Date();
        this.moveCount = 0;
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white",
            },
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black",
            },
        }));
    }
    makeMove(socket, move) {
        // Check Turn
        if (this.moveCount % 2 === 0 && socket !== this.player1)
            return;
        if (this.moveCount % 2 === 1 && socket !== this.player2)
            return;
        console.log("No early return");
        // Validate Move and make the move
        try {
            if (this.board) {
                console.log("Make move from chess");
                this.board.move(move);
                console.log("Move succeeded");
            }
        }
        catch (error) {
            console.log(error);
            return;
        }
        // Check for Game over
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
        }
        // Send the move to the other player
        if (this.moveCount % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
        this.moveCount++;
    }
}
exports.Game = Game;
