import {
    _decorator,
    Component,
    Sprite,
    systemEvent,
    EventMouse,
    v4,
    UITransform,
    v2,
    v3,
    Vec3,
    SystemEvent
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HoverSpriteTest')
export class HoverSpriteTest extends Component {
    @property(Sprite)
    sprite: Sprite = null!;

    params = v4();

    location = v2();

    worldLocation = v3();

    uiTransform: UITransform = null!;

    start() {
        this.uiTransform = this.sprite.getComponent(UITransform)!;
        systemEvent.on(
            SystemEvent.EventType.MOUSE_MOVE,
            this.onMouseMove,
            this
        );
        this.params.z = 1;
        this.params.w = this.uiTransform.height / this.uiTransform.width;
    }

    onMouseMove(event: EventMouse) {
        event.getUILocation(this.location);
        Vec3.set(this.worldLocation, this.location.x, this.location.y, 0);
        this.uiTransform.convertToNodeSpaceAR(
            this.worldLocation,
            this.worldLocation
        );
        this.params.x =
            this.worldLocation.x / this.uiTransform.width +
            this.uiTransform.anchorX;

        this.params.y =
            1 -
            (this.worldLocation.y / this.uiTransform.height +
                this.uiTransform.anchorX);

        this.sprite.getMaterial(0)?.setProperty('params', this.params);
    }

    onDestroy() {
        systemEvent.targetOff(this);
    }
}
