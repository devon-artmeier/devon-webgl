import { TextureFilter, TextureWrap, BufferUsage, Condition, StencilOption } from "./types/enums";
import { Color } from "./types/color";
import { Vector3 } from "./types/vector";

import { Context } from "./functions/context"
import { Texture } from "./functions/texture"
import { Shader } from "./functions/shader"
import { VertexBuffer } from "./functions/vertex-buffer"
import { ElementBuffer } from "./functions/element-buffer"
import { VertexArray } from "./functions/vertex-array"
import { Framebuffer } from "./functions/framebuffer"
import { WebGLMath } from "./functions/math"

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

// Fragment shader base code 2
const fragShaderCode2 = 
`#version 300 es
precision highp float;

in vec2 texCoord;
out vec4 fragColor;

void main(void)
{
	fragColor = vec4(0, 0, 1, 1);
}
`;

Context.create("main", document.getElementById("test-canvas") as HTMLCanvasElement);

Texture.create("main", "texture_test");
Texture.setFilter("main", "texture_test", TextureFilter.Bilinear);
Texture.setWrap("main", "texture_test", TextureWrap.Clamp, TextureWrap.Clamp);
Texture.loadImage("main", "texture_test", "./img/test.png");

Shader.create("main", "shader_main", vertexShaderCode, fragShaderCode);
Shader.create("main", "shader_main2", vertexShaderCode, fragShaderCode2);

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
VertexBuffer.create("main", "vbo_cube", 24, [3, 2], BufferUsage.Static);
VertexBuffer.setData("main", "vbo_cube", cubeVertices, 0);
VertexBuffer.bufferData("main", "vbo_cube");

const elementsCube = new Uint16Array([
	0,  1,  2,  1,  2,  3,
	4,  5,  6,  5,  6,  7,
	8,  9,  10, 9,  10, 11,
	12, 13, 14, 13, 14, 15,
	16, 17, 18, 17, 18, 19,
	20, 21, 22, 21, 22, 23
]);
ElementBuffer.create("main", "ebo_cube", 36, BufferUsage.Static);
ElementBuffer.setData("main", "ebo_cube", elementsCube, 0);
ElementBuffer.bufferData("main", "ebo_cube");

const squareVertices = new Float32Array([
	-64, -64,  64,  0, 1,
	 64, -64,  64,  1, 1,
	-64,  64,  64,  0, 0,
	 64,  64,  64,  1, 0
]);
VertexBuffer.create("main", "vbo_square", 4, [3, 2], BufferUsage.Static);
VertexBuffer.setData("main", "vbo_square", squareVertices, 0);
VertexBuffer.bufferData("main", "vbo_square");

const elementsSquare = new Uint16Array([
	0,  1,  2,  1,  2,  3
]);
ElementBuffer.create("main", "ebo_square", 6, BufferUsage.Static);
ElementBuffer.setData("main", "ebo_square", elementsSquare, 0);
ElementBuffer.bufferData("main", "ebo_square");

VertexArray.create("main", "vao_cube");
VertexArray.setBuffers("main", "vao_cube", "vbo_cube", "ebo_cube");

VertexArray.create("main", "vao_square");
VertexArray.setBuffers("main", "vao_square", "vbo_square", "ebo_square");

Framebuffer.create("main", "fbo", 256, 256);

let ortho = WebGLMath.orthoMatrix(-160, 160, -112, 112, 0.1, 512);

Context.enableDepth("main");
Context.enableStencil("main");
Context.setStencilOptions("main", StencilOption.Keep, StencilOption.Keep, StencilOption.Replace);

function render(time: number)
{
	///////////////////////////////////////////////////////////////
	
	Framebuffer.bind("main", "fbo");
	Context.setViewport("main", 0, 0, 256, 256);
	Context.clear("main", Color.FromRGBA(1, 0, 1, 1));
	
	ortho = WebGLMath.perspectiveMatrix(60, 256, 256, 0.1, 1000);

	Context.setStencilFunction("main", Condition.Always, 1, 0xFF);
	Context.setStencilMask("main", 0xFF);

	let model = WebGLMath.translateMatrix(0, 0, 0);
	model = model.multiply(WebGLMath.rotateMatrix(
		WebGLMath.degToRad(time/25),WebGLMath.degToRad(time/25),WebGLMath.degToRad(time/25)));
	
	let x = Math.cos(WebGLMath.degToRad(time/4))*256;
	let z = Math.sin(WebGLMath.degToRad(time/4))*256;

	let view = WebGLMath.lookAtMatrix(new Vector3([x,z,128]), new Vector3([0,0,0]), new Vector3([0,1,0]));
	
	Shader.setUniformMatrix4fv("main", "shader_main", "model", model.flat());
	Shader.setUniformMatrix4fv("main", "shader_main", "view", view.flat());
	Shader.setUniformMatrix4fv("main", "shader_main", "projection", ortho.flat());;

	Shader.bind("main", "shader_main");
	Texture.setActive("main", 0);
	Texture.bind("main", "texture_test");
	Shader.setUniform1i("main", "shader_main", "txt", 0);
	VertexArray.draw("main", "vao_cube");
	
	Framebuffer.unbind("main");
	
	///////////////////////////////////////////////////////////////

	Context.setViewport("main", 0, 0, 640, 480);
	Context.clear("main", Color.FromRGBA(1, 0, 1, 1));
	
	ortho = WebGLMath.perspectiveMatrix(60, 640, 480, 0.1, 1000);
	
	Context.setStencilFunction("main", Condition.Always, 1, 0xFF);
	Context.setStencilMask("main", 0xFF)

	model = WebGLMath.translateMatrix(0, 0, 0);
	model = model.multiply(WebGLMath.rotateMatrix(
		WebGLMath.degToRad(time/25),WebGLMath.degToRad(time/25),WebGLMath.degToRad(time/25)));
	
	x = Math.cos(WebGLMath.degToRad(time/4))*256;
	z = Math.sin(WebGLMath.degToRad(time/4))*256;

	view = WebGLMath.lookAtMatrix(new Vector3([x,z,256]), new Vector3([0,0,0]), new Vector3([0,1,0]));
	
	Shader.setUniformMatrix4fv("main", "shader_main", "model", model.flat());
	Shader.setUniformMatrix4fv("main", "shader_main", "view", view.flat());
	Shader.setUniformMatrix4fv("main", "shader_main", "projection", ortho.flat());;

	Shader.bind("main", "shader_main");
	Texture.setActive("main", 0);
	Framebuffer.bindTexture("main", "fbo");
	Shader.setUniform1i("main", "shader_main", "txt", 0);
	VertexArray.draw("main", "vao_cube");
	
	///////////////////////////////////////////////////////////////
	
	Context.setStencilFunction("main", Condition.NotEqual, 1, 0xFF);
	Context.setStencilMask("main", 0x00);
	Context.disableDepth("main");
	
	model = WebGLMath.translateMatrix(0, 0, 0);
	model = model.multiply(WebGLMath.rotateMatrix(
		WebGLMath.degToRad(time/25),WebGLMath.degToRad(time/25),WebGLMath.degToRad(time/25)));
	model = model.multiply(WebGLMath.scaleMatrix(1.1, 1.1, 1.1));
	
	Shader.setUniformMatrix4fv("main", "shader_main2", "model", model.flat());
	Shader.setUniformMatrix4fv("main", "shader_main2", "view", view.flat());
	Shader.setUniformMatrix4fv("main", "shader_main2", "projection", ortho.flat());;

	Shader.bind("main", "shader_main2");
	VertexArray.draw("main", "vao_cube");
	
	Context.setStencilMask("main", 0xFF);
	Context.setStencilFunction("main", Condition.Always, 1, 0xFF);
	Context.enableDepth("main");
	
	requestAnimationFrame(render);
}

requestAnimationFrame(render);
