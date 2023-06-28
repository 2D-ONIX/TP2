// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Juego extends Phaser.Scene {
  constructor() {
    super("hello-world");
    this.collectedStars = 0;
  }

  init() {
    this.count = 0;
    this.scoreText;
    this.timeLeft = 40;
    this.gameOver = false;
  }

  preload() {
    this.load.tilemapTiledJSON("map", "./public/tilemaps/nivel1.json");
    this.load.image("tilesFondo", "./public/assets/images/sky.png");
    this.load.image("tilesPlataforma", "./public/assets/images/platform.png");
    this.load.image("star", "./public/assets/images/star.png");
    this.load.image("door", "./public/images/door.png");
    this.load.spritesheet("dude", "./public/assets/images/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    const map = this.make.tilemap({ key: "map" });
    const capaFondo = map.addTilesetImage("sky", "tilesFondo");
    const capaPlataformas = map.addTilesetImage("platform", "tilesPlataforma");

    const fondoLayer = map.createLayer("fondo", capaFondo, 0, 0);
    const plataformaLayer = map.createLayer("plataformas", capaPlataformas, 0, 0);
    const objectosLayer = map.getObjectLayer("objetos");

    plataformaLayer.setCollisionByProperty({ colision: true });

    const spawnDoor = map.findObject("objetos", (obj) => obj.name === "salida");
    this.salida = this.physics.add.sprite(spawnDoor.x, spawnDoor.y, "door").setScale(0.2);
    this.salida.setBounce(0.1);
    this.salida.setCollideWorldBounds(true);

    const spawnPoint = map.findObject("objetos", (obj) => obj.name === "jugador");
    this.jugador = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "dude");
    this.jugador.setBounce(0.1);
    this.jugador.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.estrellas = this.physics.add.group();

    objectosLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name } = objData;
      switch (name) {
        case "estrella": {
          const star = this.estrellas.create(x, y, "star");
          break;
        }
      }
    });

    this.physics.add.collider(this.jugador, plataformaLayer);
    this.physics.add.collider(this.estrellas, plataformaLayer);
    this.physics.add.collider(
      this.jugador,
      this.estrellas,
      this.recolectarEstrella,
      null,
      this
    );

    this.physics.add.collider(this.salida, plataformaLayer);

    this.scoreText = this.add.text(30, 40, "Score: " + this.collectedStars, {
      fontSize: "32px",
      fontStyle: "bold",
      fill: "#FFFFFF",
    });

    this.timeText = this.add.text(30, 10, "Tiempo restante: " + this.timeLeft, {
      fontSize: "32px",
      fill: "#fff",
      fontStyle: "bold",
    });

    this.time.addEvent({
      delay: 1000,
      callback: this.timer,
      callbackScope: this,
      loop: true,
    });

    if (this.collectedStars === this.estrellas.getLength()) {
      this.physics.add.collider(
        this.jugador,
        this.salida,
        this.pasarNivel2,
        null,
        this
      );
    }
  }

  update() {
    if (this.gameOver) {
      this.scene.start("gameOver");
      this.timeLeft = 40;
    }

    if (this.cursors.left.isDown) {
      this.jugador.setVelocityX(-160);
      this.jugador.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.jugador.setVelocityX(160);
      this.jugador.anims.play("right", true);
    } else {
      this.jugador.setVelocityX(0);
      this.jugador.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.jugador.body.blocked.down) {
      this.jugador.setVelocityY(-330);
    }
  }

  timer() {
    this.timeLeft--;
    this.timeText.setText("Tiempo restante: " + this.timeLeft);
    if (this.timeLeft <= 0) {
      this.gameOver = true;
    }
  }

  recolectarEstrella(jugador, estrella) {
    estrella.disableBody(true, true);
    this.collectedStars++;
    this.scoreText.setText("Score: " + this.collectedStars);

    if (this.collectedStars === this.estrellas.getLength()) {
      this.physics.add.collider(
        this.jugador,
        this.salida,
        this.pasarNivel2,
        null,
        this
      );
    }
  }

  pasarNivel2() {
    if (this.collectedStars === this.estrellas.getLength()) {
      this.scene.stop();
      this.scene.start("nivel2");
    }
  }
}

