import type {LoadImgRes} from "./assetsLoader.types.ts";
import {loadImg} from "./assetsLoaderUtils.ts";

const onSeatUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAMAAAAPdrEwAAAAYFBMVEUAAACMxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf9itJhsAAAAH3RSTlMAliLdaXiHWuv7u9LIMhbvsqaR9d69cGJPTCkeDGZBhT6b/AAAAPxJREFUWMPt01lOxDAQhOEaExKbOM4y+wJ9/1sSYIRGwmHEuFu81H+A76Gkws/cbmx7+UN9O+4c7neI8lDxcAc+b+Xhtmf8UuelIN9hMddLUf3y4lEKi1iokeIa5GvL6RbZkiiUkOuoQb8ZTT3XkP4f+lKNL3MNag26xvFDG6sLkK5HecZKg16hup4nYRIbWiZsrOgNghUdIFa0kCZNmjRp0qRJkyZNmjRp0qRJkyZNeoFOTqGUpXXK0P5JKf9NBzEqwItRHlGMipjEqAkno7HDCdib2GGPOfdaf6ZjflmVw206NHJ5DblHrkGDHpCrW5fL6w55eyjcxA+38juKQFJKYbX+lQAAAABJRU5ErkJggg=="
const unSeatUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAMAAAAPdrEwAAAAXVBMVEUAAACZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmIF5V4AAAAHnRSTlMALdIiM92pvPp3WuyQiDwnzvFMaQhhQxzHsm8UnIbSJbCXAAABTUlEQVRYw+3Zy26DMBCF4cHYxI0dbG4J5HLe/zGb0gYhNW5aBtTN/FtL32LkWQ19Lz8XqsIfqlRxzul1dY9F9fUL+LQDoHx31CH/ZUEfO68A7E4/ydoB10ALClfAaUqWO5iSFlYaVOmJ9zAnWtxFoadEe9iMGAWLfeIpwhOrA2LidwAZj86A5wOtUREzh2Ni1IpLK+yF/h+6bYrdmFqDVp9W0bTjek6x6bl1IY/Kv435NeiH5eDJoJl2iU9P+9zBkEW5Ba1hCci2oDNAaKGFFlpooYUWWmihhRZaaKGFFlpooYVO0tYws0maX4Ju8xVqZ7SFpg3SsImjBLsjHEWcaYMaRPKI7fpyG+EpWJjiq8AVw0MysHess3hUculyomxH9/LmdvhoHXqkbk1O89ahE7exmkvXcPSsAbHWrOqI4SmtK7CrdGI5BwdWbpjL7/6mZ3qtwG0OAAAAAElFTkSuQmCC"

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
