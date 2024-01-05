import { TextureFilter, TextureWrap, BufferUsage, Condition, StencilOption } from "./types/enums";
import { Color } from "./types/color";

import * as DevonWebGL from "./components"

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

// Fragment shader base code 3
const fragShaderCode3 = 
`#version 300 es
precision highp float;

in vec2 texCoord;
out vec4 fragColor;

void main(void)
{
	fragColor = vec4(1, 0, 0, 1);
}
`;

// Fragment shader base code 4
const fragShaderCode4 = 
`#version 300 es
precision highp float;

in vec2 texCoord;
out vec4 fragColor;
uniform sampler2D txt;

void main(void)
{
	vec4 color = texture(txt, texCoord);
	fragColor = vec4(color.b, color.g, color.r, color.a);
}
`;

// Fragment shader base code 3
const fragShaderCode5 = 
`#version 300 es
precision highp float;

in vec2 texCoord;
out vec4 fragColor;

void main(void)
{
	fragColor = vec4(0, 0.5, 0, 1);
}
`;

// Fragment shader base code 6
const fragShaderCode6 = 
`#version 300 es
precision highp float;

in vec2 texCoord;
out vec4 fragColor;
uniform sampler2D txt;

void main(void)
{
	vec4 color = texture(txt, texCoord);
	fragColor = vec4(color.r, color.b, color.g, color.a);
}
`;

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

const elementsCube = new Uint16Array([
	0,  1,  2,  1,  2,  3,
	4,  5,  6,  5,  6,  7,
	8,  9,  10, 9,  10, 11,
	12, 13, 14, 13, 14, 15,
	16, 17, 18, 17, 18, 19,
	20, 21, 22, 21, 22, 23
]);

const squareVertices = new Float32Array([
	-64, -64,  64,  0, 1,
	 64, -64,  64,  1, 1,
	-64,  64,  64,  0, 0,
	 64,  64,  64,  1, 0
]);

const elementsSquare = new Uint16Array([
	0,  1,  2,  1,  2,  3
]);

function createContext(contextName: string, canvasID: string, fragCode: string, fragCode2: string)
{
	DevonWebGL.Context.create(contextName, document.getElementById(canvasID) as HTMLCanvasElement);

	DevonWebGL.Texture.create(contextName, "texture_test");
	DevonWebGL.Texture.setFilter(contextName, "texture_test", TextureFilter.Bilinear);
	DevonWebGL.Texture.setWrap(contextName, "texture_test", TextureWrap.Clamp, TextureWrap.Clamp);
	DevonWebGL.Texture.loadImage(contextName, "texture_test", "./img/test.png");

	DevonWebGL.Shader.create(contextName, "shader_main", vertexShaderCode, fragCode);
	DevonWebGL.Shader.create(contextName, "shader_main2", vertexShaderCode, fragCode2);
	DevonWebGL.Shader.create(contextName, "shader_main3", vertexShaderCode, fragShaderCode);
	DevonWebGL.VertexBuffer.create(contextName, "vbo_cube", 24, [3, 2], BufferUsage.Static);
	DevonWebGL.VertexBuffer.setData(contextName, "vbo_cube", cubeVertices, 0);
	DevonWebGL.VertexBuffer.bufferData(contextName, "vbo_cube");

	DevonWebGL.ElementBuffer.create(contextName, "ebo_cube", 36, BufferUsage.Static);
	DevonWebGL.ElementBuffer.setData(contextName, "ebo_cube", elementsCube, 0);
	DevonWebGL.ElementBuffer.bufferData(contextName, "ebo_cube");
	DevonWebGL.VertexBuffer.create(contextName, "vbo_square", 4, [3, 2], BufferUsage.Static);
	DevonWebGL.VertexBuffer.setData(contextName, "vbo_square", squareVertices, 0);
	DevonWebGL.VertexBuffer.bufferData(contextName, "vbo_square");

	DevonWebGL.ElementBuffer.create(contextName, "ebo_square", 6, BufferUsage.Static);
	DevonWebGL.ElementBuffer.setData(contextName, "ebo_square", elementsSquare, 0);
	DevonWebGL.ElementBuffer.bufferData(contextName, "ebo_square");

	DevonWebGL.VertexArray.create(contextName, "vao_cube");
	DevonWebGL.VertexArray.setBuffers(contextName, "vao_cube", "vbo_cube", "ebo_cube");

	DevonWebGL.VertexArray.create(contextName, "vao_square");
	DevonWebGL.VertexArray.setBuffers(contextName, "vao_square", "vbo_square", "ebo_square");

	DevonWebGL.Framebuffer.create(contextName, "fbo", 256, 256);

	DevonWebGL.Context.enableDepth(contextName);
	DevonWebGL.Context.enableStencil(contextName);
	DevonWebGL.Context.setStencilOptions(contextName, StencilOption.Keep, StencilOption.Keep, StencilOption.Replace);
}

function renderContext(contextName: string, time: number, mult: number, mult2: number)
{
	///////////////////////////////////////////////////////////////
	
	DevonWebGL.Framebuffer.bind(contextName, "fbo");
	DevonWebGL.Context.setViewport(contextName, 0, 0, 256, 256);
	DevonWebGL.Context.clear(contextName, Color.FromRGBA(1, 0, 1, 1));
	
	let ortho = DevonWebGL. WebGLMath.perspectiveMatrix(60, 256, 256, 0.1, 1000);

	DevonWebGL.Context.setStencilFunction(contextName, Condition.Always, 1, 0xFF);
	DevonWebGL.Context.setStencilMask(contextName, 0xFF);

	let model = DevonWebGL.WebGLMath.translateMatrix(0, 0, 0);
	model = model.multiply(DevonWebGL.WebGLMath.rotateMatrix(
		DevonWebGL.WebGLMath.degToRad(time / 25 * mult),
		DevonWebGL.WebGLMath.degToRad(time / 25 * mult),
		DevonWebGL.WebGLMath.degToRad(time / 25 * mult)));
	
	let x = Math.cos(DevonWebGL.WebGLMath.degToRad(time / 4 * mult)) * 256;
	let y = Math.sin(DevonWebGL.WebGLMath.degToRad(time / 4 * mult)) * 256;
	let z = Math.sin(DevonWebGL.WebGLMath.degToRad((time / 8) * mult)) * mult2;

	let view = DevonWebGL.WebGLMath.lookAtMatrix(x,y,64+z, 0,0,0, 0,1,0);

	DevonWebGL.Texture.setActive(contextName, 0);
	DevonWebGL.Texture.bind(contextName, "texture_test");

	DevonWebGL.Shader.setUniform1i(contextName, "shader_main", "txt", 0);
	DevonWebGL.Shader.setUniformMatrix4fv(contextName, "shader_main", "model", model.flat());
	DevonWebGL.Shader.setUniformMatrix4fv(contextName, "shader_main", "view", view.flat());
	DevonWebGL.Shader.setUniformMatrix4fv(contextName, "shader_main", "projection", ortho.flat());

	DevonWebGL.Shader.bind(contextName, "shader_main");
	DevonWebGL.Texture.setActive(contextName, 0);
	DevonWebGL.Texture.bind(contextName, "texture_test");
	DevonWebGL.VertexArray.draw(contextName, "vao_cube");
	
	DevonWebGL.Framebuffer.unbind(contextName);
	
	///////////////////////////////////////////////////////////////

	DevonWebGL.Context.setViewport(contextName, 0, 0, 640, 480);
	DevonWebGL.Context.clear(contextName, Color.FromRGBA(1, 0, 1, 1));
	
	ortho = DevonWebGL.WebGLMath.perspectiveMatrix(60, 640, 480, 0.1, 1000);
	
	DevonWebGL.Context.setStencilFunction(contextName, Condition.Always, 1, 0xFF);
	DevonWebGL.Context.setStencilMask(contextName, 0xFF)

	model = DevonWebGL.WebGLMath.translateMatrix(0, 0, 0);
	model = model.multiply(DevonWebGL.WebGLMath.rotateMatrix(
		DevonWebGL.WebGLMath.degToRad(time / 25 * mult),
		DevonWebGL.WebGLMath.degToRad(time / 25 * mult),
		DevonWebGL.WebGLMath.degToRad(time / 25 * mult)));

	view = DevonWebGL.WebGLMath.lookAtMatrix(x,y,256+z, 0,0,0, 0,1,0);
	
	DevonWebGL.Shader.setUniform1i(contextName, "shader_main3", "txt", 0);
	DevonWebGL.Shader.setUniformMatrix4fv(contextName, "shader_main3", "model", model.flat());
	DevonWebGL.Shader.setUniformMatrix4fv(contextName, "shader_main3", "view", view.flat());
	DevonWebGL.Shader.setUniformMatrix4fv(contextName, "shader_main3", "projection", ortho.flat());;

	DevonWebGL.Shader.bind(contextName, "shader_main3");
	DevonWebGL.Texture.setActive(contextName, 0);
	DevonWebGL.Framebuffer.bindTexture(contextName, "fbo");
	DevonWebGL.VertexArray.draw(contextName, "vao_cube");
	
	///////////////////////////////////////////////////////////////
	
	DevonWebGL.Context.setStencilFunction(contextName, Condition.NotEqual, 1, 0xFF);
	DevonWebGL.Context.setStencilMask(contextName, 0x00);
	DevonWebGL.Context.disableDepth(contextName);
	
	model = DevonWebGL.WebGLMath.translateMatrix(0, 0, 0);
	model = model.multiply(DevonWebGL.WebGLMath.rotateMatrix(
		DevonWebGL.WebGLMath.degToRad(time / 25 * mult),
		DevonWebGL.WebGLMath.degToRad(time / 25 * mult),
		DevonWebGL.WebGLMath.degToRad(time / 25 * mult)));
	model = model.multiply(DevonWebGL.WebGLMath.scaleMatrix(1.1, 1.1, 1.1));
	
	DevonWebGL.Shader.setUniformMatrix4fv(contextName, "shader_main2", "model", model.flat());
	DevonWebGL.Shader.setUniformMatrix4fv(contextName, "shader_main2", "view", view.flat());
	DevonWebGL.Shader.setUniformMatrix4fv(contextName, "shader_main2", "projection", ortho.flat());;

	DevonWebGL.Shader.bind(contextName, "shader_main2");
	DevonWebGL.VertexArray.draw(contextName, "vao_cube");
	
	DevonWebGL.Context.setStencilMask(contextName, 0xFF);
	DevonWebGL.Context.setStencilFunction(contextName, Condition.Always, 1, 0xFF);
	DevonWebGL.Context.enableDepth(contextName);
}

function render(time: number)
{
	renderContext("main", time, 0.5, 200);
	renderContext("main2", time, 1.5, 0);
	renderContext("main3", time, -2, 512);

	requestAnimationFrame(render);
}

createContext("main", "test-canvas", fragShaderCode, fragShaderCode2);
createContext("main2", "test-canvas2", fragShaderCode4, fragShaderCode3);
createContext("main3", "test-canvas3", fragShaderCode6, fragShaderCode5);
requestAnimationFrame(render);
