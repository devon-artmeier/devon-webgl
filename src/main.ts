import { WebGLInstance } from "./instance";
import { TextureFilter, TextureWrap } from "./texture";
import { Color } from "./color";
import { VBOUsage } from "./vbo";
import { EBOUsage } from "./ebo";
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

const cubeVertices = new Float32Array([
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
gl.createVBO("vbo_cube", 24, [3, 2], VBOUsage.Static);
gl.setVBOData("vbo_cube", cubeVertices, 0);
gl.bufferVBOData("vbo_cube");

const elementsCube = new Uint16Array([
	0,  1,  2,  1,  2,  3,
	4,  5,  6,  5,  6,  7,
	8,  9,  10, 9,  10, 11,
	12, 13, 14, 13, 14, 15,
	16, 17, 18, 17, 18, 19,
	20, 21, 22, 21, 22, 23
]);
gl.createEBO("ebo_cube", 36, EBOUsage.Static);
gl.setEBOData("ebo_cube", elementsCube, 0);
gl.bufferEBOData("ebo_cube");

const squareVertices = new Float32Array([
	-64, -64,  64,  0, 1,
	 64, -64,  64,  1, 1,
	-64,  64,  64,  0, 0,
	 64,  64,  64,  1, 0
]);
gl.createVBO("vbo_square", 4, [3, 2], VBOUsage.Static);
gl.setVBOData("vbo_square", squareVertices, 0);
gl.bufferVBOData("vbo_square");

const elementsSquare = new Uint16Array([
	0,  1,  2,  1,  2,  3
]);
gl.createEBO("ebo_square", 6, EBOUsage.Static);
gl.setEBOData("ebo_square", elementsSquare, 0);
gl.bufferEBOData("ebo_square");

gl.createVAO("vao_cube");
gl.setVAOBuffers("vao_cube", "vbo_cube", "ebo_cube");

gl.createVAO("vao_square");
gl.setVAOBuffers("vao_square", "vbo_square", "ebo_square");

gl.createFBO("fbo", 320, 224);

let ortho = gl.orthoMatrix(-160, 160, -112, 112, 0.1, 512);
ortho = gl.perspectiveMatrix(60, 320, 224, 0.1, 1000);

function render(time: number)
{
	gl.bindFBO("fbo");
	
	gl.clearScreen(Color.FromRGBA(0, 0, 1, 1));
	gl.useShader("shader_main");
	gl.setActiveTexture("texture_test", 0);
	gl.setShaderUniform1i("shader_main", "txt", 0);
	
	let model = gl.translateMatrix(-128, 0, 0);
	model = model.multiply(gl.rotateMatrix(gl.degToRad(time/25),gl.degToRad(time/25),gl.degToRad(time/25)));
	
	let x = Math.cos(gl.degToRad(time/4))*256;
	let z = Math.sin(gl.degToRad(time/4))*256;
	
	let view = gl.lookAtMatrix(new Vector3([x,z,256]), new Vector3([0,0,0]), new Vector3([0,1,0]));
	
	gl.setShaderUniformMatrix4fv("shader_main", "model", model.flat());
	gl.setShaderUniformMatrix4fv("shader_main", "view", view.flat());
	gl.setShaderUniformMatrix4fv("shader_main", "projection", ortho.flat());
	
	gl.drawVAO("vao_cube");
	
	model = gl.translateMatrix(128, 0, 0);
	model = model.multiply(gl.rotateMatrix(0,0,gl.degToRad(time/10)));
	gl.setShaderUniformMatrix4fv("shader_main", "model", model.flat());
	
	gl.drawVAO("vao_square");
	
	gl.unbindFBO();
	
	gl.clearScreen(Color.FromRGBA(1, 0, 1, 1));
	gl.useShader("shader_main");
	gl.setActiveTextureFBO("fbo", 0);
	gl.setShaderUniform1i("shader_main", "txt", 0);
	
	model = gl.translateMatrix(-128, 0, 0);
	model = model.multiply(gl.rotateMatrix(gl.degToRad(time/25),gl.degToRad(time/25),gl.degToRad(time/25)));
	
	x = Math.cos(gl.degToRad(time/4))*256;
	z = Math.sin(gl.degToRad(time/4))*256;

	view = gl.lookAtMatrix(new Vector3([x,z,256]), new Vector3([0,0,0]), new Vector3([0,1,0]));
	
	gl.setShaderUniformMatrix4fv("shader_main", "model", model.flat());
	gl.setShaderUniformMatrix4fv("shader_main", "view", view.flat());
	gl.setShaderUniformMatrix4fv("shader_main", "projection", ortho.flat());
	
	gl.drawVAO("vao_cube");
	
	model = gl.translateMatrix(128, 0, 0);
	model = model.multiply(gl.rotateMatrix(0,0,gl.degToRad(time/10)));
	gl.setShaderUniformMatrix4fv("shader_main", "model", model.flat());
	
	gl.drawVAO("vao_square");
	
	requestAnimationFrame(render);
}

requestAnimationFrame(render);
