import type {LoadImgRes} from "./assetsLoader.types.ts";

function clearFileName(params = "") {
  return params.split("/").pop();
}

export const loadImg = (imgList: string[]): Promise<LoadImgRes[]> => {
  const loadTask: Promise<LoadImgRes>[] = [];

  for (const url of imgList) {
    loadTask.push(
      new Promise((res, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = function () {
          createImageBitmap(img).then((bitmap) => {
            res({
              name: clearFileName(url)!,
              uri: img,
              width: img.width,
              height: img.height,
              bitmap,
            });
          });
        };
        img.onerror = function () {
          reject(new Error(`load img error: ${url}`));
        }
      })
    );
  }

  return Promise.all(loadTask);
};
