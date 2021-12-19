const { ccclass, property } = cc._decorator;

@ccclass
export default class TestNode extends cc.Component {
    private speedX = 3;
    private speedY = 3;

    start() {
        this.speedX *= Math.random() > 0.5 ? -1 : 1;
        this.speedY *= Math.random() > 0.5 ? -1 : 1;
        this.node.x = Math.random() * cc.Canvas.instance.node.width;
        this.node.y = Math.random() * cc.Canvas.instance.node.height;
    }

    update(dt) {
        this.move();
    }

    move() {
        let randomSpeed = Math.random() * 3;

        let x = this.node.x + this.speedX;
        if (
            x < this.node.width * 0.5 ||
            x > cc.winSize.width - this.node.width * 0.5
        ) {
            this.speedX *= -1;
        }
        this.node.x += this.speedX + randomSpeed;

        let y = this.node.y + this.speedY;
        if (
            y < this.node.height * 0.5 ||
            y > cc.winSize.height - this.node.height * 0.5
        ) {
            this.speedY *= -1;
        }
        this.node.y += this.speedY + randomSpeed;
    }

    public setIsCollision(isColl) {
        if (isColl) {
            this.node.color = cc.Color.GREEN;
        } else {
            this.node.color = cc.Color.WHITE;
        }
    }
}
