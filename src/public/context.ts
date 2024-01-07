import { Vector4 } from "./tuples";
import { Resource } from "../private/resource";
import { ResourceManager } from "../private/resource-manager";
import { ContextPool } from "../private/context-pool";

export class Context extends Resource
{
	public readonly gl: WebGL2RenderingContext;
	public readonly textures = new ResourceManager();
	public readonly shaders = new ResourceManager();
	public readonly meshes = new ResourceManager();

	private _currentTexture: WebGLTexture;
	private _currentShader: WebGLProgram;
	private _currentFBO: WebGLFramebuffer;
	private _currentVBO: WebGLBuffer;
	private _currentEBO: WebGLBuffer;
	private _currentVAO: WebGLVertexArrayObject;

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
	constructor(public readonly canvas: HTMLCanvasElement, id: string)
	{
		super(null, id);

		this.gl = this.canvas?.getContext("webgl2",
			{ alpha: true, stencil: true, preserveDrawingBuffer: true });
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
		if (this._currentFBO != fbo) {
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
		this.textures.clear();
		this.shaders.clear();
		this.meshes.clear();
	}
	
	/********************/
	/* STATIC FUNCTIONS */
	/********************/

	// Create context
	public static create(id: string, canvas: HTMLCanvasElement)
	{
		let manager = ContextPool.contexts;
		let context = new Context(canvas, id);
		if (context.gl != null) {
			manager.add(id, new Context(canvas, id));
		}
	}

	// Bind
	public static bind(id: string)
	{
		ContextPool.bind(id);
	}
	
	// Clear
	public static clear(color: Vector4<number>)
	{
		let context = ContextPool.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.clearColor(... color);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
		}
	}
	
	// Delete context
	public static delete(id: string)
	{
		ContextPool.delete(id);
	}
}