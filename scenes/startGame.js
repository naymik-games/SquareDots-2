class startGame extends Phaser.Scene {
  constructor() {
    super("startGame");
  }
  preload() {
    //this.load.bitmapFont('atari', 'assets/fonts/atari-smooth.png', 'assets/fonts/atari-smooth.xml');
    // this.load.bitmapFont('atari', 'assets/fonts/Lato_0.png', 'assets/fonts/lato.xml');

  }
  create() {
    /*
      gameSettings = JSON.parse(localStorage.getItem('SDsave'));
      if (gameSettings === null || gameSettings.length <= 0) {
        localStorage.setItem('SDsave', JSON.stringify(defaultValues));
        gameSettings = defaultValues;
      }
    */
    this.cameras.main.setBackgroundColor(0xf7eac6);

    var title = this.add.bitmapText(game.config.width / 2, 100, 'topaz', 'SquareDots', 150).setOrigin(.5).setTint(0xc76210);

    var startMoves = this.add.bitmapText(game.config.width / 2 - 50, 275, 'topaz', 'Play Moves', 50).setOrigin(0, .5).setTint(0x000000);
    startMoves.setInteractive();
    startMoves.on('pointerdown', this.clickHandler, this);
    var startTime = this.add.bitmapText(game.config.width / 2 - 50, 475, 'topaz', 'Play Time', 50).setOrigin(0, .5).setTint(0x000000);
    startTime.setInteractive();
    startTime.on('pointerdown', this.clickHandler2, this);
    var startChanllenge = this.add.bitmapText(game.config.width / 2 - 50, 675, 'topaz', 'Play Challenge', 50).setOrigin(0, .5).setTint(0x000000);
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