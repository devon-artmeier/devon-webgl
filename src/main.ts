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

function createContext(contextName: string, canvasID: string)
{
	DGL.Context.create(contextName, document.getElementById(canvasID) as HTMLCanvasElement);
	DGL.Context.bind(contextName);
	
	DGL.Context.enableBlend();
	
	DGL.Texture.create("texture_test");
	DGL.Texture.setFilter("texture_test", DGL.TextureFilter.Bilinear);
	DGL.Texture.setWrap("texture_test",  DGL.TextureWrap.Clamp, DGL.TextureWrap.Clamp);
	DGL.Texture.loadImage("texture_test", "./img/test.png");

	DGL.Shader.create("shader_main", vertexShaderCode, fragShaderCode);
	DGL.Shader.create("shader_main2", vertexShaderCode, fragShaderCode2);
	DGL.Shader.create("shader_main3", vertexShaderCode, fragShaderCode3);
	
	DGL.VertexBuffer.create("vbo_cube", 24, [3, 2], DGL.BufferUsage.Static);
	DGL.VertexBuffer.setData("vbo_cube", cubeVertices, 0);
	DGL.VertexBuffer.bufferData("vbo_cube");

	DGL.ElementBuffer.create("ebo_cube", 36, DGL.BufferUsage.Static);
	DGL.ElementBuffer.setData("ebo_cube", elementsCube, 0);
	DGL.ElementBuffer.bufferData("ebo_cube");

	DGL.VertexArray.create("vao_cube");
	DGL.VertexArray.setBuffers("vao_cube", "vbo_cube", "ebo_cube");

	DGL.Framebuffer.create("fbo", 256, 256);

	DGL.Context.enableDepth();
	DGL.Context.enableStencil();
	DGL.Context.setStencilOptions(DGL.StencilOption.Keep, DGL.StencilOption.Keep, DGL.StencilOption.Replace);
}

function renderContext(contextName: string, time: number)
{
	DGL.Context.bind(contextName);
	
	///////////////////////////////////////////////////////////////
	
	DGL.Framebuffer.bind("fbo");
	
	DGL.Context.enableDepth();
	DGL.Context.setViewport(0, 0, 256, 256);
	DGL.Context.disableScissor();
	DGL.Context.clear(DGL.Color.FromRGBA(1, 0, 1, 1));

	let perspective = DGL. WebGLMath.perspective(60, 256, 256, 0.1, 1000);

	DGL.Context.setStencilFunction(DGL.Condition.Always, 1, 0xFF);
	DGL.Context.setStencilMask(0xFF);

	let angle = DGL.WebGLMath.degToRad(time / 25);
	let model = DGL.WebGLMath.model3D(0, 0, 0, angle, angle, angle, 1, 1, 1);
	
	let x = Math.cos(DGL.WebGLMath.degToRad(time / 4)) * 256;
	let y = Math.sin(DGL.WebGLMath.degToRad(time / 4)) * 256;
	let z = Math.sin(DGL.WebGLMath.degToRad((time / 8))) * 200;

	let view = DGL.WebGLMath.view3D(x, y, 64+z, 0, 0, 0, 0, 1, 0);

	DGL.Shader.setUniform1i("shader_main", "txt", 0);
	DGL.Shader.setUniformMatrix4fv("shader_main", "model", model);
	DGL.Shader.setUniformMatrix4fv("shader_main", "view", view);
	DGL.Shader.setUniformMatrix4fv("shader_main", "projection", perspective);

	DGL.Shader.bind("shader_main");
	DGL.Texture.setActive(0);
	DGL.Texture.bind("texture_test");
	DGL.VertexArray.draw("vao_cube");
	
	DGL.Framebuffer.unbind();
	
	///////////////////////////////////////////////////////////////
	
	DGL.Context.setViewport(0, 0, 640, 480);
	DGL.Context.clear(DGL.Color.FromRGBA(0, 0, 0, 1));
	
	perspective = DGL.WebGLMath.perspective(60, 640, 480, 0.1, 1000);
	
	DGL.Context.setStencilFunction(DGL.Condition.Always, 1, 0xFF);
	DGL.Context.setStencilMask(0xFF)

	angle = DGL.WebGLMath.degToRad(time / 25);
	model = DGL.WebGLMath.model3D(0, 0, 0, angle, angle, angle, 1, 1, 1);

	view = DGL.WebGLMath.view3D(x,y,256+z, 0,0,0, 0,1,0);
	
	DGL.Shader.setUniform1i("shader_main3", "txt", 0);
	DGL.Shader.setUniformMatrix4fv("shader_main3", "model", model);
	DGL.Shader.setUniformMatrix4fv("shader_main3", "view", view);
	DGL.Shader.setUniformMatrix4fv("shader_main3", "projection", perspective);
	DGL.Shader.setUniform1f("shader_main3", "time", time);

	DGL.Shader.bind("shader_main3");
	DGL.Texture.setActive(0);
	DGL.Framebuffer.bindTexture("fbo");
	DGL.VertexArray.draw("vao_cube");
	
	///////////////////////////////////////////////////////////////
	
	DGL.Context.setStencilFunction(DGL.Condition.NotEqual, 1, 0xFF);
	DGL.Context.setStencilMask(0x00);
	DGL.Context.disableDepth();

	angle = DGL.WebGLMath.degToRad(time / 25);
	model = DGL.WebGLMath.model3D(0, 0, 0, angle, angle, angle, 1.1, 1.1, 1.1);
	
	DGL.Shader.setUniformMatrix4fv("shader_main2", "model", model);
	DGL.Shader.setUniformMatrix4fv("shader_main2", "view", view);
	DGL.Shader.setUniformMatrix4fv("shader_main2", "projection", perspective);
	DGL.Shader.setUniform1f("shader_main2", "time", time);

	DGL.Shader.bind("shader_main2");
	DGL.VertexArray.draw("vao_cube");
	
	DGL.Context.setStencilMask(0xFF);
	DGL.Context.setStencilFunction(DGL.Condition.Always, 1, 0xFF);
}

function render(time: number)
{
	renderContext("main", time);
	requestAnimationFrame(render);
}

createContext("main", "test-canvas");
requestAnimationFrame(render);
