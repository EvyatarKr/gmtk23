import * as Phaser from "phaser";
import {
  createEnemyShip,
  enemyShips,
  fire,
  moveEnemyShips,
  c,
  moveFire,
} from "./enemy-ship";

let astroid;
let shotSound;
let shipBumpSound;
let asteroidHit;
let asteroidDie;
let notAngry;
let timeToMoreEnemies;

export default class Demo extends Phaser.Scene {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("demo");
  }

  preload() {
    this.load.image("ship", "assets/ship-2.png");
    this.load.image("astroid", "assets/astroid.png");
    this.load.image("fire", "assets/fire.png");
    this.load.image("not_angry", "assets/not_angry.png");

    this.load.audio("background-music", "assets/music.ogg");
    this.load.audio("ship-bump", "assets/ship_bump.ogg");
    this.load.audio("shotSound", "assets/shot.ogg");
    this.load.audio("astroid-hit", "assets/asteroid_hit.ogg");
    this.load.audio("astroid-die", "assets/asteroid_die.ogg");

    this.load.glsl("stars", "assets/starfields.glsl.js");
  }

  create() {
    timeToMoreEnemies = 3
    c.sprites = this.add;
    this.add.shader("RGB Shift Field", 0, 0, 1900, 900).setOrigin(0);
    const music = this.sound.add("background-music", { loop: true });
    music.play();

    shipBumpSound = this.sound.add("ship-bump");

    shotSound = this.sound.add("shotSound");

    asteroidHit = this.sound.add("astroid-hit");

    asteroidDie = this.sound.add("astroid-die");

    for (let i = 0; i < 5; i++) {
      let s = this.add.sprite(0, 0, "ship");
      createEnemyShip(s, shipBumpSound);
    }

    astroid = this.add.sprite(950, 450, "astroid");

    notAngry = this.add.sprite(-1000, -1000, "not_angry");

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time: number, delta: number): void {
    moveEnemyShips(delta);

    moveFire(delta, astroid, onAstroidHit);

    timeToMoreEnemies = timeToMoreEnemies - delta / 1000
      console.log('adfadfa', timeToMoreEnemies)
    if(timeToMoreEnemies <= 0)
    {
      timeToMoreEnemies = 1;
      let s = this.add.sprite(0, 0, "ship");
      createEnemyShip(s, shipBumpSound);
    }

    fire(delta, shotSound);

    if (this.cursors.up.isDown) {
      astroid.y -= 2;
    }
    if (this.cursors.down.isDown) {
      astroid.y += 2;
    }
    if (this.cursors.left.isDown) {
      astroid.x -= 2;
    }
    if (this.cursors.right.isDown) {
      astroid.x += 2;
    }
  }
}

let hp = 10;

function onAstroidHit() {
  hp = hp - 1;
  if (hp <= 0) {
    asteroidDie.play();

    notAngry.x = 950;
    notAngry.y = 450;
  } else {
    asteroidHit.play();
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  //  backgroundColor: "#125555",
  width: 1900,
  height: 900,
  scene: Demo,
};
const game = new Phaser.Game(config);