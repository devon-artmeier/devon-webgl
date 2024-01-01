import { WebGLInstance } from "./instance";
import { Texture, TextureFilter, TextureWrap } from "./texture";

const gl = new WebGLInstance(document.getElementById("test-canvas") as HTMLCanvasElement);

const texture = new Texture("global", "test");
texture.setFilter(TextureFilter.Nearest);
texture.setWrap(TextureWrap.Clamp, TextureWrap.Clamp);
texture.loadImage("./img/test.png");
