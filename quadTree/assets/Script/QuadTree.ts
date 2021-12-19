/**
 * quadtree-js
 * @version 1.2.3
 * @license MIT
 * @author Timo Hausmann
 */

/* https://github.com/timohausmann/quadtree-js.git v1.2.3 */

/*
Copyright © 2012-2020 Timo Hausmann
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

export class Quadtree {
    public max_objects: number;
    public max_levels: number;
    public level: number;
    public bounds: any;
    public objects: Array<cc.Node>;
    public subNodes: Array<Quadtree>;
    /**
     * Quadtree Constructor
     * @param Object bounds            bounds of the node { x, y, width, height }
     * @param Integer max_objects      (optional) max objects a node can hold before splitting into 4 subnodes (default: 10)
     * @param Integer max_levels       (optional) total max levels inside root Quadtree (default: 4)
     * @param Integer level            (optional) depth level, required for subnodes (default: 0)
     */
    public constructor(bounds, max_objects?, max_levels?, level?) {
        //* 叶节点最大容量
        this.max_objects = max_objects || 10;
        //* 四叉树深度
        this.max_levels = max_levels || 4;

        this.level = level || 0;
        this.bounds = bounds;

        this.objects = [];
        this.subNodes = [];
    }

    /**
     * Split the node into 4 subnodes
     */
    split() {
        var nextLevel = this.level + 1,
            subWidth = this.bounds.width / 2,
            subHeight = this.bounds.height / 2,
            x = this.bounds.x,
            y = this.bounds.y;

        //top right node
        this.subNodes[0] = new Quadtree(
            {
                x: x + subWidth,
                y: y,
                width: subWidth,
                height: subHeight,
            },
            this.max_objects,
            this.max_levels,
            nextLevel
        );

        //top left node
        this.subNodes[1] = new Quadtree(
            {
                x: x,
                y: y,
                width: subWidth,
                height: subHeight,
            },
            this.max_objects,
            this.max_levels,
            nextLevel
        );

        //bottom left node
        this.subNodes[2] = new Quadtree(
            {
                x: x,
                y: y + subHeight,
                width: subWidth,
                height: subHeight,
            },
            this.max_objects,
            this.max_levels,
            nextLevel
        );

        //bottom right node
        this.subNodes[3] = new Quadtree(
            {
                x: x + subWidth,
                y: y + subHeight,
                width: subWidth,
                height: subHeight,
            },
            this.max_objects,
            this.max_levels,
            nextLevel
        );
    }

    /**
     * *判断node属于哪一个区域（象限）
     * @param Object pRect      bounds of the area to be checked, with x, y, width, height
     * @return Array            an array of indexes of the intersecting subnodes
     *                          (0-3 = top-right, top-left, bottom-left, bottom-right / ne, nw, sw, se)
     */
    getIndex(node: cc.Node) {
        let pRect = node.getBoundingBox();
        var indexes = [],
            verticalMidpoint = this.bounds.x + this.bounds.width / 2,
            horizontalMidpoint = this.bounds.y + this.bounds.height / 2;

        var startIsNorth = pRect.y < horizontalMidpoint,
            startIsWest = pRect.x < verticalMidpoint,
            endIsEast = pRect.x + pRect.width > verticalMidpoint,
            endIsSouth = pRect.y + pRect.height > horizontalMidpoint;

        //top-right quad
        if (startIsNorth && endIsEast) {
            indexes.push(0);
        }

        //top-left quad
        if (startIsWest && startIsNorth) {
            indexes.push(1);
        }

        //bottom-left quad
        if (startIsWest && endIsSouth) {
            indexes.push(2);
        }

        //bottom-right quad
        if (endIsEast && endIsSouth) {
            indexes.push(3);
        }

        return indexes;
    }

    /**
     * 插入一个obj
     * @param Object pRect        bounds of the object to be added { x, y, width, height }
     */
    insert(obj: cc.Node) {
        var i = 0,
            indexes;
        // 如果有子叶节点，obj插入到对应index的子叶节点
        if (this.subNodes.length) {
            indexes = this.getIndex(obj);

            for (i = 0; i < indexes.length; i++) {
                this.subNodes[indexes[i]].insert(obj);
            }
            return;
        }

        // 没有子节点，加入本叶节点
        this.objects.push(obj);

        // 本叶节点装满了
        if (
            this.objects.length > this.max_objects &&
            this.level < this.max_levels
        ) {
            // 如果没有子节点，那就创建子节点
            if (!this.subNodes.length) {
                this.split();
            }

            // 把所有obj插入子节点
            for (i = 0; i < this.objects.length; i++) {
                indexes = this.getIndex(this.objects[i]);
                for (var k = 0; k < indexes.length; k++) {
                    this.subNodes[indexes[k]].insert(this.objects[i]);
                }
            }

            // 清空本节点的obj
            this.objects = [];
        }
    }

    /**
     * Return all objects that could collide with the given object
     * @param Object pRect      bounds of the object to be checked { x, y, width, height }
     * @return Array            array with all detected objects
     */
    retrieve(obj: cc.Node) {
        var indexes = this.getIndex(obj),
            returnObjects = this.objects;

        // 如果有子节点，则从子节点返回objs
        if (this.subNodes.length) {
            for (var i = 0; i < indexes.length; i++) {
                returnObjects = returnObjects.concat(
                    this.subNodes[indexes[i]].retrieve(obj)
                );
            }
        }

        // 删除重复obj
        returnObjects = returnObjects.filter(function (item, index) {
            return returnObjects.indexOf(item) >= index;
        });

        return returnObjects;
    }

    clear() {
        this.objects = [];
        this.subNodes.forEach((node) => {
            node.clear();
        });
        this.subNodes = [];
    }
}
