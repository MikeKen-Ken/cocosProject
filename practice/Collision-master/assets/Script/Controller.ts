const { ccclass, property } = cc._decorator;
import { Quadtree } from './QuadTree';

@ccclass
export default class Controller extends cc.Component {
    @property(cc.Prefab)
    nodePrefab: cc.Prefab = null;

    @property(cc.Label)
    btnTreeLabel: cc.Label = null;

    openQuadTree: boolean = false;
    nodes: Array<cc.Node> = [];
    tree: Quadtree = null;

    @property()
    count = 100;

    @property(cc.EditBox)
    editBox: cc.EditBox = null;

    start() {
        //* 新建四叉树
        if (this.tree) {
            this.tree.clear();
        }
        var bounds = {
            x: 0,
            y: 0,
            width: cc.Canvas.instance.node.width,
            height: cc.Canvas.instance.node.height,
        };
        this.tree = new Quadtree(bounds);

        this.editBox.node.on('editing-did-ended', this.resetNode, this);

        for (let i = 0; i < parseInt(this.editBox.string); i++) {
            let newNode = cc.instantiate(this.nodePrefab);
            this.node.addChild(newNode);
            this.nodes.push(newNode);
            this.tree.insert(newNode);
        }
        this.updateBtnString();
    }

    resetNode(editBox) {
        this.nodes.forEach((node) => {
            node.destroy();
            node = null;
            this.nodes = [];
        });
        this.start();
    }

    clickBtnTree() {
        this.openQuadTree = !this.openQuadTree;
        this.updateBtnString();
    }

    updateBtnString() {
        this.btnTreeLabel.string = this.openQuadTree
            ? '关闭四叉树'
            : '开启四叉树';
    }

    /**
     * 四叉树碰撞检测
     */
    quadTreeCheck() {
        for (let node of this.nodes) {
            node.getComponent('Node').setIsCollision(false);
            this.tree.insert(node);
        }
        for (let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i];
            //* 主要区别是第二层节点
            let targetNodes = this.tree.retrieve(node);
            for (let j = 0; j < targetNodes.length; j++) {
                let targetNode = targetNodes[j];
                if (targetNode === node) continue;
                let isCollision: any = targetNode
                    .getBoundingBoxToWorld()
                    .intersects(node.getBoundingBoxToWorld());
                if (isCollision) {
                    node.getComponent('Node').setIsCollision(isCollision);
                    targetNode.getComponent('Node').setIsCollision(isCollision);
                }
            }
        }
        this.tree.clear();
    }

    /**
     * 普通碰撞检测
     */
    normalCheck() {
        for (let node of this.nodes) {
            node.getComponent('Node').setIsCollision(false);
        }
        for (let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i];
            for (let j = 0; j < this.nodes.length; j++) {
                let targetNode = this.nodes[j];
                if (targetNode === node) continue;
                let isCollision: any = targetNode
                    .getBoundingBoxToWorld()
                    .intersects(node.getBoundingBoxToWorld());
                if (isCollision) {
                    node.getComponent('Node').setIsCollision(isCollision);
                    targetNode.getComponent('Node').setIsCollision(isCollision);
                }
            }
        }
    }

    update(dt) {
        if (this.openQuadTree) {
            this.quadTreeCheck();
        } else {
            this.normalCheck();
        }
    }
}
