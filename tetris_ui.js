$(document).ready(function() {

	(function(root){
	  var TetrisGame = root.TetrisGame = (root.TetrisGame || {});
		// var UI = TetrisGame.UI = {};

		var View = TetrisGame.View = function(grid) {
      for (var y = 2; y < grid.length; y++) {
        for (x = 0; x < grid[y].length; x++) {
          $("div[data-id='[" + y + ", " + x + "]'").attr("data-color", grid[y][x]);
        }
      }
		};
    
    var makeGrid = TetrisGame.makeGrid = function (grid) {
      for (var y = 2; y < grid.length; y++) {
        for (x = 0; x < grid[y].length; x++) {
          $('div#board').append("<div data-id='[" + y + ", " + x + "]></div>");
        }
      }
    };

		var start = TetrisGame.start = function() {
			var board = TetrisGame.board = new TetrisGame.Board();
      board.shape = TetrisGame.Shape.random(board.grid);
			var shape = board.shape;
      makeGrid(board.grid);
			keyBindings(shape, board);
			var ticks = 0;
			var timerID = TetrisGame.timerID = setInterval(function() {
				ticks += 1;
				if (ticks % 5 === 0) {
					if (shape.move("D")){
					  View(board.grid);
					} else {
					  View(board.grid);
					  TetrisGame.endTurn(board);
            shape = board.shape;
      			keyBindings(shape, board);
					}
				}
			}, 100);
		};
    
    var pause = TetrisGame.pause = function (){
      
    };

		var keyBindings = TetrisGame.keyBindings = function(shape, board) {
			$(window).keydown(function(event) {
				switch (event.which) {
        case 13:
          pause;
          break;
				case 37:
					shape.move("L");
					View(board.grid);
					break;
				case 39:
					shape.move("R");
					View(board.grid);
					break;
				case 40:
					if (shape.move("D")){
					  View(board.grid);
					} else {
					  View(board.grid);
					  TetrisGame.endTurn(board);
					}
					break;
        case 32:
          if (shape.rotate()){
					  View(board.grid);            
          };
				}
			});
		};

		var newPiece = TetrisGame.endTurn = function(board) {
			if (TetrisGame.gameOver(board.grid)) {
				alert('Game Over!');
				$(window).off();
				clearInterval(TetrisGame.timerID);
			} else {
        board.clearRows();
        board.shape = TetrisGame.Shape.random(board.grid);
				$(window).off();
			}
		};
	TetrisGame.start();

	})(this);

});


