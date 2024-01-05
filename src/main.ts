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
	DGL.Context.create(contextName, document.getElementById(canvasID) as HTMLCanvasElement);

	DGL.Texture.create(contextName, "texture_test");
	DGL.Texture.setFilter(contextName, "texture_test", DGL.TextureFilter.Bilinear);
	DGL.Texture.setWrap(contextName, "texture_test",  DGL.TextureWrap.Clamp, DGL.TextureWrap.Clamp);
	DGL.Texture.loadImage(contextName, "texture_test", "./img/test.png");

	DGL.Shader.create(contextName, "shader_main", vertexShaderCode, fragCode);
	DGL.Shader.create(contextName, "shader_main2", vertexShaderCode, fragCode2);
	DGL.Shader.create(contextName, "shader_main3", vertexShaderCode, fragShaderCode);
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

function renderContext(contextName: string, time: number, mult: number, mult2: number)
{
	///////////////////////////////////////////////////////////////
	
	DGL.Framebuffer.bind(contextName, "fbo");
	DGL.Context.setViewport(contextName, 0, 0, 256, 256);
	DGL.Context.clear(contextName, DGL.Color.FromRGBA(1, 0, 1, 1));
	
	let ortho = DGL. WebGLMath.perspectiveMatrix(60, 256, 256, 0.1, 1000);

	DGL.Context.setStencilFunction(contextName, DGL.Condition.Always, 1, 0xFF);
	DGL.Context.setStencilMask(contextName, 0xFF);

	let model = DGL.WebGLMath.translateMatrix(0, 0, 0);
	model = model.multiply(DGL.WebGLMath.rotateMatrix(
		DGL.WebGLMath.degToRad(time / 25 * mult),
		DGL.WebGLMath.degToRad(time / 25 * mult),
		DGL.WebGLMath.degToRad(time / 25 * mult)));
	
	let x = Math.cos(DGL.WebGLMath.degToRad(time / 4 * mult)) * 256;
	let y = Math.sin(DGL.WebGLMath.degToRad(time / 4 * mult)) * 256;
	let z = Math.sin(DGL.WebGLMath.degToRad((time / 8) * mult)) * mult2;

	let view = DGL.WebGLMath.lookAtMatrix(x,y,64+z, 0,0,0, 0,1,0);

	DGL.Texture.setActive(contextName, 0);
	DGL.Texture.bind(contextName, "texture_test");

	DGL.Shader.setUniform1i(contextName, "shader_main", "txt", 0);
	DGL.Shader.setUniformMatrix4fv(contextName, "shader_main", "model", model.flat());
	DGL.Shader.setUniformMatrix4fv(contextName, "shader_main", "view", view.flat());
	DGL.Shader.setUniformMatrix4fv(contextName, "shader_main", "projection", ortho.flat());

	DGL.Shader.bind(contextName, "shader_main");
	DGL.Texture.setActive(contextName, 0);
	DGL.Texture.bind(contextName, "texture_test");
	DGL.VertexArray.draw(contextName, "vao_cube");
	
	DGL.Framebuffer.unbind(contextName);
	
	///////////////////////////////////////////////////////////////

	DGL.Context.setViewport(contextName, 0, 0, 640, 480);
	DGL.Context.clear(contextName, DGL.Color.FromRGBA(1, 0, 1, 1));
	
	ortho = DGL.WebGLMath.perspectiveMatrix(60, 640, 480, 0.1, 1000);
	
	DGL.Context.setStencilFunction(contextName, DGL.Condition.Always, 1, 0xFF);
	DGL.Context.setStencilMask(contextName, 0xFF)

	model = DGL.WebGLMath.translateMatrix(0, 0, 0);
	model = model.multiply(DGL.WebGLMath.rotateMatrix(
		DGL.WebGLMath.degToRad(time / 25 * mult),
		DGL.WebGLMath.degToRad(time / 25 * mult),
		DGL.WebGLMath.degToRad(time / 25 * mult)));

	view = DGL.WebGLMath.lookAtMatrix(x,y,256+z, 0,0,0, 0,1,0);
	
	DGL.Shader.setUniform1i(contextName, "shader_main3", "txt", 0);
	DGL.Shader.setUniformMatrix4fv(contextName, "shader_main3", "model", model.flat());
	DGL.Shader.setUniformMatrix4fv(contextName, "shader_main3", "view", view.flat());
	DGL.Shader.setUniformMatrix4fv(contextName, "shader_main3", "projection", ortho.flat());;

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
		DGL.WebGLMath.degToRad(time / 25 * mult),
		DGL.WebGLMath.degToRad(time / 25 * mult),
		DGL.WebGLMath.degToRad(time / 25 * mult)));
	model = model.multiply(DGL.WebGLMath.scaleMatrix(1.1, 1.1, 1.1));
	
	DGL.Shader.setUniformMatrix4fv(contextName, "shader_main2", "model", model.flat());
	DGL.Shader.setUniformMatrix4fv(contextName, "shader_main2", "view", view.flat());
	DGL.Shader.setUniformMatrix4fv(contextName, "shader_main2", "projection", ortho.flat());;

	DGL.Shader.bind(contextName, "shader_main2");
	DGL.VertexArray.draw(contextName, "vao_cube");
	
	DGL.Context.setStencilMask(contextName, 0xFF);
	DGL.Context.setStencilFunction(contextName, DGL.Condition.Always, 1, 0xFF);
	DGL.Context.enableDepth(contextName);
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
