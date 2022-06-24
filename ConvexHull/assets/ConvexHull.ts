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
    const convexArray = this.grahamScanConvexHullAlgorithms(this.pointArray);
    convexArray.map((p, i) => {
      this.graphics.moveTo(p.x, p.y);
      const nextIndex = i + 1 < convexArray.length ? i + 1 : 0;
      this.graphics.lineTo(convexArray[nextIndex].x, convexArray[nextIndex].y);
    });
    this.graphics.stroke();
  }

  //graham Scan Algorithms to get convex hull
  grahamScanConvexHullAlgorithms(points: Vec2[]) {
    let convexHull = [];
    let minPoint = points[0];
    for (let i = 1; i < points.length; i++) {
      if (points[i].y < minPoint.y) {
        minPoint = points[i];
      }
    }
    points.splice(points.indexOf(minPoint), 1);
    points.sort((a, b) => {
      return (
        (b.x - a.x) * (minPoint.y - a.y) - (b.y - a.y) * (minPoint.x - a.x)
      );
    });
    convexHull.push(minPoint);
    convexHull.push(points[0]);
    convexHull.push(points[1]);
    for (let i = 2; i < points.length; i++) {
      while (
        convexHull.length >= 3 &&
        this.isLeft(
          convexHull[convexHull.length - 2],
          convexHull[convexHull.length - 1],
          points[i]
        )
      )
        convexHull.pop();
      convexHull.push(points[i]);
    }
    return convexHull;
  }

  isLeft(a: Vec2, b: Vec2, c: Vec2): boolean {
    const cross = (a.x - b.x) * (c.y - b.y) - (a.y - b.y) * (c.x - b.x);
    return cross < 0;
  }

  checkExplain() {
    this.explainLabel.active = !this.explainLabel.active;
  }
}
