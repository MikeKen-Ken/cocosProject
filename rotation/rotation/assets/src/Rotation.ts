import {
    _decorator,
    Component,
    Node,
    systemEvent,
    SystemEvent,
    Touch,
    v3,
    Quat,
    CCFloat
} from 'cc';

const { ccclass, property } = _decorator;

@ccclass('Rotation')
export class Rotation extends Component {
    @property(Node)
    rotationNode: Node = null;

    @property(CCFloat)
    rotationScale: number = 0.01;

    tempQuat = new Quat();

    start() {
        systemEvent.on(
            SystemEvent.EventType.TOUCH_MOVE,
            this.onTouchMove,
            this
        );
    }

    onTouchMove(touch: Touch) {
        const delta = touch.getDelta();
        const axis = v3(-delta.y, delta.x, 0);
        const radian = delta.length() * this.rotationScale;
        const curQuat = this.rotationNode.getRotation();
        Quat.rotateAround(this.tempQuat, curQuat, axis.normalize(), radian);
        this.rotationNode.setRotation(this.tempQuat);
    }
}
