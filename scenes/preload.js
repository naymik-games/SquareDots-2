class preloadGame extends Phaser.Scene {
  constructor() {
    super("PreloadGame");
  }
  preload() {


    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    this.load.image("particle", "assets/particle.png");
    for (var i = 0; i < 125; i++) {
      this.load.image("particle", "assets/particle.png");
    }




    //this.load.image("particle", "assets/sprites/particle.png");
    this.load.bitmapFont('topaz', 'assets/fonts/gothic.png', 'assets/fonts/gothic.xml');
    this.load.spritesheet("menu_icons", "assets/sprites/icons.png", {
      frameWidth: 96,
      frameHeight: 96
    });
    this.load.spritesheet("gems", "assets/sprites/gems_smaller_round.png", {
      frameWidth: 100,
      frameHeight: 100
    });
    this.load.spritesheet("burst", "assets/sprites/burst.png", {
      frameWidth: 100,
      frameHeight: 100
    });
    this.load.spritesheet("goal_icons", "assets/sprites/goal_icons.png", {
      frameWidth: 100,
      frameHeight: 100
    });
    this.load.spritesheet("flames", "assets/sprites/flames.png", {
      frameWidth: 100,
      frameHeight: 100
    });
    this.load.spritesheet("particle_color", "assets/particles.png", {
      frameWidth: 6,
      frameHeight: 6
    });

    this.load.image('check', 'assets/sprites/check.png');
    this.load.image('blank', 'assets/sprites/blank.png');
    this.load.image('menu', 'assets/sprites/menu.png');

    this.load.image("select_back", "assets/sprites/select-back.png");
    this.load.image("modal", "assets/sprites/modal.png");
    this.load.image("star", "assets/sprites/star.png");

    this.load.image("back_00", "assets/sprites/backs/back_00.png");
    this.load.image("back_01", "assets/sprites/backs/back_01.png");
    this.load.image("back_02", "assets/sprites/backs/back_02.png");
    this.load.image("back_03", "assets/sprites/backs/back_03.png");
    this.load.image("back_04", "assets/sprites/backs/back_04.png");
    this.load.image("back_05", "assets/sprites/backs/back_05.png");
    this.load.image("back_06", "assets/sprites/backs/back_06.png");
    this.load.image("back_07", "assets/sprites/backs/back_07.png");
    this.load.image("back_08", "assets/sprites/backs/back_08.png");
    this.load.image("back_09", "assets/sprites/backs/back_09.png");
    this.load.image("back_10", "assets/sprites/backs/back_10.png");
    this.load.image("back_11", "assets/sprites/backs/back_11.png");
    this.load.image("back_12", "assets/sprites/backs/back_12.png");
    this.load.image("back_13", "assets/sprites/backs/back_13.png");
    this.load.image("back_14", "assets/sprites/backs/back_14.png");
    this.load.image("back_15", "assets/sprites/backs/back_15.png");
    this.load.image("back_16", "assets/sprites/backs/back_16.png");
  }
  create() {
    this.scene.start("startGame");
    //this.scene.start("PlayGame");

  }
}








