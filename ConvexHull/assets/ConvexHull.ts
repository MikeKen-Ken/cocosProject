import {
  _decorator,
  Component,
  Node,
  input,
  Input,
  Vec2,
  EventTouch,
  GraphicsComponent,
  Color,
  Label,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("ConvexHull")
export class ConvexHull extends Component {
  @property(GraphicsComponent)
  private graphics: GraphicsComponent;

  @property(Node)
  private explainLabel: Node;

  private pointArray: Vec2[] = [];

  private isShowConvex = false;

  start() {
    input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
  }

  dispose() {
    input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
  }

  onTouchStart(event: EventTouch) {
    if (event.target !== null) {
      return;
    }
    if (this.isShowConvex) {
      this.pointArray = [];
      this.graphics.clear();
      this.isShowConvex = false;
      this.graphics.strokeColor = Color.GREEN;
    }
    const touchPoint = event.getUILocation();
    this.pointArray.push(touchPoint);
    this.graphics.circle(touchPoint.x, touchPoint.y, 7);
    this.graphics.fill();
    this.graphics.stroke();
  }

  showConvexHull() {
    this.isShowConvex = true;
    this.graphics.strokeColor = Color.RED;
    const convexArray = this.convexHull(this.pointArray);
    convexArray.map((p, i) => {
      this.graphics.moveTo(p.x, p.y);
      const nextIndex = i + 1 < convexArray.length ? i + 1 : 0;
      this.graphics.lineTo(convexArray[nextIndex].x, convexArray[nextIndex].y);
    });
    this.graphics.stroke();
  }

  convexHull(points: Vec2[]): Vec2[] {
    points.sort(function (a, b) {
      return a.x != b.x ? a.x - b.x : a.y - b.y;
    });
    const n = points.length;
    const hull = [];
    for (let i = 0; i < 2 * n; i++) {
      const j = i < n ? i : 2 * n - 1 - i;
      while (
        hull.length >= 2 &&
        this.removeMiddle(
          hull[hull.length - 2],
          hull[hull.length - 1],
          points[j]
        )
      )
        hull.pop();
      hull.push(points[j]);
    }
    hull.pop();
    return hull;
  }

  removeMiddle(a: Vec2, b: Vec2, c: Vec2): boolean {
    const cross = (a.x - b.x) * (c.y - b.y) - (a.y - b.y) * (c.x - b.x);
    const dot = (a.x - b.x) * (c.x - b.x) + (a.y - b.y) * (c.y - b.y);
    return cross < 0 || (cross == 0 && dot <= 0);
  }

  checkExplain() {
    this.explainLabel.active = !this.explainLabel.active;
  }
}
