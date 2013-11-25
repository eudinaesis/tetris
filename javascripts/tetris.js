$(document).ready(function() {
	(function (root) {
	  var Tetris = root.Tetris = (root.Tetris || {});

		Tetris.DIRS = {
			"L": [0, -1],
			"D": [1, 0],
			"R": [0, 1]
		};
    
    Tetris.ROW_VALUES = {
      0: 0,
      1: 40,
      2: 100,
      3: 300,
      4: 1200
    };
    
    Array.prototype.compare = function(testArr) {
        if (this.length != testArr.length) return false;
        for (var i = 0; i < testArr.length; i++) {
            if (this[i].compare) { 
                if (!this[i].compare(testArr[i])) return false;
            }
            if (this[i] !== testArr[i]) return false;
        }
        return true;
    };
    
    var outOfBounds = Tetris.outOfBounds = function (pos) {
      
    }
    
    Tetris.SHAPES = {
      "I": {
        "squares": [[0, 0], [0, 1], [0, 2], [0, 3]],
        "origin": [.5, 1.5],
        "color": "a"
      },
      "J": {
        "squares": [[0, 0], [1, 0], [1, 1], [1, 2]],
        "origin": [1, 1],
        "color": "b"
      },
      "L": {
        "squares": [[0, 0], [1, 0], [0, 1], [0, 2]],
        "origin": [1, 1],
        "color": "o"
      },
      "O": {
        "squares": [[0, 0], [1, 0], [0, 1], [1, 1]],
        "origin": [.5, .5],
        "color": "y"
      },
      "S": {
        "squares": [[1, 0], [0, 1], [1, 1], [0, 2]],
        "origin": [1, 1],
        "color": "g"
      },
      "T": {
        "squares": [[0, 0], [0, 1], [0, 2], [1, 1]],
        "origin": [0, 1],
        "color": "p"
      },
      "Z": {
        "squares": [[0, 0], [0, 1], [1, 1], [1, 2]],
        "origin": [1, 1],
        "color": "r"
      }
    };
    
    var Shape = Tetris.Shape = function (type, grid) {
      this.squares = _.map(Tetris.SHAPES[type]["squares"], function(square) { 
        return square.slice();
      });
      this.origin = Tetris.SHAPES[type]["origin"].slice();
      this.color = Tetris.SHAPES[type]["color"];
      this.grid = grid;
    };
    
    Shape.random = function (grid) {
      var shapesArr = ["I", "J", "L", "O", "S", "T", "Z"];
      var randomShape = _.sample(shapesArr);
      return new Shape(randomShape, grid);
    }
    
    Shape.prototype.rotate = function () {
      // new x is y, new y is -x, relative to origin
      var origin = this.origin;
      var color = this.color;
      var rotateSquares = this.squares;
      var rotateGrid = this.grid;
      var newSquares = []

      _.each(rotateSquares, function(square) {
        rotateGrid[square[0]][square[1]] = " ";
      });

      if (_.some(rotateSquares, function(square, index) {
          var newX = (square[0] - origin[0]) + origin[1];
          var newY = (square[1] - origin[1]) * -1 + origin[0];
          newSquares[index] = [newY, newX];
          return (newX < 0 || newX >= rotateGrid[0].length || newY >= rotateGrid.length || rotateGrid[newY][newX] !== " ")
        })) {
        _.each(rotateSquares, function(square) {
          rotateGrid[square[0]][square[1]] = color;
        });
        return false;
      } else {
        _.each(newSquares, function(square) {
          rotateGrid[square[0]][square[1]] = color;
        });
        this.squares = newSquares.slice();
      }
    };

		Shape.prototype.move = function (key) {
      dir = Tetris.DIRS[key];
      var thisGrid = this.grid;
      var theseSquares = this.squares;
      var color = this.color;
      var nextY;
      var nextX;
      if (_.some(theseSquares, function(square, index) { // is any piece blocked?
          nextY = square[0] + dir[0];
          nextX = square[1] + dir[1];
          var subArray = theseSquares.slice();
          subArray.splice(index, 1);
          if (_.some(subArray, function(isSameSquare) {
              return isSameSquare.compare([nextY, nextX]);
            })) {
            return false; // shifted block was already part of shape
          } else if (nextY >= thisGrid.length || nextX < 0 || nextX >= thisGrid[0].length) {
            return true;
          } else if (thisGrid[nextY][nextX] !== " ") {
            return true;
          }
        })) {
        // something in the way
        return false;
      } else {
        // can move here;
        _.each(theseSquares, function(square) {
          thisGrid[square[0]][square[1]] = " ";
        });
        _.each(theseSquares, function(square) {
          square[0] += dir[0];
          square[1] += dir[1];
          thisGrid[square[0]][square[1]] = color;
        });
        this.origin[0] += dir[0];
        this.origin[1] += dir[1];
        return true;
      }
    };
    
		var gameOver = Tetris.gameOver = function(grid) {
			return _.some(grid[1], function(square) {
        return square !== " ";
      });
		};
    
		var Game = Tetris.Game = function () {
			this.grid = Game.newGrid();
      this.score = 0;
      this.level = 0;
		};

		Game.newGrid = function () {
			var newGrid = []
			for (var i = 0; i <= 21; i++) {
				var newRow = []
				for (var j = 0; j < 10; j ++) {
					newRow.push(" ");
				}
				newGrid.push(newRow);
			}
			return newGrid;
		};

    Game.prototype.clearRows = function() {
      var rowsCleared = 0;
      for (var i = this.grid.length - 1; i >= 2; i--) {
        var row = this.grid[i];
        that = this;
        if (_.every(row, function(square) {
            return (square !== " ");
          })) {
          that.shiftDown(i);
          i += 1;
          rowsCleared++;
        }
      }
      this.level += rowsCleared;
      this.score += Tetris.ROW_VALUES[rowsCleared];
    };
    
    Game.prototype.shiftDown = function(rowIndex) {
      for (var i = rowIndex; i >= 2; i--) {
        this.grid[i] = this.grid[i-1].slice();
      }
    }

		Game.prototype.render = function () {
			var renderGrid = []
			for (var i = 2; i < this.grid.length; i++) {
				var row = this.grid[i].join("");
				renderGrid.push(row);
			}
			return renderGrid.join("\n");
		};

	})(this);
});