import { WebGLInstance } from "./instance";
import { TextureFilter, TextureWrap } from "./texture";
import { Color } from "./color";
import { VBOUsage } from "./vertex-buffer";
import { EBOUsage } from "./element-buffer";
import { Vector3 } from "./vector";

// Vertex shader code
const vertexShaderCode =
`#version 300 es

layout (location = 0) in vec3 vecFragCoord;
layout (location = 1) in vec2 vecTexCoord;

out vec2 texCoord;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;

void main(void)
{
	texCoord = vecTexCoord;
	gl_Position = projection * view * model * vec4(vecFragCoord, 1);
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
gl.enableDepthTest();

gl.createTexture("texture_test");
gl.setTextureFilter("texture_test", TextureFilter.Bilinear);
gl.setTextureWrap("texture_test", TextureWrap.Clamp, TextureWrap.Clamp);
gl.loadTextureImage("texture_test", "./img/test.png");

gl.createShader("shader_main", vertexShaderCode, fragShaderCode);

const screenVertices = new Float32Array([
	-64, -64,  64,  0, 1,
	 64, -64,  64,  1, 1,
	-64,  64,  64,  0, 0,
	 64,  64,  64,  1, 0,
	 
	 64, -64, -64,  0, 1,
	-64, -64, -64,  1, 1,
	 64,  64, -64,  0, 0,
	-64,  64, -64,  1, 0,
	
	-64, -64, -64,  0, 1,
	-64, -64,  64,  1, 1,
	-64,  64, -64,  0, 0,
	-64,  64,  64,  1, 0,
	
	 64, -64,  64,  0, 1,
	 64, -64, -64,  1, 1,
	 64,  64,  64,  0, 0,
	 64,  64, -64,  1, 0,
	 
	-64, -64, -64,  0, 1,
	 64, -64, -64,  1, 1,
	-64, -64,  64,  0, 0,
	 64, -64,  64,  1, 0,
	 
	-64,  64,  64,  0, 1,
	 64,  64,  64,  1, 1,
	-64,  64, -64,  0, 0,
	 64,  64, -64,  1, 0,
]);
gl.createVBO("vbo_screen", 24, [3, 2], VBOUsage.Dynamic);
gl.setVBOData("vbo_screen", screenVertices, 0);
gl.bufferVBOData("vbo_screen");

const elements = new Uint16Array([
	0,  1,  2,  1,  2,  3,
	4,  5,  6,  5,  6,  7,
	8,  9,  10, 9,  10, 11,
	12, 13, 14, 13, 14, 15,
	16, 17, 18, 17, 18, 19,
	20, 21, 22, 21, 22, 23
]);
gl.createEBO("ebo_screen", 36, EBOUsage.Dynamic);
gl.setEBOData("ebo_screen", elements, 0);
gl.bufferEBOData("ebo_screen");

let ortho = gl.orthoMatrix(-160, 160, -112, 112, 0.1, 512);
ortho = gl.perspectiveMatrix(60, 320, 224, 0.1, 512);

function render(time: number)
{
	gl.clearScreen(Color.FromRGBA(1, 0, 1, 1));
	gl.useShader("shader_main");
	gl.setActiveTexture("texture_test", 0);
	gl.setShaderUniform1i("shader_main", "txt", 0);
	
	let model = gl.translateMatrix(0, 0, 0);
	model = model.multiply(gl.rotateMatrix(gl.degToRad(time/25),gl.degToRad(time/25),gl.degToRad(time/25)));
	
	let x = Math.cos(gl.degToRad(time/4))*256;
	let z = Math.sin(gl.degToRad(time/4))*256;
	
	let view = gl.lookAtMatrix(new Vector3([x,z,256]), new Vector3([0,0,0]), new Vector3([0,1,0]));
	
	gl.setShaderUniformMatrix4fv("shader_main", "model", model.flat());
	gl.setShaderUniformMatrix4fv("shader_main", "view", view.flat());
	gl.setShaderUniformMatrix4fv("shader_main", "projection", ortho.flat());
	
	gl.drawVBOWithEBO("vbo_screen", "ebo_screen");
	requestAnimationFrame(render);
}

requestAnimationFrame(render);
