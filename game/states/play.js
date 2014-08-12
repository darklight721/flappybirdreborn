
'use strict';

var Bird = require('../prefabs/bird');
var Ground = require('../prefabs/ground');
var PipeGroup = require('../prefabs/pipeGroup');
var Scoreboard = require('../prefabs/scoreboard');

function Play() {}

Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1200;

    this.background = this.game.add.sprite(0, 0, 'background');

    this.bird = new Bird(this.game, 100, this.game.height / 2);
    this.game.add.existing(this.bird);

    this.pipes = this.game.add.group();

    this.ground = new Ground(this.game, 0, 400, 335, 112);
    this.game.add.existing(this.ground);

    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    var flapKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    flapKey.onDown.addOnce(this.startGame, this);
    flapKey.onDown.add(this.bird.flap, this.bird);

    this.game.input.onDown.addOnce(this.startGame, this);
    this.game.input.onDown.add(this.bird.flap, this.bird);

    this.instructionGroup = this.game.add.group();
    this.instructionGroup.add(this.game.add.sprite(this.game.width / 2, 100, 'getReady'));
    this.instructionGroup.add(this.game.add.sprite(this.game.width / 2, 325, 'instructions'));
    this.instructionGroup.setAll('anchor.x', 0.5);
    this.instructionGroup.setAll('anchor.y', 0.5);

    this.score = 0;

    this.scoreText = this.game.add.bitmapText(this.game.width / 2, 10, 'flappyfont', this.score.toString(), 24);
    this.scoreText.visible = false;

    this.scoreSound = this.game.add.audio('score');
  },
  update: function() {
    this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);
    this.pipes.forEach(function(pipeGroup) {
      this.checkScore(pipeGroup);
      this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this);
    }, this);
  },
  clickListener: function() {
    this.game.state.start('gameover');
  },
  generatePipes: function() {
    var pipeY = this.game.rnd.integerInRange(-100, 100);
    var pipeGroup = this.pipes.getFirstExists(false);

    if (!pipeGroup) {
      pipeGroup = new PipeGroup(this.game, this.pipes);
    }

    pipeGroup.reset(this.game.width, pipeY);
  },
  deathHandler: function() {
    this.bird.alive = false;
    this.pipes.callAll('stop');
    this.pipeGenerator.timer.stop();
    this.ground.stopScroll();
    this.scoreboard = new Scoreboard(this.game);
    this.game.add.existing(this.scoreboard);
    this.scoreboard.show(this.score);
  },
  shutdown: function() {
    this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
    this.bird.destroy();
    this.pipes.destroy();
    this.scoreboard.destroy();
  },
  startGame: function() {
    this.bird.body.allowGravity = true;
    this.bird.alive = true;

    this.pipeGenerator = this.game.time.events.loop(
      Phaser.Timer.SECOND * 1.25, this.generatePipes, this
    );
    this.pipeGenerator.timer.start();

    this.instructionGroup.destroy();
    this.scoreText.visible = true;
  },
  checkScore: function(pipeGroup) {
    if (pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.bird.world.x) {
      pipeGroup.hasScored = true;
      this.score++;
      this.scoreText.setText(this.score.toString());
      this.scoreSound.play();
    }
  }
};

module.exports = Play;
