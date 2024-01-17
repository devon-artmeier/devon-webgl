import { Vector2, Vector4 } from "./tuples";
import { Resource } from "../private/resource";
import { ResourceManager } from "../private/resource-manager";
import { ContextPool } from "../private/context-pool";
import { Cull } from "./culling";
import { Depth } from "./depth";
import { Matrix } from "./matrix";
import { Mesh } from "./mesh";
import { Shader } from "./shader";
import { Stencil } from "./stencil";
import { Texture } from "./texture";
import { Vertex } from "./vertex";
import { Viewport } from "./viewport";

const fboVertexShader =
`#version 300 es

layout (location = 0) in vec2 vecFragCoord;
layout (location = 1) in vec2 vecTexCoord;

out vec2 texCoord;

uniform mat4 projection;

void main(void)
{
	texCoord = vecTexCoord;
	gl_Position = projection * vec4(vecFragCoord, 0, 1);
}
`;

const fboFragShader = 
`#version 300 es
precision highp float;

in vec2 texCoord;
out vec4 fragColor;
uniform sampler2D renderTexture;

void main(void)
{
	fragColor = texture(renderTexture, texCoord);
}
`;

class FBOVertex extends Vertex
{
	// Constructor
	constructor(public coord: Vector2<number>, public tex: Vector2<number>)
		{ super(); }

	// Get data
	public getData(): readonly number[][]
	{
		return [this.coord, this.tex];
	}
}

const fboVertices = [
	new FBOVertex([0, 0], [0, 1]),
	new FBOVertex([1, 1], [1, 0]),
	new FBOVertex([1, 0], [1, 1]),
	new FBOVertex([1, 1], [1, 0]),
	new FBOVertex([0, 0], [0, 1]),
	new FBOVertex([0, 1], [0, 0])
];

export class Context extends Resource
{
	private static _fullscreen: boolean;
	private static _fullscreenInit: boolean;
	private static _savedScroll: Vector2<number>;
	
	public readonly gl: WebGL2RenderingContext;
	public readonly textures: ResourceManager = new ResourceManager();
	public readonly shaders: ResourceManager = new ResourceManager();
	public readonly meshes: ResourceManager = new ResourceManager();

	private _currentTexture: WebGLTexture;
	private _currentShader: WebGLProgram;
	private _currentFBO: WebGLFramebuffer;
	private _currentVBO: WebGLBuffer;
	private _currentEBO: WebGLBuffer;
	private _currentVAO: WebGLVertexArrayObject;
	
	private _container: HTMLDivElement;
	private _canvas: HTMLCanvasElement;

	get currentTexture(): WebGLTexture { return this._currentTexture; }
	get currentShader(): WebGLProgram { return this._currentShader; }
	get currentFBO(): WebGLFramebuffer { return this._currentFBO; }
	get currentVBO(): WebGLBuffer { return this._currentVBO; }
	get currentEBO(): WebGLBuffer { return this._currentEBO; }
	get currentVAO(): WebGLVertexArrayObject { return this._currentVAO; }
	
	/**************************/
	/* CLASS OBJECT FUNCTIONS */
	/**************************/
	
	// Constructor
	private constructor(public readonly element: HTMLElement, id: string, size: Vector2<number>)
	{
		super(null, id);
		
		if (element != null) {
			if (size[0] <= 0) size[0] = 1;
			if (size[1] <= 0) size[1] = 1;
			
			this._container = document.createElement("div");
			this._container.className = "devon-webgl-canvas-container";
			this._container.style.width = `${size[0]}px`;
			this._container.style.height = `${size[1]}px`;
			this._container.style.display = `block`;
			this._container.style.zIndex = `-1`;
			
			this._canvas = document.createElement("canvas");
			this._canvas.className = "devon-webgl-canvas-view";
			this._canvas.style.position = "absolute";
			this._container.appendChild(this._canvas);
			
			element.replaceWith(this._container);

			this.gl = this._canvas?.getContext("webgl2",
				{ alpha: true, stencil: true, preserveDrawingBuffer: true });
			
			let oldContext = ContextPool.bind;
			ContextPool.bind = this;
			
			let dpr = window.devicePixelRatio;
			size = [Math.round(size[0] * dpr), Math.round(size[1] * dpr)];
			
			Texture.create("fbo_devon_webgl", size);
			Shader.create("shader_devon_webgl", fboVertexShader, fboFragShader);
			Mesh.createStatic("mesh_devon_webgl", fboVertices);
			
			ContextPool.bind = oldContext;
			
			if (!Context._fullscreenInit) {
				document.addEventListener("fullscreenchange", function ()
				{
					Context._fullscreen = !Context._fullscreen;
					if (!Context._fullscreen) {
						window.scrollTo(Context._savedScroll[0], Context._savedScroll[1]);
					}
				});
				Context._fullscreenInit = true;
			}
		}
	}
	
	// Bind
	public bind()
	{
		const rect = this._container.getBoundingClientRect();
		
		let dpr = window.devicePixelRatio;
		this._canvas.width = Math.round(rect.width * dpr);
		this._canvas.height = Math.round(rect.height * dpr);
		
		if (!Context._fullscreen) {
			this._canvas.style.left = `${window.scrollX + rect.left}px`;
			this._canvas.style.top = `${window.scrollY + rect.top}px`;
		} else {
			this._canvas.style.left = `${rect.left}px`;
			this._canvas.style.top = `${rect.top}px`;
		}
		this._canvas.style.width = `${this._canvas.width / dpr}px`;
		this._canvas.style.height = `${this._canvas.height / dpr}px`;
		
		let fboSize = Texture.getSize("fbo_devon_webgl");
		if (fboSize[0] != this._canvas.width || fboSize[1] != this._canvas.height) {
			fboSize = [this._canvas.width, this._canvas.height];
			Texture.createBlank("fbo_devon_webgl", [this._canvas.width, this._canvas.height]);
		}
		
		Texture.setRenderTarget("fbo_devon_webgl");
	}
	
	// Draw
	public draw()
	{
		this._currentFBO = null;
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
		
		Viewport.set([0, 0], [this._canvas.width, this._canvas.height]);
		Depth.disable();
		Stencil.disable();
		Stencil.setMask(0xFF);
		Stencil.setFunction(Stencil.Always, 1, 0xFF);
		Cull.disable();
		
		let projection = Matrix.ortho([0, 0], [1, 1], [0, 1]);
		
		Shader.bind("shader_devon_webgl");
		Shader.setTexture("renderTexture", -1);
		Shader.setMatrix4("projection", projection);
		
		Texture.setActive(-1, "fbo_devon_webgl");
		Mesh.draw("mesh_devon_webgl");
	}
	
	// Resize
	public resize(size: Vector2<number>)
	{
		this._container.style.width = `${size[0]}px`;
		this._container.style.height = `${size[1]}px`;
	}
	
	// Get size
	public getSize(): Vector2<number>
	{
		return Texture.getSize("fbo_devon_webgl");
	}

	// Bind texture
	public bindTexture(texture: WebGLTexture)
	{
		if (this._currentTexture != texture) {
			this._currentTexture = texture;
			this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
		}
	}

	// Bind shader
	public bindShader(shader: WebGLProgram)
	{
		if (this._currentShader != shader) {
			this._currentShader = shader;
			this.gl.useProgram(shader);
		}
	}

	// Bind framebuffer
	public bindFramebuffer(fbo: WebGLFramebuffer)
	{
		if (fbo == null) {
			Texture.setRenderTarget("fbo_devon_webgl");
		} else if (this._currentFBO != fbo) {
			this._currentFBO = fbo;
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbo);
		}
	}

	// Bind vertex buffer
	public bindVertexBuffer(vbo: WebGLBuffer)
	{
		if (this._currentVBO != vbo) {
			this._currentVBO = vbo;
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
		}
	}

	// Bind element buffer
	public bindElementBuffer(ebo: WebGLBuffer)
	{
		if (this._currentEBO != ebo) {
			this._currentEBO = ebo;
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ebo);
		}
	}

	// Bind vertex array
	public bindVertexArray(vao: WebGLVertexArrayObject)
	{
		if (this._currentVAO != vao) {
			this._currentVAO = vao;
			this.gl.bindVertexArray(vao);
		}
	}

	// Delete texture
	public deleteTexture(texture: WebGLTexture)
	{
		if (texture != null) {
			if (this._currentTexture == texture) {
				this.bindTexture(null);
			}
			this.gl.deleteTexture(texture);
		}
	}

	// Delete shader
	public deleteShader(shader: WebGLProgram)
	{
		if (shader != null) {
			if (this._currentShader == shader) {
				this.bindShader(null);
			}
			this.gl.deleteProgram(shader);
		}
	}

	// Delete framebuffer
	public deleteFramebuffer(fbo: WebGLFramebuffer)
	{
		if (fbo != null) {
			if (this._currentFBO == fbo) {
				this.bindFramebuffer(null);
			}
			this.gl.deleteFramebuffer(fbo);
		}
	}

	// Delete vertex buffer
	public deleteVertexBuffer(vbo: WebGLBuffer)
	{
		if (vbo != null) {
			if (this._currentVBO == vbo) {
				this.bindVertexBuffer(null);
			}
			this.gl.deleteBuffer(vbo);
		}
	}

	// Delete element buffer
	public deleteElementBuffer(ebo: WebGLBuffer)
	{
		if (ebo != null) {
			if (this._currentEBO == ebo) {
				this.bindElementBuffer(null);
			}
			this.gl.deleteBuffer(ebo);
		}
	}

	// Delete vertex array
	public deleteVertexArray(vao: WebGLVertexArrayObject)
	{
		if (vao != null) {
			if (this._currentVAO == vao) {
				this.bindVertexArray(null);
			}
			this.gl.deleteVertexArray(vao);
		}
	}

	// Delete
	public delete()
	{
		if (this._container != null) {
			this._container.innerHTML = "";
			this._container.remove();
		}

		this.textures.clear();
		this.shaders.clear();
		this.meshes.clear();
	}
	
	/********************/
	/* STATIC FUNCTIONS */
	/********************/
	
	// Create context
	public static create(id: string, element: HTMLElement, size: Vector2<number>)
	{
		let context = new Context(element, id, size);
		ContextPool.contexts.add(id, context);
	}

	// Bind
	public static bind(id: string)
	{
		let context = ContextPool.get(id);
		if (context != null) { 
			ContextPool.bind = context;
			context.bind();
		}
	}
	
	// Clear
	public static clear(color: Vector4<number>)
	{
		let context = ContextPool.bind;
		if (context != null) {
			let gl = context.gl;
			gl.clearColor(... color);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
		}
	}
	
	// Draw
	public static draw()
	{
		ContextPool.bind?.draw();
	}
	
	// Resize canvas
	public static resize(size: Vector2<number>)
	{
		ContextPool.bind?.resize(size);
	}
	
	// Set render size
	public static getSize(): Vector2<number>
	{
		return ContextPool.bind?.getSize();
	}
	
	// Go fullscreen
	public static setFullscreen(id: string)
	{
		let context = ContextPool.get(id);
		if (context != null) {
			context._container.requestFullscreen();
			this._savedScroll = [window.scrollX, window.scrollY];
		}
	}
	
	// Get container
	public static getContainer(id: string) : HTMLDivElement
	{
		return ContextPool.get(id)?._container;
	}
	
	// Get canvas
	public static getCanvas(id: string): HTMLCanvasElement
	{
		return ContextPool.get(id)?._canvas;
	}
	
	// Delete context
	public static delete(id: string)
	{
		ContextPool.delete(id);
	}
}