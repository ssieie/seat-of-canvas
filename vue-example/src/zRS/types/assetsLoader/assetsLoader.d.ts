import type { LoadImgRes } from "./assetsLoader.types.ts";
declare class AssetsLoader {
    static onSeat: LoadImgRes;
    static unSeat: LoadImgRes;
    static load(): Promise<void>;
}
export default AssetsLoader;
