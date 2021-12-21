import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ItemCtrl
 * DateTime = Tue Dec 21 2021 11:01:59 GMT+0800 (中国标准时间)
 * Author = 庐山烟雨潮
 * FileBasename = ItemCtrl.ts
 * FileBasenameNoExtension = ItemCtrl
 * URL = db://assets/ItemCtrl.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('ItemCtrl')
export class ItemCtrl extends Component {
    @property(Label)
    itemLabel: Label = null;

    bindData(itemIndex: string) {
        this.itemLabel.string = itemIndex + '';
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
