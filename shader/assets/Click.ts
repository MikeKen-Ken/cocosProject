import { Component, Node, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Click')
export class Click extends Component {
    @property(Node)
    n: Node = null!;

    next() {
        let num = 0;
        this.n.children.map((n, i) => {
            if (n.active === true) {
                n.active = false;
                num = i + 1 === this.n.children.length ? 0 : i + 1;
            }
        });
        this.n.children[num].active = true;
    }

    last() {
        let num = 0;
        this.n.children.map((n, i) => {
            if (n.active === true) {
                n.active = false;
                num = i - 1 < 0 ? this.n.children.length - 1 : i - 1;
            }
        });
        this.n.children[num].active = true;
    }
}
