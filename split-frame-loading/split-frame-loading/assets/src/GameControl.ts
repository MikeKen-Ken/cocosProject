import { LoadingMask } from './LoadingMask';
import { Loading } from './Loading';

import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SplitFrameLoading')
export class SplitFrameLoading extends Component {
    @property(Loading)
    loading: Loading;

    @property(LoadingMask)
    loadingMask: LoadingMask;

    public async splitFrameLoad() {
        this.loadingMask.show();
        this.loading.clear();
        await this.loading.splitFrameLoading();
        this.loadingMask.hide();
    }

    public async directLoad() {
        this.loadingMask.show();
        this.loading.clear();
        await this.loading.directLoad();
        this.loadingMask.hide();
    }
}
