menuOptions = {
  colors: ["0xffffff", "0xff0000", "0x00ff00", "0x0000ff", "0xffff00"],
  pages: 5,
  columns: 3,
  rows: 4,
  thumbWidth: 250,
  thumbHeight: 250,
  spacing: 20,
  localStorageName: "levelselect"
}
class selectGame extends Phaser.Scene {
  constructor() {
    super("selectGame");
  }
  preload() {
    this.load.spritesheet("levelthumb", "assets/sprites/select_icons.png", {
      frameWidth: 300,
      frameHeight: 300
    });
    this.load.image("levelpages", "assets/sprites/levelpages.png");
    this.load.image("transp", "assets/sprites/transp.png");
  }
  create() {
    menuOptions.pages = groups.length
    this.stars = [];
    this.stars[0] = 0;
    this.canMove = true;
    this.itemGroup = this.add.group();
    for (var l = 1; l < menuOptions.columns * menuOptions.rows * menuOptions.pages; l++) {
      this.stars[l] = -1;
    }
    this.savedData = localStorage.getItem(menuOptions.localStorageName) == null ? this.stars.toString() : localStorage.getItem(menuOptions.localStorageName);
    this.stars = this.savedData.split(",");
    this.pageText = this.add.bitmapText(game.config.width / 2, 75, 'topaz', "Groups (1 / " + menuOptions.pages + ")", 80).setOrigin(.5).setTint(0xffffff).setAlpha(1);


    this.pageText.setOrigin(0.5);
    this.scrollingMap = this.add.tileSprite(0, 0, menuOptions.pages * game.config.width, game.config.height, "transp");
    this.scrollingMap.setInteractive();
    this.input.setDraggable(this.scrollingMap);
    this.scrollingMap.setOrigin(0, 0);
    this.currentPage = 0;
    this.pageSelectors = [];
    var rowLength = menuOptions.thumbWidth * menuOptions.columns + menuOptions.spacing * (menuOptions.columns - 1);
    var leftMargin = (game.config.width - rowLength) / 2 + menuOptions.thumbWidth / 2;
    var colHeight = menuOptions.thumbHeight * menuOptions.rows + menuOptions.spacing * (menuOptions.rows - 1);
    var topMargin = (game.config.height - colHeight) / 2 + menuOptions.thumbHeight / 2;
    for (var k = 0; k < menuOptions.colors.length; k++) {
      for (var i = 0; i < menuOptions.columns; i++) {
        for (var j = 0; j < menuOptions.rows; j++) {
          var thumb = this.add.image(k * game.config.width + leftMargin + i * (menuOptions.thumbWidth + menuOptions.spacing), topMargin + j * (menuOptions.thumbHeight + menuOptions.spacing), "levelthumb");
          thumb.displayWidth = 250;
          thumb.displayHeight = 250;
          //thumb.setTint(menuOptions.colors[k]);
          thumb.levelNumber = k * (menuOptions.rows * menuOptions.columns) + j * menuOptions.columns + i;
          thumb.setFrame(parseInt(this.stars[thumb.levelNumber]) + 1);
          this.itemGroup.add(thumb);

          var levelText = this.add.bitmapText(thumb.x, thumb.y - 60, 'topaz', thumb.levelNumber, 100).setOrigin(.5).setTint(0x000000).setAlpha(1);

          this.itemGroup.add(levelText);
        }
      }
      this.pageSelectors[k] = this.add.sprite(game.config.width / 2 + (k - Math.floor(menuOptions.pages / 2) + 0.5 * (1 - menuOptions.pages % 2)) * 40, game.config.height - 140, "levelpages");
      this.pageSelectors[k].setInteractive();
      this.pageSelectors[k].on("pointerdown", function () {
        if (this.scene.canMove) {
          var difference = this.pageIndex - this.scene.currentPage;
          this.scene.changePage(difference);
          this.scene.canMove = false;
        }
      });
      this.pageSelectors[k].pageIndex = k;
      this.pageSelectors[k].tint = menuOptions.colors[k];
      if (k == this.currentPage) {
        this.pageSelectors[k].scaleY = 1;
      }
      else {
        this.pageSelectors[k].scaleY = 0.5;
      }
    }
    this.input.on("dragstart", function (pointer, gameObject) {
      gameObject.startPosition = gameObject.x;
      gameObject.currentPosition = gameObject.x;
    });
    this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
      if (dragX <= 10 && dragX >= -gameObject.width + game.config.width - 10) {
        gameObject.x = dragX;
        var delta = gameObject.x - gameObject.currentPosition;
        gameObject.currentPosition = dragX;
        this.itemGroup.children.iterate(function (item) {
          item.x += delta;
        });
      }
    }, this);
    this.input.on("dragend", function (pointer, gameObject) {
      this.canMove = false;
      var delta = gameObject.startPosition - gameObject.x;
      if (delta == 0) {
        this.canMove = true;
        this.itemGroup.children.iterate(function (item) {
          if (item.texture.key == "levelthumb") {
            var boundingBox = item.getBounds();
            if (Phaser.Geom.Rectangle.Contains(boundingBox, pointer.x, pointer.y) && item.frame.name > 0) {
              onLevel = item.levelNumber
              levelSettings = levels[onLevel]
              this.scene.start("PlayGame");
              this.scene.launch('UI')
            }
          }
        }, this);
      }
      if (delta > game.config.width / 8) {
        this.changePage(1);
      }
      else {
        if (delta < -game.config.width / 8) {
          this.changePage(-1);
        }
        else {
          this.changePage(0);
        }
      }
    }, this);
    //this.changePage(3)
  }
  changePage(page) {
    this.currentPage += page;
    for (var k = 0; k < menuOptions.pages; k++) {
      if (k == this.currentPage) {
        this.pageSelectors[k].scaleY = 1;
      }
      else {
        this.pageSelectors[k].scaleY = 0.5;
      }
    }
    this.pageText.text = "Groups (" + (this.currentPage + 1).toString() + " / " + menuOptions.pages + ")";
    var currentPosition = this.scrollingMap.x;
    this.tweens.add({
      targets: this.scrollingMap,
      x: this.currentPage * -game.config.width,
      duration: 300,
      ease: "Cubic.easeOut",
      callbackScope: this,
      onUpdate: function (tween, target) {
        var delta = target.x - currentPosition;
        currentPosition = target.x;
        this.itemGroup.children.iterate(function (item) {
          item.x += delta;
        });
      },
      onComplete: function () {
        this.canMove = true;
      }
    });
  }
}