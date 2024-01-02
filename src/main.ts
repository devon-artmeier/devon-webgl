import { WebGLInstance } from "./instance";
import { TextureFilter, TextureWrap } from "./texture";
import { Color } from "./color";
import { VBOUsage } from "./vertex-buffer";
import { EBOUsage } from "./element-buffer";

// Vertex shader code
const vertexShaderCode =
`#version 300 es

layout (location = 0) in vec2 vecFragCoord;
layout (location = 1) in vec2 vecTexCoord;

out vec2 texCoord;

void main(void)
{
	texCoord = vecTexCoord;
	gl_Position = vec4(vecFragCoord, 0.0, 1.0);
}
`;

// Fragment shader base code
const fragShaderCode = 
`#version 300 es
precision highp float;

in vec2 texCoord;
out vec4 fragColor;
uniform sampler2D txt;

void main(void)
{
	fragColor = texture(txt, texCoord);
}
`;

const gl = new WebGLInstance(document.getElementById("test-canvas") as HTMLCanvasElement);

gl.setViewport(0, 0, 320, 224);

gl.createTexture("texture_test");
gl.setTextureFilter("texture_test", TextureFilter.Nearest);
gl.setTextureWrap("texture_test", TextureWrap.Clamp, TextureWrap.Clamp);
gl.loadTextureImage("texture_test", "./img/test.png");

gl.createShader("shader_main", vertexShaderCode, fragShaderCode);

const screenVertices = new Float32Array([
	-1, -1,  0, 1,
	 1, -1,  1, 1,
	-1,  1,  0, 0,
	 1,  1,  1, 0
]);
gl.createVBO("vbo_screen", 4, [2, 2], VBOUsage.Dynamic);
gl.setVBOData("vbo_screen", screenVertices, 0);
gl.bufferVBOData("vbo_screen");

const elements = new Uint16Array([
	0, 1, 2, 1, 2, 3
]);
gl.createEBO("ebo_screen", 6, EBOUsage.Dynamic);
gl.setEBOData("ebo_screen", elements, 0);
gl.bufferEBOData("ebo_screen");

function render(time: number)
{
	gl.clearColor(Color.FromRGBA(1, 0, 1, 1));
	gl.useShader("shader_main");
	gl.setActiveTexture("texture_test", 0);
	gl.setShaderUniform1i("shader_main", "txt", 0);
	gl.drawVBOWithEBO("vbo_screen", "ebo_screen");
	requestAnimationFrame(render);
}

requestAnimationFrame(render);
