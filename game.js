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


    scene: [preloadGame, startGame, selectGame, playGame, preview, endGame, UI]
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
    this.cameras.main.fadeIn(800, 0, 0, 0);
    var bgc = Phaser.Math.Between(0, bgColors.length - 1)
    this.cameras.main.setBackgroundColor(bgColors[bgc]);

    var rand = Phaser.Math.Between(0, backs.length - 1)
    var back = this.add.image(0, 0, backs[rand]).setOrigin(0)
    back.displayWidth = game.config.width;
    back.displayHeight = game.config.height;



    var xOffset = (game.config.width - (levelSettings.cols * gameOptions.gemSize)) / 2
    gameOptions.boardOffset.x = xOffset
    tally = {
      red: 0,
      blue: 0,
      orange: 0,
      green: 0,
      purple: 0,
      brown: 0,
      gold: 0,
      square: 0,
      gem: 0,
      ice: 0,
      bomb: 0,
      moves: 0,
      dots: 0
    }
    this.canPick = true;
    this.square = false;
    this.dragging = false;
    this.doCross = false;
    this.stopFire = false;
    this.bombCleared = false;

    //temp ui
    this.squareText = this.add.bitmapText(50, 1500, 'topaz', 'SV 0', 40).setOrigin(0, .5).setTint(0xcbf7ff).setAlpha(1);




    this.draw3 = new Draw3({
      rows: levelSettings.rows,
      columns: levelSettings.cols,
      items: levelSettings.items
    });
    this.draw3.generateField();
    this.drawField();
    this.drawFieldExtra()
    this.input.on("pointerdown", this.gemSelect, this);
    this.input.on("pointermove", this.drawPath, this);
    this.input.on("pointerup", this.endDrag, this);
    /* this.input.on("pointerup", function () {
      this.removeGems(2)
    }, this); */
    const config1 = {
      key: 'burst1',
      frames: 'burst',
      frameRate: 20,
      repeat: 0
    };
    this.anims.create(config1);
    this.bursts = this.add.group({
      defaultKey: 'burst',
      maxSize: 30
    });

    const config2 = {
      key: 'flames1',
      frames: 'flames',
      frameRate: 20,
      repeat: -1
    };
    this.anims.create(config2);
    this.flames = this.add.group({
      defaultKey: 'flames',
      maxSize: 30
    });

    this.makeMenu()
    //this.burst = this.add.sprite(200, 300, 'burst').setScale(3);
  }
  drawField() {
    this.poolArray = [];
    this.arrowArray = [];
    var count = 0
    for (let i = 0; i < this.draw3.getRows(); i++) {
      this.arrowArray[i] = [];
      for (let j = 0; j < this.draw3.getColumns(); j++) {
        let gem;
        let posX = gameOptions.boardOffset.x + gameOptions.gemSize * j + gameOptions.gemSize / 2;
        let posY = gameOptions.boardOffset.y + gameOptions.gemSize * i + gameOptions.gemSize / 2
        if (this.draw3.isRover(i, j)) {
          console.log(i + ',' + j + 'val ' + this.draw3.roverValueAt(i, j))
          gem = this.add.sprite(posX, -50, "gems", this.draw3.roverValueAt(i, j));
        } else if (this.draw3.valueAt(i, j) == fireValue) {
          gem = this.add.sprite(posX, -50, "flames", 0);
          //gem = this.flames.get().setActive(true);
          // gem.setPosition(posX, -50)
          //gem.play('flames1');
        } else {
          gem = this.add.sprite(posX, -50, "gems", this.draw3.valueAt(i, j));
        }

        let arrow = this.add.sprite(posX, posY, "arrows");
        arrow.setDepth(2);
        arrow.visible = false;
        this.arrowArray[i][j] = arrow;
        this.draw3.setCustomData(i, j, gem);
        var tween = this.tweens.add({
          targets: gem,
          y: posY,
          duration: 250,
          ease: 'Quad.easeIn',
          delay: 25 * count
        })
        count++
      }
    }

  }
  drawFieldExtra() {
    var count = 0;
    for (let i = 0; i < this.draw3.getRows(); i++) {
      for (let j = 0; j < this.draw3.getColumns(); j++) {
        if (this.draw3.valueAtExtra(i, j) == blockValue) {
          let gem;
          let posX = gameOptions.boardOffset.x + gameOptions.gemSize * j + gameOptions.gemSize / 2;
          let posY = gameOptions.boardOffset.y + gameOptions.gemSize * i + gameOptions.gemSize / 2
          gem = this.add.sprite(posX, -50, "gems", this.draw3.valueAtExtra(i, j)).setDepth(4);
          this.draw3.setCustomDataExtra(i, j, gem)
          var tween = this.tweens.add({
            targets: gem,
            y: posY,
            duration: 1000,
            ease: 'Quad.easeIn',
            delay: 150 * count
          })
          count++
        } else if (this.draw3.valueAtExtra(i, j) == iceValues[0]) {
          let gem;
          let posX = gameOptions.boardOffset.x + gameOptions.gemSize * j + gameOptions.gemSize / 2;
          let posY = gameOptions.boardOffset.y + gameOptions.gemSize * i + gameOptions.gemSize / 2
          gem = this.add.sprite(posX, -50, "gems", this.draw3.valueAtExtra(i, j)).setDepth(4);
          this.draw3.setCustomDataExtra(i, j, gem)
          var tween = this.tweens.add({
            targets: gem,
            y: posY,
            duration: 1000,
            ease: 'Quad.easeIn',
            delay: 150 * count
          })
          count++
        } else if (this.draw3.valueAtExtra(i, j) == bombValues[0]) {
          let gem;
          let posX = gameOptions.boardOffset.x + gameOptions.gemSize * j + gameOptions.gemSize / 2;
          let posY = gameOptions.boardOffset.y + gameOptions.gemSize * i + gameOptions.gemSize / 2
          gem = this.add.sprite(posX, -50, "gems", this.draw3.valueAtExtra(i, j)).setDepth(4);
          this.draw3.setCustomDataExtra(i, j, gem)
          var tween = this.tweens.add({
            targets: gem,
            y: posY,
            duration: 1000,
            ease: 'Quad.easeIn',
            delay: 150 * count
          })
          count++
        } else if (levelSettings.blocks.length > 0) {
          //console.log('do blocks')
        }
      }
    }
  }
  gemSelect(pointer) {
    this.square = false;
    this.moveValue = null
    this.stopFire = false;
    this.bombCleared = false;
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
  endDrag() {
    if (this.draw3.getChainLength() < 2) {

    } else {
      tally.moves++

    }
    this.removeGems(2)
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
          if (this.draw3.isNeighborFire(gem.row, gem.column)) {
            this.stopFire = true
          }
          if (this.draw3.customDataOf(gem.row, gem.column).texture.key == 'flames') {
            this.draw3.customDataOf(gem.row, gem.column).setTexture('gems', 0)
          }
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
              // this.burst.play('burst1')
              this.dragging = true;
              //console.log(this.draw3.getChainLength())
              //this.draw3.putColInChain(3)
              //this.draw3.putRowInChain(3)
              //this.draw3.putCrossInChain(3, 3)
              this.removeGems(2)
            } else if (this.bombCleared) {
              this.dragging = true;
              this.removeGems(1)
            } else if (this.goldenCheck()) {
              this.dragging = true;
              this.removeGems(1)
            } else if (levelSettings.allowFire && !this.stopFire) {
              this.growFire()
              this.canPick = true;
              this.dragging = false;
            } else {
              this.canPick = true;
              this.dragging = false;
              this.events.emit('moves', { moves: tally.moves })
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
          // Get the first explosion, and activate it.
          var explosion = this.bursts.get().setActive(true);

          // Place the explosion on the screen, and play the animation.
          explosion.setOrigin(0.5, 0.5).setScale(3);
          explosion.x = this.draw3.customDataOf(i, j).x;
          explosion.y = this.draw3.customDataOf(i, j).y;
          explosion.play('burst1');
          explosion.on('animationcomplete', function () {
            explosion.setActive(false);
          }, this);
          tally.gem++
          result = true
        }
      }
    }
    return result
  }
  growFire() {
    var results = []
    for (let i = 0; i < this.draw3.getRows(); i++) {
      for (let j = 0; j < this.draw3.getColumns(); j++) {
        if (this.draw3.valueAt(i, j) == fireValue) {
          results.push({ r: i, c: j })
        }
        // this.draw3.customDataOf(i, j).setAlpha(.2)


      }
    }


    if (results.length > 0) {
      for (var r = 0; r < results.length; r++) {
        var neighbors = this.draw3.getNeighbors(results[r].r, results[r].c)
        if (neighbors.length > 0) {
          var tile = neighbors[Phaser.Math.Between(0, neighbors.length - 1)]
          this.draw3.setValueAt(tile.row, tile.col, fireValue)
          this.draw3.customDataOf(tile.row, tile.col).setTexture('flames')
          console.log('grow fire')
          var tween = this.tweens.add({
            targets: this.draw3.customDataOf(tile.row, tile.col),
            alpha: 0,
            duration: 200,
            yoyo: true,
          })
        }

      }


    }






  }
  doTally(gems) {
    var totalDotsThisMove = 0
    gems.forEach(function (item) {
      if (levelSettings.allowIce) {
        var val = this.draw3.valueAtExtra(item.row, item.column)
        if (val == iceValues[0]) {
          //set to next
          this.draw3.setValueAtExtra(item.row, item.column, iceValues[1])
          this.draw3.customDataOfExtra(item.row, item.column).setFrame(iceValues[1])
        } else if (val == iceValues[1]) {
          // set to next
          this.draw3.setValueAtExtra(item.row, item.column, iceValues[2])
          this.draw3.customDataOfExtra(item.row, item.column).setFrame(iceValues[2])
        } else if (val == iceValues[2]) {
          // delete
          var tween = this.tweens.add({
            targets: this.draw3.customDataOfExtra(item.row, item.column),
            y: -50,
            duration: 200,
            onCompleteScope: this,
            onComplete: function () {
              this.draw3.setEmptyExtra(item.row, item.column)
            }
          })
          tally.ice++
          //this.draw3.setEmptyExtra(item.row, item.column)
        }
      }
      if (levelSettings.allowBomb) {
        var val = this.draw3.valueAtExtra(item.row, item.column)
        if (val == bombValues[0]) {
          //set to next
          this.draw3.setValueAtExtra(item.row, item.column, bombValues[1])
          this.draw3.customDataOfExtra(item.row, item.column).setFrame(bombValues[1])
        } else if (val == bombValues[1]) {
          // set to next
          this.draw3.setValueAtExtra(item.row, item.column, bombValues[2])
          this.draw3.customDataOfExtra(item.row, item.column).setFrame(bombValues[2])
        } else if (val == bombValues[2]) {
          // delete
          this.explodeBomb(item.row, item.column)
          var tween = this.tweens.add({
            targets: this.draw3.customDataOfExtra(item.row, item.column),
            y: -50,
            duration: 200,
            onCompleteScope: this,
            onComplete: function () {
              this.draw3.setEmptyExtra(item.row, item.column)
            }
          })
          tally.bomb++
          //this.draw3.setEmptyExtra(item.row, item.column)
        }
      }

      if (item.value == 0) {
        tally.red++
        totalDotsThisMove++
      } else if (item.value == 1) {
        tally.blue++
        totalDotsThisMove++
      } else if (item.value == 2) {
        tally.orange++
        totalDotsThisMove++
      } else if (item.value == 3) {
        tally.green++
        totalDotsThisMove++
      } else if (item.value == 4) {
        tally.purple++
        totalDotsThisMove++
      } else if (item.value == 5) {
        tally.brown++
        totalDotsThisMove++
      } else if (item.value == goldenValue) {
        tally.gold++
      }
    }.bind(this))
    if (this.square) {
      //this.squareText.setText(this.moveValue)

      tally.square++
    }
    tally.dots += totalDotsThisMove
    this.events.emit('dots', { dots: tally.dots });
    this.events.emit('tally')
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
    text += 'I ' + tally.ice + ' '
    text += 'Bo ' + tally.bomb + ' '
    text += 'M ' + tally.moves + ' '
    text += 'D ' + tally.dots + ' '
    this.squareText.setText(text)
  }
  explodeBomb(row, col) {
    // Get the first explosion, and activate it.
    var explosion = this.bursts.get().setActive(true);

    // Place the explosion on the screen, and play the animation.
    explosion.setOrigin(0.5, 0.5).setScale(3);
    explosion.x = this.draw3.customDataOf(row, col).x;
    explosion.y = this.draw3.customDataOf(row, col).y;
    explosion.play('burst1');
    explosion.on('animationcomplete', function () {
      explosion.setActive(false);
    }, this);

    this.bombCleared = true
    var neighbors = this.draw3.getNeighbors(row, col)
    console.log(neighbors)
    if (neighbors.length > 0) {
      this.draw3.putInChain(row, col)
      for (var n = 0; n < neighbors.length; n++) {
        this.draw3.putInChain(neighbors[n].row, neighbors[n].col)
      }
    }
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
  toggleMenu() {

    if (this.menuGroup.y == 0) {
      var menuTween = this.tweens.add({
        targets: this.menuGroup,
        y: -270,
        duration: 500,
        ease: 'Bounce'
      })

    }
    if (this.menuGroup.y == -270) {
      var menuTween = this.tweens.add({
        targets: this.menuGroup,
        y: 0,
        duration: 500,
        ease: 'Bounce'
      })
    }
  }
  makeMenu() {
    ////////menu
    this.menuGroup = this.add.container().setDepth(5);
    var menuBG = this.add.image(game.config.width / 2, game.config.height - 85, 'blank').setOrigin(.5, 0).setTint(0x333333).setAlpha(.8)
    menuBG.displayWidth = 300;
    menuBG.displayHeight = 600
    this.menuGroup.add(menuBG)
    var menuButton = this.add.image(game.config.width / 2, game.config.height - 40, "menu").setInteractive().setDepth(3);
    menuButton.on('pointerdown', this.toggleMenu, this)
    menuButton.setOrigin(0.5);
    this.menuGroup.add(menuButton);
    var homeButton = this.add.bitmapText(game.config.width / 2, game.config.height + 50, 'topaz', 'HOME', 50).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
    homeButton.on('pointerdown', function () {
      this.scene.stop()
      this.scene.stop('UI')
      this.scene.start('startGame')
    }, this)
    this.menuGroup.add(homeButton);
    var wordButton = this.add.bitmapText(game.config.width / 2, game.config.height + 140, 'topaz', 'WORDS', 50).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
    wordButton.on('pointerdown', function () {
      var data = {
        yesWords: this.foundWords,
        noWords: this.notWords
      }
      this.scene.pause()
      //this.scene.launch('wordsPlayed', data)
    }, this)
    this.menuGroup.add(wordButton);
    var helpButton = this.add.bitmapText(game.config.width / 2, game.config.height + 230, 'topaz', 'RESTART', 50).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
    helpButton.on('pointerdown', function () {

      this.scene.start('UI')
      this.scene.start('PlayGame')
    }, this)
    this.menuGroup.add(helpButton);
    //var thankYou = game.add.button(game.config.width / 2, game.config.height + 130, "thankyou", function(){});
    // thankYou.setOrigin(0.5);
    // menuGroup.add(thankYou);    
    ////////end menu
  }
}
