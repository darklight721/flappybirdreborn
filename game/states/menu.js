'use strict';

var Bird = require('../prefabs/bird');
var Ground = require('../prefabs/ground');

function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    this.background = this.game.add.sprite(0, 0, 'background');

    this.ground = new Ground(this.game, 0, 400, 335, 112);
    this.game.add.existing(this.ground);

    this.titleGroup = this.game.add.group();

    this.title = this.game.add.sprite(0, 0, 'title');
    this.titleGroup.add(this.title);

    this.bird = new Bird(this.game, 200, 5);
    this.bird.body.allowGravity = false;
    this.titleGroup.add(this.bird);

    this.titleGroup.x = 30;
    this.titleGroup.y = 100;

    this.game.add.tween(this.titleGroup)
      .to({ y: 115 }, 350, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

    this.startButton = this.game.add.button(
      this.game.width / 2, 300, 'startButton', this.startClick, this
    );
    this.startButton.anchor.setTo(0.5, 0.5);
  },
  startClick: function() {
    this.game.state.start('levelintro');
  },
  update: function() {

  },
  shutdown: function() {
    this.bird.destroy();
    this.ground.destroy();
  }
};

module.exports = Menu;
