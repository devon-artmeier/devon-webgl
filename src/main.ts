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
	fragColor = vec4(0.2666, 0, 1, 1);
}
`;

class Vertex extends DGL.Vertex
{
	// Constructor
	constructor(public x: number, public y: number, public z: number,
		public tx: number, public ty: number) { super(); }

	// Get data
	public getData(): readonly number[][]
	{
		return [[this.x, this.y, this.z], [this.tx, this.ty]];
	}
}

const cubeVertices = [
	new Vertex(-64, -64,  64,  0, 1),
	new Vertex( 64, -64,  64,  1, 1),
	new Vertex(-64,  64,  64,  0, 0),
	new Vertex( 64,  64,  64,  1, 0),
	 
	new Vertex( 64, -64, -64,  0, 1),
	new Vertex(-64, -64, -64,  1, 1),
	new Vertex( 64,  64, -64,  0, 0),
	new Vertex(-64,  64, -64,  1, 0),
	
	new Vertex(-64, -64, -64,  0, 1),
	new Vertex(-64, -64,  64,  1, 1),
	new Vertex(-64,  64, -64,  0, 0),
	new Vertex(-64,  64,  64,  1, 0),
	
	new Vertex( 64, -64,  64,  0, 1),
	new Vertex( 64, -64, -64,  1, 1),
	new Vertex( 64,  64,  64,  0, 0),
	new Vertex( 64,  64, -64,  1, 0),
	 
	new Vertex(-64, -64, -64,  0, 1),
	new Vertex( 64, -64, -64,  1, 1),
	new Vertex(-64, -64,  64,  0, 0),
	new Vertex( 64, -64,  64,  1, 0),
	 
	new Vertex(-64,  64,  64,  0, 1),
	new Vertex( 64,  64,  64,  1, 1),
	new Vertex(-64,  64, -64,  0, 0),
	new Vertex( 64,  64, -64,  1, 0)
];

const elementsCube = [
	0,  1,  2,  1,  2,  3,
	4,  5,  6,  5,  6,  7,
	8,  9,  10, 9,  10, 11,
	12, 13, 14, 13, 14, 15,
	16, 17, 18, 17, 18, 19,
	20, 21, 22, 21, 22, 23
];

function radians(angle: number): number
{
	return angle * (Math.PI / 180);
}

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

	DGL.Mesh.createStatic("mesh_cube", cubeVertices, elementsCube);

	DGL.Framebuffer.create("fbo", 256, 256);

	DGL.Context.enableDepth();
	DGL.Context.enableStencil();
	DGL.Context.setStencilOptions(DGL.StencilOption.Keep, DGL.StencilOption.Keep, DGL.StencilOption.Replace);
}

function renderContext(contextName: string, time: number)
{
	DGL.Context.bind(contextName);
	
	DGL.Context.enableDepth();
	DGL.Context.setStencilMask(0xFF);
	DGL.Context.setStencilFunction(DGL.Condition.Always, 1, 0xFF);
	
	///////////////////////////////////////////////////////////////
	
	DGL.Framebuffer.bind("fbo");
	
	DGL.Context.setViewport(0, 0, 256, 256);
	DGL.Context.clear([0.1333, 0, 0.5, 1]);

	let perspective = DGL. Matrix.perspective(60, 256, 256, 0.1, 1000);

	let angle = radians(time / 25);
	let model = DGL.Matrix.model3D([0, 0, 0], [angle, angle, angle], [1, 1, 1]);
	
	let x = Math.cos(radians(time / 4)) * 256;
	let y = Math.sin(radians(time / 4)) * 256;
	let z = Math.sin(radians((time / 8))) * 200;

	let view = DGL.Matrix.view3D([x, y, 64 + z], [0, 0, 0], [0, 1, 0]);

	DGL.Shader.setUniformTexture("shader_main", "txt", 0);
	DGL.Shader.setUniformMatrix4fv("shader_main", "model", model);
	DGL.Shader.setUniformMatrix4fv("shader_main", "view", view);
	DGL.Shader.setUniformMatrix4fv("shader_main", "projection", perspective);

	DGL.Shader.bind("shader_main");
	DGL.Texture.setActive(0, "texture_test");
	DGL.Mesh.draw("mesh_cube");
	
	DGL.Framebuffer.unbind();
	
	///////////////////////////////////////////////////////////////
	
	DGL.Context.setViewport(0, 0, 640, 480);
	DGL.Context.clear([0, 0, 0, 1]);
	
	perspective = DGL.Matrix.perspective(60, 640, 480, 0.1, 1000);

	angle = radians(time / 25);
	model = DGL.Matrix.model3D([0, 0, 0], [angle, angle, angle], [1, 1, 1]);

	view = DGL.Matrix.view3D([x, y, 256 + z], [0, 0, 0], [0, 1, 0]);

	DGL.Shader.setUniformTexture("shader_main", "txt", 0);
	DGL.Shader.setUniformMatrix4fv("shader_main", "model", model);
	DGL.Shader.setUniformMatrix4fv("shader_main", "view", view);
	DGL.Shader.setUniformMatrix4fv("shader_main", "projection", perspective);

	DGL.Shader.bind("shader_main3");
	DGL.Framebuffer.setActiveTexture(0, "fbo");
	DGL.Mesh.draw("mesh_cube");
	
	///////////////////////////////////////////////////////////////
	
	DGL.Context.disableDepth();
	DGL.Context.setStencilFunction(DGL.Condition.NotEqual, 1, 0xFF);
	DGL.Context.setStencilMask(0x00);

	angle = radians(time / 25);
	model = DGL.Matrix.model3D([0, 0, 0], [angle, angle, angle], [1.1, 1.1, 1.1]);
	
	DGL.Shader.setUniformMatrix4fv("shader_main2", "model", model);
	DGL.Shader.setUniformMatrix4fv("shader_main2", "view", view);
	DGL.Shader.setUniformMatrix4fv("shader_main2", "projection", perspective);

	DGL.Shader.bind("shader_main2");
	DGL.Mesh.draw("mesh_cube");
}

function render(time: number)
{
	renderContext("main", time);
	requestAnimationFrame(render);
}

createContext("main", "test-canvas");
requestAnimationFrame(render);
