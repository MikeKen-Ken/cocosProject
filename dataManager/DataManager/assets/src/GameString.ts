import { _decorator } from 'cc';
const { ccclass } = _decorator;

interface GameStringType {
    ID: string;
    CH: string;
    TW: string;
    EN: string;
}
@ccclass('GameString')
export class GameString {
    private static datas: { [name: string]: GameStringType } = {};

    public static setData(data) {
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const element = data[key];
                this.datas[`${key}`] = element;
            }
        }
        console.log(this.datas['PASSED_STR_7'].CH);
    }
}
