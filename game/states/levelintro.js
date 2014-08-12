'use strict';

var Bird = require('../prefabs/bird');
var Ground = require('../prefabs/ground');

function Levelintro() {}

Levelintro.prototype = {
  create: function() {
    this.background = this.game.add.sprite(0, 0, 'background');

    this.bird = new Bird(this.game, 100, this.game.height / 2);
    this.bird.body.allowGravity = false;
    this.game.add.existing(this.bird);

    this.ground = new Ground(this.game, 0, 400, 335, 112);
    this.game.add.existing(this.ground);

    this.instructionGroup = this.game.add.group();
    this.instructionGroup.add(this.game.add.sprite(this.game.width / 2, 100, 'getReady'));
    this.instructionGroup.add(this.game.add.sprite(this.game.width / 2, 325, 'instructions'));
    this.instructionGroup.setAll('anchor.x', 0.5);
    this.instructionGroup.setAll('anchor.y', 0.5);

    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    var flapKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    flapKey.onDown.addOnce(this.startGame, this);

    this.game.input.onDown.addOnce(this.startGame, this);
  },
  update: function() {
    // state update code
  },
  startGame: function() {
    this.game.state.start('play');
  },
  shutdown: function() {
    this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
    this.bird.destroy();
    this.ground.destroy();
  }
};

module.exports = Levelintro;
