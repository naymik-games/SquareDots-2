let game;



window.onload = function () {
  let gameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 900,
      height: 1640
    },

    scene: [preloadGame, startGame, playGame, UI]
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
}
/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////
class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }
  preload() {
    this.load.spritesheet("gems", "assets/sprites/gems.png", {
      frameWidth: gameOptions.gemSize,
      frameHeight: gameOptions.gemSize
    });
    this.load.spritesheet("arrows", "assets/sprites/arrows.png", {
      frameWidth: gameOptions.gemSize * 3,
      frameHeight: gameOptions.gemSize * 3
    });
  }
  create() {
    levelSettings = {
      items: 6,
      cols: 7,
      rows: 8,
      allowWild: false,
      allowGems: false,
      allowGolden: false,
      allowRover: true
    }

    tally = {
      red: 0,
      blue: 0,
      orange: 0,
      green: 0,
      purple: 0,
      brown: 0,
      gold: 0,
      square: 0,
      gem: 0
    }
    this.canPick = true;
    this.square = false;
    this.dragging = false;
    this.doCross = false;


    //temp ui
    this.squareText = this.add.bitmapText(50, 1500, 'topaz', 'SV 0', 40).setOrigin(0, .5).setTint(0xcbf7ff).setAlpha(1);




    this.draw3 = new Draw3({
      rows: levelSettings.rows,
      columns: levelSettings.cols,
      items: levelSettings.items
    });
    this.draw3.generateField();
    this.drawField();
    this.input.on("pointerdown", this.gemSelect, this);
    this.input.on("pointermove", this.drawPath, this);
    this.input.on("pointerup", function () {
      this.removeGems(2)
    }, this);
  }
  drawField() {
    this.poolArray = [];
    this.arrowArray = [];
    for (let i = 0; i < this.draw3.getRows(); i++) {
      this.arrowArray[i] = [];
      for (let j = 0; j < this.draw3.getColumns(); j++) {
        let gem;
        let posX = gameOptions.boardOffset.x + gameOptions.gemSize * j + gameOptions.gemSize / 2;
        let posY = gameOptions.boardOffset.y + gameOptions.gemSize * i + gameOptions.gemSize / 2
        if (this.draw3.isRover(i, j)) {
          console.log(i + ',' + j + 'val ' + this.draw3.roverValueAt(i, j))
          gem = this.add.sprite(posX, posY, "gems", this.draw3.roverValueAt(i, j));
        } else {
          gem = this.add.sprite(posX, posY, "gems", this.draw3.valueAt(i, j));
        }

        let arrow = this.add.sprite(posX, posY, "arrows");
        arrow.setDepth(2);
        arrow.visible = false;
        this.arrowArray[i][j] = arrow;
        this.draw3.setCustomData(i, j, gem);
      }
    }
  }
  gemSelect(pointer) {
    this.square = false;
    this.moveValue = null
    if (this.canPick) {
      let row = Math.floor((pointer.y - gameOptions.boardOffset.y) / gameOptions.gemSize);
      let col = Math.floor((pointer.x - gameOptions.boardOffset.x) / gameOptions.gemSize);
      if (this.draw3.validPick(row, col)) {
        if (this.draw3.checkNonSelect(row, col)) { return }
        this.canPick = false;
        this.draw3.putInChain(row, col, this.draw3.valueAt(row, col), this.draw3.roverValueAt(row, col))

        this.draw3.customDataOf(row, col).alpha = 0.5;
        this.draw3.customDataOf(row, col).setScale(.8)
        this.dragging = true;
      }
    }
  }
  drawPath(pointer) {
    if (this.dragging) {
      let row = Math.floor((pointer.y - gameOptions.boardOffset.y) / gameOptions.gemSize);
      let col = Math.floor((pointer.x - gameOptions.boardOffset.x) / gameOptions.gemSize);
      if (this.draw3.checkNonSelect(row, col)) { return }
      if (this.draw3.validPick(row, col)) {
        let distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.draw3.customDataOf(row, col).x, this.draw3.customDataOf(row, col).y);
        if (distance < gameOptions.gemSize * 0.4) {
          if (this.draw3.continuesChain(row, col)) {
            this.draw3.customDataOf(row, col).alpha = 0.5;
            this.draw3.customDataOf(row, col).setScale(.8)
            this.draw3.putInChain(row, col, this.draw3.valueAt(row, col), this.draw3.roverValueAt(row, col));
            this.displayPath()
          } else {
            if (this.draw3.backtracksChain(row, col)) {
              let removedItem = this.draw3.removeLastChainItem();
              this.draw3.customDataOf(removedItem.row, removedItem.column).alpha = 1;
              this.draw3.customDataOf(removedItem.row, removedItem.column).setScale(1)
              this.hidePath();
              this.displayPath();
            } else if (!this.square && this.draw3.makesSquare(row, col)) {
              this.square = true
              console.log('square')
              //this.displayPath(this.square)
              this.draw3.addSquareToChain()
              let chain = this.draw3.getChain();
              chain.forEach(function (item) {
                this.draw3.customDataOf(item.row, item.column).alpha = .5;
                this.draw3.customDataOf(item.row, item.column).setScale(.8)
              }.bind(this));
              //
            }
          }
        }
      }
    }
  }
  removeGems(min) {
    //console.log(min)
    if (this.dragging) {
      this.hidePath();
      this.dragging = false;
      if (this.draw3.getChainLength() < min) {
        let chain = this.draw3.emptyChain();
        chain.forEach(function (item) {
          this.draw3.customDataOf(item.row, item.column).alpha = 1;
          this.draw3.customDataOf(item.row, item.column).setScale(1)
        }.bind(this));
        this.canPick = true;
      }
      else {
        this.moveValue = this.draw3.getChainValue()
        let gemsToRemove = this.draw3.destroyChain();
        //console.log(gemsToRemove)
        this.doTally(gemsToRemove)
        //console.log(tally)
        //do tally with gems to remove
        let destroyed = 0;
        gemsToRemove.forEach(function (gem) {
          this.poolArray.push(this.draw3.customDataOf(gem.row, gem.column))
          destroyed++;
          this.tweens.add({
            targets: this.draw3.customDataOf(gem.row, gem.column),
            alpha: 0,
            duration: gameOptions.destroySpeed,
            callbackScope: this,
            onComplete: function (event, sprite) {
              destroyed--;
              if (destroyed == 0) {
                this.makeGemsFall();
              }
            }
          });
        }.bind(this));
      }
    }
  }
  makeGemsFall() {
    let moved = 0;
    let fallingMovements = this.draw3.arrangeBoardAfterChain();
    fallingMovements.forEach(function (movement) {
      moved++;
      this.tweens.add({
        targets: this.draw3.customDataOf(movement.row, movement.column),
        y: this.draw3.customDataOf(movement.row, movement.column).y + movement.deltaRow * gameOptions.gemSize,
        duration: gameOptions.fallSpeed * Math.abs(movement.deltaRow),
        callbackScope: this,
        onComplete: function () {
          moved--;
          if (moved == 0) {
            this.canPick = true;
          }
        }
      })
    }.bind(this));
    let replenishMovements = this.draw3.replenishBoard(this.square, this.moveValue);
    replenishMovements.forEach(function (movement) {
      moved++;
      let sprite = this.poolArray.pop();
      sprite.alpha = 1;
      sprite.setScale(1)
      sprite.y = gameOptions.boardOffset.y + gameOptions.gemSize * (movement.row - movement.deltaRow + 1) - gameOptions.gemSize / 2;
      sprite.x = gameOptions.boardOffset.x + gameOptions.gemSize * movement.column + gameOptions.gemSize / 2,
        sprite.setFrame(this.draw3.valueAt(movement.row, movement.column));
      this.draw3.setCustomData(movement.row, movement.column, sprite);
      this.tweens.add({
        targets: sprite,
        y: gameOptions.boardOffset.y + gameOptions.gemSize * movement.row + gameOptions.gemSize / 2,
        duration: gameOptions.fallSpeed * movement.deltaRow,
        callbackScope: this,
        onComplete: function () {
          moved--;
          if (moved == 0) {
            if (this.gemCheck()) {

              this.dragging = true;
              //console.log(this.draw3.getChainLength())
              //this.draw3.putColInChain(3)
              //this.draw3.putRowInChain(3)
              //this.draw3.putCrossInChain(3, 3)
              this.removeGems(2)
            } else if (this.goldenCheck()) {
              this.dragging = true;
              this.removeGems(1)
            } else {
              this.canPick = true;
              this.dragging = false;
            }
            // 



          }
        }
      });
    }.bind(this))
  }
  removeGemsSpecial() {

  }
  goldenCheck() {
    let result = false
    for (let j = 0; j < this.draw3.getColumns(); j++) {
      if (goldenValue == this.draw3.valueAt(this.draw3.getRows() - 1, j)) {

        // this.draw3.customDataOf(this.draw3.getRows()-1, j).alpha = .5;
        //this.draw3.customDataOf(this.draw3.getRows()-1, j).setScale(.5);
        this.draw3.putInChain(this.draw3.getRows() - 1, j, goldenValue);
        result = true
      }
    }
    //console.log(result)
    return result
  }
  gemCheck() {
    if (!this.square) { return false }
    let result = false
    // console.log('move val ' + this.moveValue)
    for (let i = 0; i < this.draw3.getRows(); i++) {
      for (let j = 0; j < this.draw3.getColumns(); j++) {
        if (this.draw3.valueAt(i, j) == gemValues[this.moveValue]) {
          //console.log(i + ',' + j)
          this.draw3.putCrossInChain(i, j)
          tally.gem++
          result = true
        }
      }
    }
    return result
  }
  doTally(gems) {
    gems.forEach(function (item) {
      if (item.value == 0) {
        tally.red++
      } else if (item.value == 1) {
        tally.blue++
      } else if (item.value == 2) {
        tally.orange++
      } else if (item.value == 3) {
        tally.green++
      } else if (item.value == 4) {
        tally.purple++
      } else if (item.value == 5) {
        tally.brown++
      } else if (item.value == goldenValue) {
        tally.gold++
      }
    })
    if (this.square) {
      //this.squareText.setText(this.moveValue)

      tally.square++
    }
    this.printTally()
  }
  printTally() {
    var text = ''
    text += 'R ' + tally.red + ' '
    text += 'B ' + tally.blue + ' '
    text += 'O ' + tally.orange + ' '
    text += 'G ' + tally.green + ' '
    text += 'P ' + tally.purple + ' '
    text += 'B ' + tally.brown + '\n '
    text += 'S ' + tally.square + ' '
    text += 'Go ' + tally.gold + ' '
    text += 'Ge ' + tally.gem + ' '
    this.squareText.setText(text)
  }
  displayPath() {
    let path = this.draw3.getPath();
    path.forEach(function (item) {
      this.arrowArray[item.row][item.column].visible = true;
      if (!this.draw3.isDiagonal(item.direction)) {
        this.arrowArray[item.row][item.column].setFrame(0);
        this.arrowArray[item.row][item.column].angle = 90 * Math.log2(item.direction);
      }
      else {
        this.arrowArray[item.row][item.column].setFrame(1);
        this.arrowArray[item.row][item.column].angle = 90 * (item.direction - 9 + ((item.direction < 9) ? (item.direction / 3) - 1 - item.direction % 2 : 0));
      }
    }.bind(this))
  }
  hidePath() {
    this.arrowArray.forEach(function (item) {
      item.forEach(function (subItem) {
        subItem.visible = false;
        subItem.angle = 0;
      })
    })
  }
}