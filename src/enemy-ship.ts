import * as Phaser from "phaser";

let sprites = undefined;
export let c = { sprites };

export const enemyShips: EnemyShip[] = [];

type EnemyShip = {
  speed: number;
  sprite: Phaser.GameObjects.Sprite;
  timeToNextFire: number;
  shipBumpSound: any;
};

let fires = [];

export function createEnemyShip(
  sprite: Phaser.GameObjects.Sprite,
  shipBumpSound
) {
  let x = Math.random() * 1900;

  let y = Math.random() * 900;

  sprite.x = x;
  sprite.y = y;

  const angle = Math.random() * 360;
  sprite.setAngle(angle);

  enemyShips.push({
    sprite: sprite,
    speed: 2 + Math.random() * 6,
    timeToNextFire: Math.random() * 10,
    shipBumpSound,
  });
}

export function moveEnemyShips(deltaTime) {
  for (const enemyShip of enemyShips) {
    const sprite = enemyShip.sprite;

    if (sprite.x > 1900) {
      enemyShip.shipBumpSound.play({ volume: 0.1 });
      sprite.setAngle(180 - sprite.angle);
    }

    if (sprite.y > 900) {
      enemyShip.shipBumpSound.play({ volume: 0.1 });
      sprite.setAngle(0 - sprite.angle);
    }

    if (sprite.y < 0) {
      enemyShip.shipBumpSound.play({ volume: 0.1 });
      sprite.setAngle(-1 * sprite.angle);
    }

    if (sprite.x < 0) {
      enemyShip.shipBumpSound.play({ volume: 0.1 });
      sprite.setAngle(180 - sprite.angle);
    }

    const deltas = getAddition(enemyShip);
    sprite.x += deltas.deltaX;
    sprite.y += deltas.deltaY;
  }
}

export function fire(deltaTime, shotSound) {
  for (const enemyShip of enemyShips) {
    enemyShip.timeToNextFire -= deltaTime / 1000;

    if (enemyShip.timeToNextFire <= 0) {
      shotSound.play();
      enemyShip.timeToNextFire = 2 + Math.random() * 6;
      const f = c.sprites.sprite(
        enemyShip.sprite.x,
        enemyShip.sprite.y,
        "fire"
      );
      f.angle = enemyShip.sprite.angle;
      fires.push(f);
    }
  }
}

export function moveFire(deltaTime, astroid, onAstroidHit) {
  const toDestroy = [];

  for (const f of fires) {
    const angleInRadians = Phaser.Math.DegToRad(f.angle);
    const deltaX = Math.cos(angleInRadians) * 10;
    const deltaY = Math.sin(angleInRadians) * 10;
    f.x += deltaX;
    f.y += deltaY;

    if (
      f.x > astroid.x &&
      f.x < astroid.x + 80 &&
      f.y > astroid.y &&
      f.y < astroid.y + 80
    ) {
      onAstroidHit();
      toDestroy.push(f);
    }
  }

  for (const f of toDestroy) {
    fires.splice(fires.indexOf(f), 1);
    f.destroy(true);
  }
}

function getAddition(ship: EnemyShip) {
  // Calculate the new position based on the current angle and speed
  const angleInRadians = Phaser.Math.DegToRad(ship.sprite.angle);
  const deltaX = Math.cos(angleInRadians) * ship.speed;
  const deltaY = Math.sin(angleInRadians) * ship.speed;

  return {
    deltaX,
    deltaY,
  };
}
