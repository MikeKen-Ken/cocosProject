import { ItemCtrl } from './ItemCtrl';
import { _decorator, Component, Node, EditBox, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Loading')
export class Loading extends Component {
    @property(Prefab)
    private item: Prefab = null;

    @property(EditBox)
    private editBox: EditBox = null;

    @property(Node)
    private targetParent: Node = null;

    async directLoad() {
        await new Promise<void>(resolve => {
            for (let i = 0; i < Number(this.editBox.string); i++) {
                this.initItem(i + '');
            }
            resolve();
        });
    }

    async splitFrameLoading() {
        await this.executePreFrame(
            this.getItemGenerator(Number(this.editBox.string)),
            1
        );
    }

    //* duration 毫秒为单位
    private executePreFrame(generator: Generator, duration: number) {
        return new Promise<void>(resolve => {
            const execute = () => {
                const startTime = new Date().getTime();
                while (generator.next().done === false) {
                    if (new Date().getTime() - startTime > duration) {
                        this.scheduleOnce(() => {
                            execute();
                        });
                        return;
                    }
                }
                resolve();
            };
            execute();
        });
    }

    *getItemGenerator(length: number) {
        for (let i = 0; i < length; i++) {
            yield this.initItem(i + '');
        }
    }

    initItem(label: string) {
        const p = instantiate(this.item);
        p.getComponent(ItemCtrl).bindData(label);
        this.targetParent.addChild(p);
    }

    clear() {
        this.targetParent.removeAllChildren();
    }
}
