class Play {

  create() {
    this.jumpSound = this.sound.add('jump');
    this.coinSound = this.sound.add('coin');
    this.deadSound = this.sound.add('dead');

    this.player = this.physics.add.sprite(250, 170, 'player');
    this.player.body.gravity.y = 500;

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { frames: [1, 2] }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { frames: [3, 4] }),
      frameRate: 8,
      repeat: -1,
    });

    this.arrow = this.input.keyboard.createCursorKeys();

    this.createWorld();

    this.coin = this.physics.add.sprite(60, 130, 'coin');

    this.scoreLabel = this.add.text(30, 25, 'score: 0', { font: '18px Geo', fill: '#fff' });
    this.score = 0;

    this.enemies = this.physics.add.group();
    this.nextEnemy = Date.now() + 2200;

    if (!this.sys.game.device.os.desktop) {
      this.input.addPointer(1);
      this.addMobileInputs();

      this.rotateLabel = this.add.text(250, 170, '', { font: '30px Geo', fill: '#fff', backgroundColor: '#000' });
      this.rotateLabel.setOrigin(0.5, 0.5);

      this.scale.on('orientationchange', this.orientationChange, this);
      this.orientationChange();
    }

    this.emitter = this.add.particles(this.player.x, this.player.y, 'pixel', {
      quantity: 15,
      speed: { min: -150, max: 150 },
      scale: { start: 2, end: 0.1 },
      lifespan: 800,
      emitting: false,
    });
  }

  update() {
    this.physics.collide(this.player, this.walls);
    this.physics.collide(this.enemies, this.walls);
    
    if (!this.player.active) {
      return;
    }

    this.movePlayer();

    let now = Date.now();
    if (this.nextEnemy < now) {

      let startDifficulty = 4000;
      let endDifficulty = 1000;
      let scoreToReachEndDifficulty = 100;

      let progress = Math.min(this.score / scoreToReachEndDifficulty, 1);

      let delay = startDifficulty - (startDifficulty-endDifficulty) * progress;

      this.addEnemy();
      this.nextEnemy = now + delay;
    }

    if (this.physics.overlap(this.player, this.coin)) {
      this.takeCoin();
    }

    if (this.player.y > 340 || this.player.y < 0) {
      this.playerDie();
    }

    if (this.physics.overlap(this.player, this.enemies)) {
      this.playerDie();
    }
  }

  createWorld() {

    let map = this.add.tilemap('map');
    let tileset = map.addTilesetImage('tileset', 'tileset');
    this.walls = map.createLayer('Tile Layer 1', tileset);

    this.walls.setCollision(1);
  }

  movePlayer() {
    if (this.arrow.left.isDown || this.moveLeft) {
      this.player.body.velocity.x = -200;
      this.player.anims.play('left', true);
    } else if (this.arrow.right.isDown || this.moveRight) {
      this.player.body.velocity.x = 200;
      this.player.anims.play('right', true);
    } else {
      this.player.body.velocity.x = 0;
      this.player.setFrame(0);
    }

    if (this.arrow.up.isDown) {
      this.jumpPlayer();
    }
  }

  takeCoin() {
    this.score += 5;
    this.scoreLabel.setText('score: ' + this.score);
    this.coinSound.play();

    this.coin.setScale(0);

    this.tweens.add({
      targets: this.coin,
      scale: 1,
      duration: 300,
    });

    this.tweens.add({
      targets: this.player,
      scale: 1.3,
      duration: 100,
      yoyo: true,
    });

    this.updateCoinPosition();
  }

  updateCoinPosition() {
    let positions = [
      { x: 140, y: 60 },
      { x: 360, y: 60 },
      { x: 60, y: 140 },
      { x: 440, y: 140 },
      { x: 130, y: 300 },
      { x: 370, y: 300 },
    ];

    positions = positions.filter(coin => coin.x !== this.coin.x);
    let newPosition = Phaser.Math.RND.pick(positions);
    this.coin.setPosition(newPosition.x, newPosition.y);
  }

  addEnemy() {
    let enemy = this.enemies.create(250, -10, 'enemy');

    enemy.body.gravity.y = 500;
    enemy.body.velocity.x = Phaser.Math.RND.pick([-100, 100]);
    enemy.body.bounce.x = 1;

    this.time.addEvent({
      delay: 10000,
      callback: () => enemy.destroy(),
    });
  }

  playerDie() {
    this.player.destroy();
    this.deadSound.play();
    this.emitter.setPosition(this.player.x, this.player.y);
    this.emitter.explode();

    this.cameras.main.shake(300, 0.02);
    this.time.addEvent({
      delay: 1000,
      callback: () => this.scene.start('menu', { score: this.score }),
    });
  }

  addMobileInputs() {
    this.moveLeft = false;
    this.moveRight = false;

    let jumpButton = this.add.sprite(400, 290, 'jumpButton');
    jumpButton.setInteractive();
    jumpButton.alpha = 0.5;
    jumpButton.on('pointerdown', this.jumpPlayer, this);

    let leftButton = this.add.sprite(100, 290, 'leftButton');
    leftButton.setInteractive();
    leftButton.on('pointerover', () => this.moveLeft = true, this);
    leftButton.on('pointerout', () => this.moveLeft = false, this);
    leftButton.alpha = 0.5;
    
    let rightButton = this.add.sprite(180, 290, 'rightButton');
    rightButton.setInteractive();
    rightButton.on('pointerover', () => this.moveRight = true, this);
    rightButton.on('pointerout', () => this.moveRight = false, this);
    rightButton.alpha = 0.5;
  }

  jumpPlayer() {
    if (this.player.body.onFloor()) {
      this.player.body.velocity.y = -320;
      this.jumpSound.play();
    }
  }

  orientationChange() {
    if (this.scale.orientation === Phaser.Scale.PORTRAIT) {
      this.rotateLabel.setText(' rotate your device in landscape');
      this.scene.pause();
    } else if (this.scale.orientation === Phaser.Scale.LANDSCAPE) {
      this.rotateLabel.setText('');
      this.scene.resume();
    }
  }
}