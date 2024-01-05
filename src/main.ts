import * as DGL from "./public"

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
uniform float time;

vec3 hsvToRGB(vec3 c)
{
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(void)
{
	fragColor = vec4(hsvToRGB(vec3(radians(time / 100.0) + 0.9, 1, 1)), 1);
}
`;

// Fragment shader base code 3
const fragShaderCode3 = 
`#version 300 es
precision highp float;

in vec2 texCoord;
out vec4 fragColor;
uniform sampler2D txt;
uniform float time;

vec3 hsvToRGB(vec3 c)
{
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(void)
{
	fragColor = texture(txt, texCoord) * vec4(hsvToRGB(vec3(radians(time / 100.0), 1, 1)), 1);
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

function createContext(contextName: string, canvasID: string)
{
	DGL.Context.create(contextName, document.getElementById(canvasID) as HTMLCanvasElement);
	DGL.Context.enableBlend(contextName);
	
	DGL.Texture.create(contextName, "texture_test");
	DGL.Texture.setFilter(contextName, "texture_test", DGL.TextureFilter.Bilinear);
	DGL.Texture.setWrap(contextName, "texture_test",  DGL.TextureWrap.Clamp, DGL.TextureWrap.Clamp);
	DGL.Texture.loadImage(contextName, "texture_test", "./img/test.png");

	DGL.Shader.create(contextName, "shader_main", vertexShaderCode, fragShaderCode);
	DGL.Shader.create(contextName, "shader_main2", vertexShaderCode, fragShaderCode2);
	DGL.Shader.create(contextName, "shader_main3", vertexShaderCode, fragShaderCode3);
	
	DGL.VertexBuffer.create(contextName, "vbo_cube", 24, [3, 2], DGL.BufferUsage.Static);
	DGL.VertexBuffer.setData(contextName, "vbo_cube", cubeVertices, 0);
	DGL.VertexBuffer.bufferData(contextName, "vbo_cube");

	DGL.ElementBuffer.create(contextName, "ebo_cube", 36, DGL.BufferUsage.Static);
	DGL.ElementBuffer.setData(contextName, "ebo_cube", elementsCube, 0);
	DGL.ElementBuffer.bufferData(contextName, "ebo_cube");
	
	DGL.VertexBuffer.create(contextName, "vbo_square", 4, [3, 2], DGL.BufferUsage.Static);
	DGL.VertexBuffer.setData(contextName, "vbo_square", squareVertices, 0);
	DGL.VertexBuffer.bufferData(contextName, "vbo_square");

	DGL.ElementBuffer.create(contextName, "ebo_square", 6, DGL.BufferUsage.Static);
	DGL.ElementBuffer.setData(contextName, "ebo_square", elementsSquare, 0);
	DGL.ElementBuffer.bufferData(contextName, "ebo_square");

	DGL.VertexArray.create(contextName, "vao_cube");
	DGL.VertexArray.setBuffers(contextName, "vao_cube", "vbo_cube", "ebo_cube");

	DGL.VertexArray.create(contextName, "vao_square");
	DGL.VertexArray.setBuffers(contextName, "vao_square", "vbo_square", "ebo_square");

	DGL.Framebuffer.create(contextName, "fbo", 256, 256);

	DGL.Context.enableDepth(contextName);
	DGL.Context.enableStencil(contextName);
	DGL.Context.setStencilOptions(contextName, DGL.StencilOption.Keep, DGL.StencilOption.Keep, DGL.StencilOption.Replace);
}

function renderContext(contextName: string, time: number)
{
	///////////////////////////////////////////////////////////////
	
	DGL.Context.enableDepth(contextName);
	DGL.Framebuffer.bind(contextName, "fbo");
	DGL.Context.setViewport(contextName, 0, 0, 256, 256);
	DGL.Context.disableScissor(contextName);
	DGL.Context.clear(contextName, DGL.Color.FromRGBA(1, 0, 1, 1));
	
	let perspective = DGL. WebGLMath.perspectiveMatrix(60, 256, 256, 0.1, 1000);

	DGL.Context.setStencilFunction(contextName, DGL.Condition.Always, 1, 0xFF);
	DGL.Context.setStencilMask(contextName, 0xFF);

	let model = DGL.WebGLMath.translateMatrix(0, 0, 0);
	model = model.multiply(DGL.WebGLMath.rotateMatrix(
		DGL.WebGLMath.degToRad(time / 25),
		DGL.WebGLMath.degToRad(time / 25),
		DGL.WebGLMath.degToRad(time / 25)));
	
	let x = Math.cos(DGL.WebGLMath.degToRad(time / 4)) * 256;
	let y = Math.sin(DGL.WebGLMath.degToRad(time / 4)) * 256;
	let z = Math.sin(DGL.WebGLMath.degToRad((time / 8))) * 200;

	let view = DGL.WebGLMath.lookAtMatrix(x,y,64+z, 0,0,0, 0,1,0);

	DGL.Texture.setActive(contextName, 0);
	DGL.Texture.bind(contextName, "texture_test");

	DGL.Shader.setUniform1i(contextName, "shader_main", "txt", 0);
	DGL.Shader.setUniformMatrix4fv(contextName, "shader_main", "model", model.flat());
	DGL.Shader.setUniformMatrix4fv(contextName, "shader_main", "view", view.flat());
	DGL.Shader.setUniformMatrix4fv(contextName, "shader_main", "projection", perspective.flat());

	DGL.Shader.bind(contextName, "shader_main");
	DGL.Texture.setActive(contextName, 0);
	DGL.Texture.bind(contextName, "texture_test");
	DGL.VertexArray.draw(contextName, "vao_cube");
	
	DGL.Framebuffer.unbind(contextName);
	
	///////////////////////////////////////////////////////////////
	
	DGL.Context.setViewport(contextName, 0, 0, 640, 480);
	DGL.Context.clear(contextName, DGL.Color.FromRGBA(0, 0, 0, 1));
	
	perspective = DGL.WebGLMath.perspectiveMatrix(60, 640, 480, 0.1, 1000);
	
	DGL.Context.setStencilFunction(contextName, DGL.Condition.Always, 1, 0xFF);
	DGL.Context.setStencilMask(contextName, 0xFF)

	model = DGL.WebGLMath.translateMatrix(0, 0, 0);
	model = model.multiply(DGL.WebGLMath.rotateMatrix(
		DGL.WebGLMath.degToRad(time / 25),
		DGL.WebGLMath.degToRad(time / 25),
		DGL.WebGLMath.degToRad(time / 25)));

	view = DGL.WebGLMath.lookAtMatrix(x,y,256+z, 0,0,0, 0,1,0);
	
	DGL.Shader.setUniform1i(contextName, "shader_main3", "txt", 0);
	DGL.Shader.setUniformMatrix4fv(contextName, "shader_main3", "model", model.flat());
	DGL.Shader.setUniformMatrix4fv(contextName, "shader_main3", "view", view.flat());
	DGL.Shader.setUniformMatrix4fv(contextName, "shader_main3", "projection", perspective.flat());
	DGL.Shader.setUniform1f(contextName, "shader_main3", "time", time);

	DGL.Shader.bind(contextName, "shader_main3");
	DGL.Texture.setActive(contextName, 0);
	DGL.Framebuffer.bindTexture(contextName, "fbo");
	DGL.VertexArray.draw(contextName, "vao_cube");
	
	///////////////////////////////////////////////////////////////
	
	DGL.Context.setStencilFunction(contextName, DGL.Condition.NotEqual, 1, 0xFF);
	DGL.Context.setStencilMask(contextName, 0x00);
	DGL.Context.disableDepth(contextName);
	
	model = DGL.WebGLMath.translateMatrix(0, 0, 0);
	model = model.multiply(DGL.WebGLMath.rotateMatrix(
		DGL.WebGLMath.degToRad(time / 25),
		DGL.WebGLMath.degToRad(time / 25),
		DGL.WebGLMath.degToRad(time / 25)));
	model = model.multiply(DGL.WebGLMath.scaleMatrix(1.1, 1.1, 1.1));
	
	DGL.Shader.setUniformMatrix4fv(contextName, "shader_main2", "model", model.flat());
	DGL.Shader.setUniformMatrix4fv(contextName, "shader_main2", "view", view.flat());
	DGL.Shader.setUniformMatrix4fv(contextName, "shader_main2", "projection", perspective.flat());
	DGL.Shader.setUniform1f(contextName, "shader_main2", "time", time);

	DGL.Shader.bind(contextName, "shader_main2");
	DGL.VertexArray.draw(contextName, "vao_cube");
	
	DGL.Context.setStencilMask(contextName, 0xFF);
	DGL.Context.setStencilFunction(contextName, DGL.Condition.Always, 1, 0xFF);
}

function render(time: number)
{
	renderContext("main", time);
	requestAnimationFrame(render);
}

createContext("main", "test-canvas");
requestAnimationFrame(render);
