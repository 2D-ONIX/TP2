export default class GameOver extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("gameOver");
  }

  create() {
    this.add
      .text(400, 240, "Game Over")
      .setInteractive()
      .on("pointerdown", () => this.scene.start("game"));
  }
}
