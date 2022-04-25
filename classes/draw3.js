let dirs = [{ r: -1, c: 0 }, { r: -1, c: 1 }, { r: 0, c: 1 }, { r: 1, c: 1 }, { r: 1, c: 0 }, { r: 1, c: -1 }, { r: 0, c: -1 }, { r: -1, c: -1 }]
let dirs4 = [{ r: -1, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 0 }, { r: 0, c: -1 }];
class Draw3 {

  // constructor, simply turns obj information into class properties and creates
  // an array called "chain" which will contain chain information
  constructor(obj) {
    if (obj == undefined) {
      obj = {}
    }
    this.rows = (obj.rows != undefined) ? obj.rows : 8;
    this.columns = (obj.columns != undefined) ? obj.columns : 7;
    this.items = (obj.items != undefined) ? obj.items : 6;
    this.chain = [];
    if (this.items == 2) {
      this.itemArray = [0, 1];
    } else if (this.items == 3) {
      this.itemArray = [0, 1, 2];
    } else if (this.items == 4) {
      this.itemArray = [0, 1, 2, 3];
    } else if (this.items == 5) {
      this.itemArray = [0, 1, 2, 3, 4];
    } else if (this.items == 6) {
      this.itemArray = [0, 1, 2, 3, 4, 5];
    }
  }

  // returns the number of rows in board
  getRows() {
    return this.rows;
  }

  // returns the number of columns in board
  getColumns() {
    return this.columns;
  }

  // generates the game field
  generateField() {
    this.gameArray = [];
    this.gameArrayExtra = []
    for (let i = 0; i < this.getRows(); i++) {
      this.gameArray[i] = [];
      this.gameArrayExtra[i] = [];
      for (let j = 0; j < this.getColumns(); j++) {
        //let randomValue = Math.floor(Math.random() * this.items);
        let randomValue
        var num = Phaser.Math.Between(1, 25)
        if (num == 1) {
          randomValue = wildValue
        } else if (num == 2) {
          randomValue = goldenValue
        } else {
          randomValue = Math.floor(Math.random() * this.items);
        }
        this.gameArray[i][j] = {
          value: null,
          isEmpty: false,
          roverValue: null,
          row: i,
          column: j
        }
        this.gameArrayExtra[i][j] = null
      }
    }
    if (levelSettings.allowWild) {
      this.addSpecial(3, wildValue)
    }
    if (levelSettings.allowFire) {
      this.addSpecial(3, fireValue)
    }
    if (levelSettings.allowGems) {
      this.addSpecial(2, 'gem')
    }
    if (levelSettings.allowGolden) {
      this.addSpecial(3, goldenValue)
    }
    if (levelSettings.allowRover) {
      this.addSpecial(3, 'rover')
    }
    if (levelSettings.blocks.length > 0) {
      this.addBlocks()
    }
    if (levelSettings.allowIce) {
      this.addIce(3)
    }
    if (levelSettings.allowBomb) {
      this.addBomb(3)
    }
    this.fillValues()
    //console.log(this.gameArrayExtra)
  }
  addSpecial(count, value) {

    var i = 0
    while (i < count) {
      var row = Phaser.Math.Between(0, this.getRows() - 2)
      var col = Phaser.Math.Between(0, this.getColumns() - 1)

      if (this.valueAt(row, col) == null) {
        if (value == 'gem') {
          var num = Phaser.Math.Between(6, 5 + levelSettings.items)
          this.setValueAt(row, col, num)
        } else if (value == 'rover') {
          var num = Phaser.Math.Between(12, 11 + levelSettings.items)
          this.setValueAt(row, col, num - 12)
          this.setRoverValueAt(row, col, num)

        } else {
          this.setValueAt(row, col, value)
        }

        i++
      }
    }
  }
  addIce(count) {

    var i = 0
    while (i < count) {
      var row = Phaser.Math.Between(0, this.getRows() - 1)
      var col = Phaser.Math.Between(0, this.getColumns() - 1)

      if (this.extraEmpty(row, col)) {
        var ice = {
          value: iceValues[0],
          type: 'ice'
        }

        this.gameArrayExtra[row][col] = ice

        i++
      }
    }
  }
  addBomb(count) {

    var i = 0
    while (i < count) {
      var row = Phaser.Math.Between(0, this.getRows() - 1)
      var col = Phaser.Math.Between(0, this.getColumns() - 1)

      if (this.extraEmpty(row, col)) {
        var bomb = {
          value: bombValues[0],
          type: 'bomb'
        }

        this.gameArrayExtra[row][col] = bomb

        i++
      }
    }
  }
  addBlocks() {
    for (let x = 0; x < levelSettings.blocks.length; x++) {

      var j = levelSettings.blocks[x].col;
      var i = levelSettings.blocks[x].row;
      var block = {
        value: blockValue,
        type: 'block'
      }
      this.gameArrayExtra[i][j] = block
    }
  }
  fillValues() {
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        if (this.valueAt(i, j) == null) {
          let randomValue = Math.floor(Math.random() * this.items);
          this.setValueAt(i, j, randomValue)
        }

      }
    }
  }
  // returns true if the item at (row, column) is a valid pick
  validPick(row, column) {
    return row >= 0 && row < this.getRows() && column >= 0 && column < this.getColumns() && this.gameArray[row] != undefined && this.gameArray[row][column] != undefined;
  }

  // returns the value of the item at (row, column), or false if it's not a valid pick
  valueAt(row, column) {
    if (!this.validPick(row, column)) {
      return false;
    }
    return this.gameArray[row][column].value;
  }
  valueAtExtra(row, column) {
    if (!this.validPick(row, column)) {
      return false;
    }
    if (this.extraEmpty(row, column)) { return }
    return this.gameArrayExtra[row][column].value;
  }
  extraEmpty(row, column) {

    return this.gameArrayExtra[row][column] == null;
  }
  //rover value
  roverValueAt(row, column) {
    if (!this.validPick(row, column)) {
      return false;
    }
    return this.gameArray[row][column].roverValue;
  }
  //set the value for the item row, column
  setValueAt(row, column, value) {
    this.gameArray[row][column].value = value
  }
  setValueAtExtra(row, column, value) {
    if (this.extraEmpty(row, column)) { return }
    this.gameArrayExtra[row][column].value = value
  }
  //sets the rover value
  setRoverValueAt(row, column, value) {
    this.gameArray[row][column].roverValue = value
  }
  isRover(row, column) {
    return this.gameArray[row][column].roverValue != null
  }
  // sets a custom data of the item at (row, column)
  setCustomData(row, column, customData) {
    this.gameArray[row][column].customData = customData;
  }
  setCustomDataExtra(row, column, customData) {
    this.gameArrayExtra[row][column].customData = customData;
  }

  // returns the custom data of the item at (row, column)
  customDataOf(row, column) {
    return this.gameArray[row][column].customData;
  }
  customDataOfExtra(row, column) {
    return this.gameArrayExtra[row][column].customData;
  }
  // returns true if the item at (row, column) continues the chain
  continuesChain(row, column) {
    if (this.valueAt(this.getNthChainItem(0).row, this.getNthChainItem(0).column) == wildValue) {
      if (this.getChainLength() > 1) {
        return this.valueAt(this.getNthChainItem(1).row, this.getNthChainItem(1).column) == this.valueAt(row, column) && !this.isInChain(row, column) && this.areNext(row, column, this.getLastChainItem().row, this.getLastChainItem().column);
      } else {
        return !this.isInChain(row, column) && this.areNext(row, column, this.getLastChainItem().row, this.getLastChainItem().column);
      }
    } else {
      return (this.getChainValue() == this.valueAt(row, column) || this.valueAt(row, column) == wildValue) && !this.isInChain(row, column) && this.areNext(row, column, this.getLastChainItem().row, this.getLastChainItem().column)
    }

  }
  /*  continuesChain(row, column) {
     return this.getChainValue() == this.valueAt(row, column) && !this.isInChain(row, column) && this.areNext(row, column, this.getLastChainItem().row, this.getLastChainItem().column)
   } */
  //check for tiles that can't be selected
  checkNonSelect(row, column) {
    return this.valueAt(row, column) == goldenValue || this.valueAt(row, column) == fireValue || gemValues.indexOf(this.valueAt(row, column)) > -1 || this.valueAtExtra(row, column) == blockValue//|| this.valueAt(row, column) == 24 || this.valueAt(row, column) == 17 || this.valueAt(row, column) == 18 || this.valueAt(row, column) == 19 || this.valueAt(row, column) == 20 || this.valueAt(row, column) == 21 || this.valueAt(row, column) == 22 || this.valueAtExtra(row, column) == 31;
  }
  //makes square
  makesSquare(row, column) {
    if (this.chain.length <= 3) { return }
    return this.getChainValue() == this.valueAt(row, column) && this.isInChain(row, column) && row == this.chain[this.chain.length - 4].row && column == this.chain[this.chain.length - 4].column
  }
  // returns true if the item at (row, column) backtracks the chain
  backtracksChain(row, column) {
    return this.getChainLength() > 1 && this.areTheSame(row, column, this.getNthChainItem(this.getChainLength() - 2).row, this.getNthChainItem(this.getChainLength() - 2).column)
  }

  // returns the n-th chain item
  getNthChainItem(n) {
    return {
      row: this.chain[n].row,
      column: this.chain[n].column
    }
  }

  // returns the path connecting all items in chain, as an object containing row, column and direction
  getPath(isSquare) {
    let path = [];
    if (this.getChainLength() > 1) {
      for (let i = 1; i < this.getChainLength(); i++) {
        let deltaColumn = this.getNthChainItem(i).column - this.getNthChainItem(i - 1).column;
        let deltaRow = this.getNthChainItem(i).row - this.getNthChainItem(i - 1).row;
        let direction = 0
        direction += (deltaColumn < 0) ? Draw3.LEFT : ((deltaColumn > 0) ? Draw3.RIGHT : 0);
        direction += (deltaRow < 0) ? Draw3.UP : ((deltaRow > 0) ? Draw3.DOWN : 0);
        path.push({
          row: this.getNthChainItem(i - 1).row,
          column: this.getNthChainItem(i - 1).column,
          direction: direction
        });

      }
      if (isSquare) {
        let deltaColumn = this.getNthChainItem(this.getChainLength - 4).column - this.getNthChainItem(this.getChainLength - 1).column;
        let deltaRow = this.getNthChainItem(this.getChainLength - 4).row - this.getNthChainItem(this.getChainLength - 1).row;
        let direction = 0
        direction += (deltaColumn < 0) ? Draw3.LEFT : ((deltaColumn > 0) ? Draw3.RIGHT : 0);
        direction += (deltaRow < 0) ? Draw3.UP : ((deltaRow > 0) ? Draw3.DOWN : 0);
        path.push({
          row: this.getNthChainItem(this.getChainLength - 4).row,
          column: this.getNthChainItem(this.getChainLength - 4).column,
          direction: direction
        });
      }
    }
    return path;
  }

  // returns an array with basic directions (UP, DOWN, LEFT, RIGHT) given a direction
  getDirections(n) {
    let result = [];
    let base = 1;
    while (base <= n) {
      if (base & n) {
        result.push(base);
      }
      base <<= 1;
    }
    return result;
  }
  //returns array of valid neighbor coord
  getNeighbors(row, column) {
    var result = []
    for (var i = 0; i < 8; i++) {
      var nR = row + dirs[i].r
      var nC = column + dirs[i].c
      if (this.validPick(nR, nC)) {
        result.push({ row: nR, col: nC })
      }
    }
    return result
  }
  // returns true if the number represents a diagonal movement
  isDiagonal(n) {
    return this.getDirections(n).length == 2;
  }

  // returns the last chain item
  getLastChainItem() {
    return this.getNthChainItem(this.getChainLength() - 1);
  }

  // returns chain length
  getChainLength() {
    return this.chain.length;
  }

  // returns true if the item at (row, column) is in the chain
  isInChain(row, column) {
    for (let i = 0; i < this.getChainLength(); i++) {
      let item = this.getNthChainItem(i)
      if (this.areTheSame(row, column, item.row, item.column)) {
        return true;
      }
    }
    return false;
  }

  // returns the value of items in the chain
  getChainValue() {
    return this.valueAt(this.getNthChainItem(0).row, this.getNthChainItem(0).column)
  }
  addSquareToChain() {
    var squareVal = this.getChainValue()
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        if (this.valueAt(i, j) == squareVal && !this.isInChain(i, j)) {
          this.putInChain(i, j, this.valueAt(i, j), this.roverValueAt(i, j))
        }

      }
    }
  }
  // puts the item at (row, column) in the chain
  putInChain(row, column, value, rValue) {
    this.chain.push({
      row: row,
      column: column,
      value: value,
      roverValue: rValue
    })
  }
  putCrossInChain(row, column) {
    this.putColInChain(column)
    this.putRowInChain(row)
  }
  putColInChain(column) {
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        if (j == column && !this.isInChain(i, j)) {
          this.putInChain(i, j, this.valueAt(i, j), this.roverValueAt(i, j))
          this.customDataOf(i, j).setScale(.8)
        }

      }
    }
  }
  putRowInChain(row) {
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        if (i == row && !this.isInChain(i, j)) {
          this.putInChain(i, j, this.valueAt(i, j), this.roverValueAt(i, j))
          this.customDataOf(i, j).setScale(.8)
        }

      }
    }
  }
  // removes the last chain item and returns it
  removeLastChainItem() {
    return this.chain.pop();
  }

  // clears the chain and returns the items
  emptyChain() {
    let result = [];
    this.chain.forEach(function (item) {
      result.push(item);
    })
    this.chain = [];
    this.chain.length = 0;
    return result;
  }
  getChain() {
    let result = [];
    this.chain.forEach(function (item) {
      result.push(item);
    })

    return result;
  }
  // clears the chain, set items as empty and returns the items
  destroyChain() {

    let result = [];
    this.chain.forEach(function (item) {
      // if (item.roverValue == null) {
      result.push(item);
      this.setEmpty(item.row, item.column)
      //   }

    }.bind(this))
    this.chain = [];
    this.chain.length = 0;
    return result;
  }

  // checks if the items at (row, column) and (row2, column2) are the same
  areTheSame(row, column, row2, column2) {
    return row == row2 && column == column2;
  }

  // returns true if two items at (row, column) and (row2, column2) are next to each other horizontally, vertically or diagonally
  areNext(row, column, row2, column2) {
    //diangonal
    //return (Math.abs(column - column2) <= 1) && (Math.abs(row - row2) <= 1);
    //normal
    return (Math.abs(column - column2) == 1 && row - row2 == 0) || (Math.abs(row - row2) == 1 && column - column2 == 0);

    //return (Math.abs(row - row2) + Math.abs(column - column2) == 1) || (Math.abs(row - row2) == 1 && Math.abs(column - column2) == 1);
  }

  // swap the items at (row, column) and (row2, column2) and returns an object with movement information
  swapItems(row, column, row2, column2) {
    let tempObject = Object.assign(this.gameArray[row][column]);
    this.gameArray[row][column] = Object.assign(this.gameArray[row2][column2]);
    this.gameArray[row2][column2] = Object.assign(tempObject);
    return [{
      row: row,
      column: column,
      deltaRow: row - row2,
      deltaColumn: column - column2
    },
    {
      row: row2,
      column: column2,
      deltaRow: row2 - row,
      deltaColumn: column2 - column
    }]
  }

  // set the item at (row, column) as empty
  setEmpty(row, column) {
    this.gameArray[row][column].isEmpty = true;
  }
  setEmptyExtra(row, column) {
    this.gameArrayExtra[row][column] = null;
  }
  // returns true if the item at (row, column) is empty
  isEmpty(row, column) {
    return this.gameArray[row][column].isEmpty;
  }

  // returns the amount of empty spaces below the item at (row, column)
  emptySpacesBelow(row, column) {
    let result = 0;
    if (row != this.getRows()) {
      for (let i = row + 1; i < this.getRows(); i++) {
        if (this.isEmpty(i, column)) {
          result++;
        }
      }
    }
    return result;
  }

  // arranges the board after a chain, making items fall down. Returns an object with movement information
  arrangeBoardAfterChain() {
    let result = []
    for (let i = this.getRows() - 2; i >= 0; i--) {
      for (let j = 0; j < this.getColumns(); j++) {
        let emptySpaces = this.emptySpacesBelow(i, j);
        if (!this.isEmpty(i, j) && emptySpaces > 0) {
          this.swapItems(i, j, i + emptySpaces, j)
          result.push({
            row: i + emptySpaces,
            column: j,
            deltaRow: emptySpaces,
            deltaColumn: 0
          });
        }
      }
    }
    return result;
  }
  //

  // replenishes the board and returns an object with movement information
  replenishBoard(isSquare, chainVal) {
    let randomValue
    let result = [];
    for (let i = 0; i < this.getColumns(); i++) {
      if (this.isEmpty(0, i)) {
        let emptySpaces = this.emptySpacesBelow(0, i) + 1;
        for (let j = 0; j < emptySpaces; j++) {
          if (isSquare) {
            randomValue = this.getRandomWithOneExclusion(this.itemArray.length, chainVal)
          } else {
            randomValue = Math.round(Math.random() * (this.itemArray.length - 1));
          }

          result.push({
            row: j,
            column: i,
            deltaRow: emptySpaces,
            deltaColumn: 0
          });
          this.gameArray[j][i].value = randomValue;
          this.gameArray[j][i].roverValue = -1;
          this.gameArray[j][i].isEmpty = false;

        }
      }
    }
    if (levelSettings.allowGolden) {
      if (Phaser.Math.Between(1, 100) < 25) {
        var go = false
        while (!go) {
          var tile = result[Phaser.Math.Between(0, result.length - 1)]
          if (this.gameArray[tile.row][tile.column].value < levelSettings.items - 1) {
            go = true
          }
        }
        this.gameArray[tile.row][tile.column].value = goldenValue
      }
    }
    if (levelSettings.allowWild) {
      if (Phaser.Math.Between(1, 100) < 25) {
        var go = false
        while (!go) {
          var tile = result[Phaser.Math.Between(0, result.length - 1)]
          if (this.gameArray[tile.row][tile.column].value < levelSettings.items - 1) {
            go = true
          }
        }
        this.gameArray[tile.row][tile.column].value = wildValue
      }
    }
    if (levelSettings.allowGems) {
      if (Phaser.Math.Between(1, 100) < 25) {
        var go = false
        while (!go) {
          var tile = result[Phaser.Math.Between(0, result.length - 1)]
          if (this.gameArray[tile.row][tile.column].value < levelSettings.items - 1) {
            go = true
          }
        }
        this.gameArray[tile.row][tile.column].value = gemValues[levelSettings.items - 1]
      }
    }
    return result;
  }
  getRandomWithOneExclusion(lengthOfArray, indexToExclude) {

    var rand = null; //an integer

    while (rand === null || rand === indexToExclude) {
      rand = Math.round(Math.random() * (lengthOfArray - 1));
    }

    return rand;
  }
  isNeighborFire(row, column) {
    var result = [];
    for (var n = 0; n < 4; n++) {
      var rand = Phaser.Math.Between(0, levelSettings.items - 1)
      if (this.validPick(row + dirs4[n].r, column + dirs4[n].c) && this.valueAt(row + dirs4[n].r, column + dirs4[n].c) == fireValue) {
        this.gameArray[row + dirs4[n].r][column + dirs4[n].c].customData.setFrame(rand)
        this.gameArray[row + dirs4[n].r][column + dirs4[n].c].value = rand;

        result.push({ r: row + dirs4[n].r, c: column + dirs4[n].c })
      }
    }
    if (result.length > 0) {
      return true;
    }
  }
}
Draw3.RIGHT = 1;
Draw3.DOWN = 2;
Draw3.LEFT = 4;
Draw3.UP = 8;
