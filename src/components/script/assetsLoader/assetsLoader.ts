import type {LoadImgRes} from "./assetsLoader.types.ts";
import {loadImg} from "./assetsLoaderUtils.ts";

const onSeatUri = "/src/components/assets/images/on-seat.png"
const unSeatUri = "/src/components/assets/images/un-seat.png"

class AssetsLoader {

  static onSeat: LoadImgRes

  static unSeat: LoadImgRes

  static async load() {
    const [onSeat] = await loadImg([onSeatUri]);
    AssetsLoader.onSeat = onSeat;
    const [unSeat] = await loadImg([unSeatUri]);
    AssetsLoader.unSeat = unSeat;
  }
}

export default AssetsLoader
