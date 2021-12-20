import {
    _decorator,
    Component,
    Node,
    systemEvent,
    SystemEvent,
    Touch,
    v3,
    Quat,
    Vec3,
    CCFloat
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RotationAxis')
export class RotationAxis extends Component {
    @property(Node)
    rotationNode: Node = null;

    @property(CCFloat)
    rotationScale: number = 0.01;

    @property(Node)
    targetAxis: Node = null;

    tempQuat = new Quat();

    tempV3 = v3();

    targetPosition = v3();

    onload() {
        this.targetPosition = this.targetAxis.worldPosition;
    }

    start() {
        systemEvent.on(
            SystemEvent.EventType.TOUCH_MOVE,
            this.onTouchMove,
            this
        );
    }

    onTouchMove(touch: Touch) {
        const delta = touch.getDelta();
        const axis = Vec3.UP;
        const radian = delta.x * this.rotationScale;
        const curPosition = this.rotationNode.worldPosition;

        //* 获取旋转四元数
        Quat.fromAxisAngle(this.tempQuat, axis, radian);
        Vec3.subtract(this.tempV3, curPosition, this.targetPosition);
        //* 向量旋转
        Vec3.transformQuat(this.tempV3, this.tempV3, this.tempQuat);
        //* 得到旋转后的node位置
        Vec3.add(this.tempV3, this.targetPosition, this.tempV3);
        this.rotationNode.setWorldPosition(this.tempV3);

        const curQuat = this.rotationNode.worldRotation;
        Quat.rotateAround(this.tempQuat, curQuat, axis, radian);
        this.rotationNode.setWorldRotation(this.tempQuat);
    }
}
