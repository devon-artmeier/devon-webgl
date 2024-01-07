import { Vector2, Vector4 } from "./tuples";
import { Resource } from "../private/resource";
import { Context } from "./context";
import { ContextPool } from "../private/context-pool";

export class Texture extends Resource
{
	private _texture: WebGLTexture;
	private _filter: Vector2<number> = [Texture.Bilinear, Texture.Bilinear];
	private _wrap: Vector2<number> = [Texture.Repeat, Texture.Repeat];

	private _fbo: WebGLFramebuffer;
	private _depthBuffer: WebGLTexture;
	
	get size(): Vector2<number> { return [this._size[0], this._size[1]]; }
	get width(): number { return this._size[0]; }
	get height(): number { return this._size[1]; }
	get filter(): Vector2<number> { return this._filter; }
	get minFilter(): number { return this._filter[0]; }
	get magFilter(): number { return this._filter[1]; }
	get wrap(): Vector2<number> { return this._wrap; }
	get wrapX(): number { return this._wrap[0]; }
	get wrapY(): number { return this._wrap[1]; }

	// Filter modes
	public static readonly Nearest = 0;
	public static readonly Bilinear = 1;

	// Wrap modes
	public static readonly Clamp = 0;
	public static readonly Repeat = 1;
	public static readonly Mirror = 2;
	
	/**************************/
	/* CLASS OBJECT FUNCTIONS */
	/**************************/
	
	// Constructor
	private constructor(context: Context, id: string, private _size: Vector2<number>)
	{
		super(context, id);
		let gl = this._context.gl;

		if (this._size[0] <= 0) this._size[0] = 1;
		if (this._size[1] <= 0) this._size[1] = 1;

		this._texture = gl.createTexture();
		this.bind();
		
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._size[0],this. _size[1], 0,
			gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(this._size[0] * this._size[1] * 4));
	}
	
	// Bind
	public bind()
	{
		if (this._context.binds.get("texture") != this) {
			let gl = this._context.gl;
			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			this._context.binds.set("texture", this);
		}
	}
	
	// Set filter
	public setFilter(filter: number)
	{
		this.setMinFilter(filter);
		this.setMagFilter(filter);
	}

	// Set minification filter
	public setMinFilter(filter: number)
	{
		let gl = this._context.gl;
		this.bind();
		this._filter[0] = filter;

		let filters = [
			gl.NEAREST, gl.LINEAR,
			gl.NEAREST_MIPMAP_LINEAR, gl.LINEAR_MIPMAP_LINEAR,
		];
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
			filters[filter + (this._fbo == null ? 2 : 0)]);
	}

	// Set magnification filter
	public setMagFilter(filter: number)
	{
		let gl = this._context.gl;
		this.bind();
		this._filter[1] = filter;

		let filters = [
			gl.NEAREST, gl.LINEAR
		];
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filters[filter]);
	}
	
	// Get wrap mode
	private getWrapMode(mode: number): number
	{
		let gl = this._context.gl;
		return [gl.CLAMP_TO_EDGE, gl.REPEAT, gl.MIRRORED_REPEAT][mode];
	}
	
	// Set wrap mode
	public setWrap(mode: number)
	{
		this.setWrapX(mode);
		this.setWrapY(mode);
	}
	
	// Set horizontal wrap mode
	public setWrapX(mode: number)
	{
		let gl = this._context.gl;
		this.bind();

		this._wrap[0] = mode;
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.getWrapMode(mode));
	}
	
	// Set vertical wrap mode
	public setWrapY(mode: number)
	{
		let gl = this._context.gl;
		this.bind();

		this._wrap[1] = mode;
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.getWrapMode(mode));
	}

	// Set as render target
	public setRenderTarget()
	{
		let gl = this._context.gl;

		if (this._fbo == null) {
			// Not created
			this._fbo = gl.createFramebuffer();
			this._depthBuffer = gl.createTexture();

			gl.bindTexture(gl.TEXTURE_2D, this._depthBuffer);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH24_STENCIL8, this._size[0], this._size[1], 0,
				gl.DEPTH_STENCIL, gl.UNSIGNED_INT_24_8, null);
				
			gl.bindFramebuffer(gl.FRAMEBUFFER, this._fbo);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
				gl.TEXTURE_2D, this._texture, 0);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT,
				gl.TEXTURE_2D, this._depthBuffer, 0);

			this._context.binds.set("texture", null);
			this.setMinFilter(this._filter[0]);
		} else {
			// Created
			if (this._context.binds.get("framebuffer") != this) {
				gl.bindFramebuffer(gl.FRAMEBUFFER, this._fbo);
			}
		}
		
		this._context.binds.set("framebuffer", this);
	}
	
	// Generate with color
	public generate(color: Vector4<number>)
	{
		let conv = function(val: number) {
			return Math.floor(val * 255);
		};

		let gl = this._context.gl;
		this.bind();
		
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
			new Uint8Array([conv(color[0]), conv(color[1]), conv(color[2]), conv(color[3])]));
		gl.generateMipmap(gl.TEXTURE_2D);
		this._size = [1, 1];
	}
	
	// Load image file
	public loadImage(path: string)
	{
		let image = new Image();
		image.crossOrigin = "anonymous";
		image.src = path;
			
		image.onload = () => {
			if (this._texture != null) {
				let gl = this._context.gl;
				this._size = [image.width, image.height];

				let curTexture = gl.getParameter(gl.TEXTURE_BINDING_2D) as WebGLTexture;

				gl.bindTexture(gl.TEXTURE_2D, this._texture);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
				gl.generateMipmap(gl.TEXTURE_2D);

				gl.bindTexture(gl.TEXTURE_2D, curTexture);
			}
		};
	}
	
	// Delete
	public delete()
	{
		let gl = this._context.gl;
		if (this._texture != null) gl.deleteTexture(this._texture);
		if (this._fbo != null) gl.deleteTexture(this._fbo);
		if (this._depthBuffer != null) gl.deleteTexture(this._depthBuffer);
	}
	
	/********************/
	/* STATIC FUNCTIONS */
	/********************/
	
	// Get texture
	private static getTexture(textureID: string): Texture
	{
		return ContextPool.getBind()?.textures.get(textureID) as Texture;
	}

	// Create
	public static create(textureID: string, size: Vector2<number> = [1, 1])
	{
		let context = ContextPool.getBind();
		if (context != null) {
			let texture = new Texture(context, textureID, size);
			context.textures.add(textureID, texture);
		}
	}

	// Get size
	public static getSize(textureID: string): Vector2<number>
	{
		return this.getTexture(textureID)?.size;
	}
	
	// Get width
	public static getWidth(textureID: string): number
	{
		return this.getTexture(textureID)?.width;
	}
	
	// Get height
	public static getHeight(textureID: string): number
	{
		return this.getTexture(textureID)?.height;
	}
	
	// Get filter
	public static getFilter(textureID: string): Vector2<number>
	{
		return this.getTexture(textureID)?.filter;
	}
	
	// Get minification filter
	public static getMinFilter(textureID: string): number
	{
		return this.getTexture(textureID)?.minFilter;
	}
	
	// Get magnification filter
	public static getMagFilter(textureID: string): number
	{
		return this.getTexture(textureID)?.magFilter;
	}

	// Get wrap modes
	public static getWrap(textureID: string): Vector2<number>
	{
		return this.getTexture(textureID)?.wrap;
	}
	
	// Get horizontal wrap mode
	public static getWrapX(textureID: string): number
	{
		return this.getTexture(textureID)?.wrapX;
	}
	
	// Get vertical wrap mode
	public static getWrapY(textureID: string): number
	{
		return this.getTexture(textureID)?.wrapY;
	}
	
	// Set filter
	public static setFilter(textureID: string, filter: number)
	{
		this.getTexture(textureID)?.setFilter(filter);
	}
	
	// Set minification filter
	public static setMinFilter(textureID: string, filter: number)
	{
		this.getTexture(textureID)?.setMinFilter(filter);
	}
	
	// Set magnification filter
	public static setMagFilter(textureID: string, filter: number)
	{
		this.getTexture(textureID)?.setMagFilter(filter);
	}
	
	// Set wrap mode
	public static setWrap(textureID: string, mode: number)
	{
		this.getTexture(textureID)?.setWrap(mode);
	}
	
	// Set horizontal wrap mode
	public static setWrapX(textureID: string, mode: number)
	{
		this.getTexture(textureID)?.setWrapX(mode);
	}
	
	// Set vertical wrap mode
	public static setWrapY(textureID: string, mode: number)
	{
		this.getTexture(textureID)?.setWrapY(mode);
	}
	
	// Set active texture number
	public static setActive(num: number, textureID: string)
	{
		let context = ContextPool.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.activeTexture(gl.TEXTURE1 + num);
			this.getTexture(textureID)?.bind();
			gl.activeTexture(gl.TEXTURE0);
		}
	}

	// Set render target
	public static setRenderTarget(textureID: string)
	{
		this.getTexture(textureID)?.setRenderTarget();
	}

	// Unset render target
	public static unsetRenderTarget()
	{
		let context = ContextPool.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			context.binds.set("framebuffer", null);
		}
	}
	
	// Generate with color
	public static generate(textureID: string, color: Vector4<number>)
	{
		this.getTexture(textureID)?.generate(color);
	}
	
	// Load image
	public static loadImage(textureID: string, path: string)
	{
		this.getTexture(textureID)?.loadImage(path);
	}
	
	// Delete
	public static delete(textureID: string)
	{
		ContextPool.getBind().textures.delete(textureID);
	}
	
	// Delete all textures
	public static clear()
	{
		ContextPool.getBind().textures.clear();
	}
}