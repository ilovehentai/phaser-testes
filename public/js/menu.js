class Menu {

  create(data) {
    let score = data.score ? data.score : 0;

    if (localStorage.getItem('bestScore') === null) {
      localStorage.setItem('bestScore', 0);
    }

    if (score > localStorage.getItem('bestScore')) {
      localStorage.setItem('bestScore', score);
    }

    this.add.image(250, 170, 'background');

    let nameLabel = this.add.text(250, -50, 'Super Coin Box', { font: '50px Geo', fill: '#fff' });
    nameLabel.setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: nameLabel,
      y: 80,
      duration: 1000,
      ease: 'bounce.out',
    });

    let scoreText = 'score: ' + score + '\nbest score: ' + localStorage.getItem('bestScore');
    let scoreLabel = this.add.text(250, 170, scoreText, { font: '25px Geo', fill: '#fff', align: 'center' });
    scoreLabel.setOrigin(0.5, 0.5);

    let startText;
    if (this.sys.game.device.os.desktop) {
      startText = 'press the up arrow key to start';
    } else {
      startText = 'touch the screen to start';
    }
    let startLabel = this.add.text(250, 260, startText, { font: '25px Geo', fill: '#fff' });
    startLabel.setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: startLabel,
      angle: { from: -2, to: 2 },
      duration: 1000,
      yoyo: true,
      repeate: -1,
    });

    this.upKey = this.input.keyboard.addKey('up');

    this.addMuteButton();
  }

  update() {
    if (!this.sys.game.device.os.desktop && this.input.activePointer.y < 60) {
      return;
    }

    if (this.upKey.isDown || (!this.sys.game.device.os.desktop && this.input.activePointer.isDown)) {
      this.scene.start('play');
    }

    if (!this.game.sound.mute) {
      this.soundButton.setFrame(0);
    } else {
        this.soundButton.setFrame(1);
    }
  }

  addMuteButton() {
    this.soundButton = this.add.sprite(34, 26, 'muteButton');
    this.soundButton.fixedToCamera = true;
    this.soundButton.setInteractive();
    this.soundButton.on('pointerdown', this.toggleMute, this);
    
  }

  toggleMute() {
    if (!this.game.sound.mute) {
        this.game.sound.mute = true;
        this.soundButton.setFrame(1);
    } else {
        this.game.sound.mute = false;
        this.soundButton.setFrame(0);
    }
  }
}