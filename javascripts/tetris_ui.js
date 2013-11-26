$(document).ready(function() {

	(function(root){
	  var Tetris = root.Tetris = (root.Tetris || {});
		// var UI = Tetris.UI = {};

		var View = Tetris.View = function(grid) {
      for (var y = 2; y < grid.length; y++) {
        for (x = 0; x < grid[y].length; x++) {
          $("div[data-id='[" + y + ", " + x + "]']").attr("data-color", grid[y][x]);
        }
      }
      $("div#score").text("Score: " + Tetris.game.score);
		};
    
    var makeGrid = Tetris.makeGrid = function (grid) {
      $('div#board').empty();
      for (var y = 2; y < grid.length; y++) {
        for (x = 0; x < grid[y].length; x++) {
          $('div#board').append("<div data-id='[" + y + ", " + x + "]']></div>");
        }
      }
    };

		var start = Tetris.start = function() {
			var game = Tetris.game = new Tetris.Game();
			var shape = game.shape = Tetris.Shape.random(game.grid);
      makeGrid(game.grid);
			keyBindings(shape, game);
			var ticks = 0;
			var timerID = Tetris.timerID = setInterval(function() {
				ticks += 1;
			  View(game.grid);
				if (ticks % Math.floor(650/(game.level + 15)) === 0) {
					if (shape.move("D")){
					} else {
					  Tetris.endTurn(game);
            shape = game.shape;
      			keyBindings(shape, game);
					}
				}
			}, 15);
		};
    
    var pause = Tetris.pause = function (){
      
    };

		var keyBindings = Tetris.keyBindings = function(shape, game) {
			$(window).keydown(function(event) {
				switch (event.which) {
        case 13:
          pause;
          break;
				case 37:
					shape.move("L");
					View(game.grid);
					break;
				case 39:
					shape.move("R");
					View(game.grid);
					break;
				case 40:
					if (shape.move("D")){
					  View(game.grid);
					} else {
					  View(game.grid);
					  Tetris.endTurn(game);
					}
					break;
        case 32:
          if (shape.rotate()){
					  View(game.grid);            
          };
				}
			});
		};

		var endTurn = Tetris.endTurn = function(game) {
			if (Tetris.gameOver(game.grid)) {
				$(window).off();
				clearInterval(Tetris.timerID);
				var response = confirm('Game over! Your score was ' + game.score + '. Play again?');
				if (response) {
					Tetris.start();
				} else {
					alert("Thanks for playing!");
				}
			} else {
				$(window).off();
        game.clearRows();
        game.shape = Tetris.Shape.random(game.grid);
			}
		};
	Tetris.start();

	})(this);

});


