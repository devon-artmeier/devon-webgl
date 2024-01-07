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
	new Vertex(-64, -64, -64,  0, 0),
	new Vertex( 64,  64, -64,  1, 1),
	new Vertex( 64, -64, -64,  1, 0),
	new Vertex(-64,  64, -64,  0, 1),
	 
	new Vertex(-64, -64,  64,  0, 0),
	new Vertex( 64, -64,  64,  1, 0),
	new Vertex( 64,  64,  64,  1, 1),
	new Vertex(-64,  64,  64,  0, 1),
	
	new Vertex(-64,  64,  64,  1, 0),
	new Vertex(-64,  64, -64,  1, 1),
	new Vertex(-64, -64, -64,  0, 1),
	new Vertex(-64, -64,  64,  0, 0),
	
	new Vertex( 64,  64,  64,  1, 0),
	new Vertex( 64, -64, -64,  0, 1),
	new Vertex( 64,  64, -64,  1, 1),
	new Vertex( 64, -64,  64,  0, 0),
	 
	new Vertex(-64, -64, -64,  0, 1),
	new Vertex( 64, -64, -64,  1, 1),
	new Vertex( 64, -64,  64,  1, 0),
	new Vertex(-64, -64,  64,  0, 0),
	 
	new Vertex(-64,  64, -64,  0, 1),
	new Vertex( 64,  64,  64,  1, 0),
	new Vertex( 64,  64, -64,  1, 1),
	new Vertex(-64,  64,  64,  0, 0)
];

const cubeElements = [
	0,  1,  2,  1,  0,  3,
	4,  5,  6,  6,  7,  4,
	8,  9,  10, 10, 11, 8,
	12, 13, 14, 13, 12, 15,
	16, 17, 18, 18, 19, 16,
	20, 21, 22, 21, 20, 23
];

function radians(angle: number): number
{
	return angle * (Math.PI / 180);
}

function createContext(contextName: string, canvasID: string)
{
	DGL.Context.create(contextName, document.getElementById(canvasID) as HTMLCanvasElement);
	DGL.Context.bind(contextName);
	
	DGL.Blend.enable();
	DGL.Blend.setFunction(DGL.Blend.SrcAlpha, DGL.Blend.OneMinusSrcAlpha);
	
	DGL.Texture.create("texture_test");
	DGL.Texture.loadImage("texture_test", "./img/test.png");
	DGL.Texture.createMipmap("texture_test");
	
	DGL.Texture.create("texture_fbo", [256, 256]);

	DGL.Shader.create("shader_main", vertexShaderCode, fragShaderCode);
	DGL.Shader.create("shader_main2", vertexShaderCode, fragShaderCode2);

	DGL.Mesh.createStatic("mesh_cube", cubeVertices, cubeElements);

	DGL.Stencil.enable();
	DGL.Stencil.setOptions(DGL.Stencil.Keep, DGL.Stencil.Keep, DGL.Stencil.Replace);
	
	DGL.Cull.setFace(DGL.Cull.Front);
	DGL.Cull.setFront(DGL.Cull.Clockwise);
}

function renderContext(contextName: string, time: number)
{
	DGL.Context.bind(contextName);
	
	DGL.Depth.enable();
	DGL.Depth.setFunction(DGL.Depth.LessEqual);
	DGL.Stencil.setMask(0xFF);
	DGL.Stencil.setFunction(DGL.Stencil.Always, 1, 0xFF);
	
	///////////////////////////////////////////////////////////////
	
	DGL.Texture.setRenderTarget("texture_fbo");
	
	DGL.Cull.enable();
	
	DGL.Viewport.set([0, 0], [256, 256]);
	DGL.Context.clear([0.1333, 0, 0.5, 1]);

	let perspective = DGL.Matrix.perspective(60, [256, 256], [0.1, 1000]);

	let angle = radians(time / 25);
	
	let x = Math.cos(radians(time / 4)) * 256;
	let y = Math.sin(radians(time / 4)) * 256;
	let z = Math.sin(radians((time / 8))) * 200;

	let view = DGL.Matrix.view3D([x, y, 64 + z], [0, 0, 0], [0, 1, 0]);
	let model = DGL.Matrix.model3D([0, 0, 0], [angle, angle, angle], [1, 1, 1]);

	DGL.Shader.bind("shader_main");
	DGL.Shader.setTexture("txt", 0);
	DGL.Shader.setMatrix4("model", model);
	DGL.Shader.setMatrix4("view", view);
	DGL.Shader.setMatrix4("projection", perspective);

	DGL.Texture.setActive(0, "texture_test");
	DGL.Mesh.draw("mesh_cube");
	
	///////////////////////////////////////////////////////////////
	
	DGL.Texture.unsetRenderTarget();

	DGL.Viewport.set([0, 0], [640, 480]);
	DGL.Context.clear([0, 0, 0.5, 1]);
	
	perspective = DGL.Matrix.perspective(60, [640, 480], [0.1, 1000]);

	angle = radians(time / 25);

	view = DGL.Matrix.view3D([x, y, 256 + z], [0, 0, 0], [0, 1, 0]);

	DGL.Shader.bind("shader_main");
	DGL.Shader.setTexture("txt", 0);
	DGL.Shader.setMatrix4("view", view);
	DGL.Shader.setMatrix4("projection", perspective);
	
	DGL.Shader.bind("shader_main2");
	DGL.Shader.setMatrix4("view", view);
	DGL.Shader.setMatrix4("projection", perspective);

	let cubes = new Array<[number, number, number]>(
		[0, 0, 0],
		[-256, -256, -256],
		[256, -256, -256],
		[-256, -256, 256],
		[256, -256, 256],
		[-256, 256, -256],
		[256, 256, -256],
		[-256, 256, 256],
		[256, 256, 256]
	);

	for (let i = 0; i < cubes.length; i++) {
		model = DGL.Matrix.model3D(cubes[i], [angle, angle, angle], [1, 1, 1]);
		
		DGL.Depth.setFunction(DGL.Depth.LessEqual);
		DGL.Stencil.clear();
		DGL.Stencil.setMask(0xFF);
		DGL.Stencil.setFunction(DGL.Stencil.Always, 1, 0xFF);
		DGL.Cull.enable();

		DGL.Shader.bind("shader_main");
		DGL.Texture.setActive(0, "texture_fbo");
		DGL.Shader.setMatrix4("model", model);
		DGL.Mesh.draw("mesh_cube");
		
		DGL.Depth.setFunction(DGL.Depth.Always);
		DGL.Stencil.setFunction(DGL.Stencil.NotEqual, 1, 0xFF);
		DGL.Stencil.setMask(0x00);
		DGL.Cull.disable();
		
		model = DGL.Matrix.model3D(cubes[i], [angle, angle, angle], [1.1, 1.1, 1.1]);

		DGL.Shader.bind("shader_main2");
		DGL.Shader.setMatrix4("model", model);
		DGL.Mesh.draw("mesh_cube");
	}
}

function render(time: number)
{
	renderContext("main", time);
	frame++;
	requestAnimationFrame(render);
}

let frame = 0;
createContext("main", "test-canvas");
requestAnimationFrame(render);
