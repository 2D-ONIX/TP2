export default class GameOver extends Phaser.Scene {
  constructor() {
    super("gameOver");
  }

  create() {
    

    // Texto del Game Over
    this.add
    .text(400, 240, "Game Over", {
      fontSize: "64px",
      fontFamily: "Arial",
      color: "#ffffff",
    })
    .setOrigin(0.5)
    .setShadow(2, 2, "#000000", 2, false, true);


  };
}


