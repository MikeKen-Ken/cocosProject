import { _decorator, Component, Node, Quat, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadingMask')
export class LoadingMask extends Component {
    @property({
        type: Node,
        tooltip: '对话框背景'
    })
    dialogBg: Node = null;

    @property({
        type: Node,
        tooltip: '旋转 Sprite 所在节点'
    })
    loadingSpriteNode: Node = null;

    show() {
        this.node.active = true;
    }

    tempQuat = new Quat();
    radian = 0;
    update(dt: number) {
        if (this.node.active) {
            this.radian += dt * 3;
            Quat.fromAxisAngle(this.tempQuat, v3(0, 0, 1), -this.radian);
            this.loadingSpriteNode.setRotation(this.tempQuat);
        }
    }

    hide() {
        this.node.active = false;
    }
}
