class startGame extends Phaser.Scene {
  constructor() {
    super("startGame");
  }
  preload() {
    //this.load.bitmapFont('atari', 'assets/fonts/atari-smooth.png', 'assets/fonts/atari-smooth.xml');
    // this.load.bitmapFont('atari', 'assets/fonts/Lato_0.png', 'assets/fonts/lato.xml');

  }
  create() {
    var back = this.add.image(0, 0, 'select_back').setOrigin(0)
    back.displayWidth = 900
    back.displayHeight = 1640
    gameData = JSON.parse(localStorage.getItem('SD2save'));
    if (gameData === null || gameData.length <= 0) {
      localStorage.setItem('SD2save', JSON.stringify(defaultValues));
      gameData = defaultValues;
    }
    var lev = levels.length
    var stat = gameData.levelStatus.length
    console.log('lev ' + lev + ', ' + 'stat ' + stat)
    if (lev > stat) {
      for (var i = 0; i < lev - stat; i++) {
        gameData.levelStatus.push(-1)
      }
      localStorage.setItem('SD2save', JSON.stringify(gameData));
    }
    this.cameras.main.setBackgroundColor(0xf7eac6);

    var title = this.add.bitmapText(game.config.width / 2, 100, 'topaz', 'SquareDots', 130).setOrigin(.5).setTint(0xf7484e);

    var startMoves = this.add.bitmapText(game.config.width / 2, 375, 'topaz', 'Moves', 80).setOrigin(.5).setTint(0xffffff);
    startMoves.setInteractive();
    startMoves.on('pointerdown', this.clickHandler, this);
    var startTime = this.add.bitmapText(game.config.width / 2, 600, 'topaz', 'Time', 80).setOrigin(.5).setTint(0xffffff);
    startTime.setInteractive();
    startTime.on('pointerdown', this.clickHandler2, this);
    var startChanllenge = this.add.bitmapText(game.config.width / 2, 1075, 'topaz', 'Challenge', 80).setOrigin(.5).setTint(0xffffff);
    startChanllenge.setInteractive();
    startChanllenge.on('pointerdown', this.clickHandler3, this);

  }
  clickHandler() {
    gameOptions.gameMode = 'moves'

    levelSettings = defaultLevel

    this.scene.start('PlayGame');
    this.scene.launch('UI');
  }
  clickHandler2() {
    gameOptions.gameMode = 'time'
    levelSettings = defaultLevel
    this.scene.start('PlayGame');
    this.scene.launch('UI');
  }
  clickHandler3() {
    gameOptions.gameMode = 'challenge'
    this.scene.start('selectGame');
    // this.scene.launch('UI');
  }
}