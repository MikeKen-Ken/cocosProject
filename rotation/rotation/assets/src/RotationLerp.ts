import {
    _decorator,
    Component,
    Node,
    Vec3,
    v3,
    CCFloat,
    tween,
    Quat
} from 'cc';
const { ccclass, property } = _decorator;
import { Bezier } from 'bezier-js';

@ccclass('RotationLerp')
export class RotationLerp extends Component {
    @property(Node)
    lerpNode: Node = null;

    @property(CCFloat)
    speed: number = 1;

    start() {
        this.getRoadList();
    }

    getRoadList() {
        const bezier1: Bezier = new Bezier([
            v3(0, 0, 0),
            v3(-10, 2, -10),
            v3(0, 4, -10)
        ]);
        const bezier2: Bezier = new Bezier([
            v3(0, 4, -10),
            v3(10, 2, -5),
            v3(0, 0, 0)
        ]);

        const bezier1List = bezier1.getLUT(20);
        bezier1List.pop();
        const list = bezier1List.concat(bezier2.getLUT(20));
        const v3List = list.map(point => {
            return v3(point.x, point.y, point.z);
        });
        this.flyRole(v3List);
    }

    flyRole(list: Vec3[]) {
        this.lerpNode.position = list[0];
        const tw = tween(this.lerpNode);
        const startQuat = new Quat();
        this.lerpNode.getRotation(startQuat);
        let curPosition: Vec3;
        let nextPosition: Vec3;
        let direction: Vec3;
        let duration: number;
        //* 在贝塞尔曲线点之间进行插值
        for (let index = 1; index < list.length; index++) {
            const curQuat = new Quat();
            const nextQuat = new Quat();
            curPosition = list[index - 1];
            nextPosition = list[index];
            direction = nextPosition
                .clone()
                .subtract(curPosition)
                .normalize();
            duration = direction.length() / this.speed;
            //* 根据物体的direction和up，获取四元数
            Quat.fromViewUp(nextQuat, direction, v3(0, 1, 0));
            tw.to(
                duration,
                { position: nextPosition },
                {
                    //* ratio：tween的插值比率
                    onUpdate: (target, ratio: number) => {
                        curQuat.set(startQuat).slerp(nextQuat, ratio);
                        this.lerpNode.setRotation(curQuat);
                    },
                    onComplete: () => {
                        this.lerpNode.getRotation(startQuat);
                    }
                }
            );
        }
        tw.call(() => {
            this.flyRole(list);
        });
        tw.start();
    }
}
