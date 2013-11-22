$(document).ready(function() {

	(function(root){
	  var TetrisGame = root.TetrisGame = (root.TetrisGame || {});
		// var UI = TetrisGame.UI = {};

		var View = TetrisGame.View = function(grid) {
      for (var y = 2; y <= grid.length; y++) {
        for (x = 0; x <= grid[y].length; x++) {
          $('div.').append("<div data-id=[" + y + ", " + x + "]");
        }
      }
		}
    
    var makeGrid = TetrisGame.makeGrid = function (grid) {
      for (var y = 2; y <= grid.length; y++) {
        for (x = 0; x <= grid[y].length; x++) {
          $('div#board').append("<div data-id=[" + y + ", " + x + "]");
        }
      }
    }

		var start = TetrisGame.start = function() {
			var board = new TetrisGame.Board();
      board.shape = TetrisGame.Shape.random(board.grid);
			var shape = board.shape;
			keyBindings(shape, board);
			var ticks = 0;
			var timerID = TetrisGame.timerID = setInterval(function() {
				ticks += 1;
				if (ticks % 5 === 0) {
					if (shape.move("D")){
					  View(board.render());
					} else {
					  View(board.render());
					  TetrisGame.endTurn(board);
            shape = board.shape;
      			keyBindings(shape, board);
					}
				}
			}, 100);
		}

		var keyBindings = TetrisGame.keyBindings = function(shape, board) {
			$(window).keydown(function(event) {
				switch (event.which) {
				case 37:
					shape.move("L");
					View(board.render());
					break;
				case 39:
					shape.move("R");
					View(board.render());
					break;
				case 40:
					if (shape.move("D")){
					  View(board.render());
					} else {
					  View(board.render());
					  TetrisGame.endTurn(board);
					}
					break;
        case 32:
          if (shape.rotate()){
					  View(board.render());            
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
		}
	TetrisGame.start();

	})(this);

});


