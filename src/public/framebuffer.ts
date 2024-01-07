import { Vector2 } from "./tuples";
import { Resource } from "../private/resource";
import { Context } from "./context";
import { ContextCollection } from "../private/context-collection";
import { Texture } from "./texture";

export class Framebuffer extends Resource
{
	private _buffer: WebGLFramebuffer;
	private _texture: WebGLTexture;
	private _depth: WebGLTexture;
	private _filter: Vector2<number> = [Texture.Bilinear, Texture.Bilinear];
	private _wrap: Vector2<number> = [Texture.Repeat, Texture.Repeat];
	
	get size(): Vector2<number> { return [this._size[0], this._size[1]]; }
	get width(): number { return this._size[0]; }
	get height(): number { return this._size[1]; }
	get filter(): Vector2<number> { return this._filter; }
	get minFilter(): number { return this._filter[0]; }
	get magFilter(): number { return this._filter[1]; }
	get wrap(): Vector2<number> { return this._wrap; }
	get wrapX(): number { return this._wrap[0]; }
	get wrapY(): number { return this._wrap[1]; }
	
	/**************************/
	/* CLASS OBJECT FUNCTIONS */
	/**************************/
	
	// Constructor
	private constructor(context: Context, id: string, private _size: Vector2<number>)
	{
		super(context, id);
		let gl = this._context.gl;

		if (_size[0] <= 0) _size[0] = 1;
		if (_size[1] <= 0) _size[1] = 1;

		this._buffer = gl.createFramebuffer();
		this._texture = gl.createTexture();
		this._depth = gl.createTexture();

		this.bindTexture();
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._size[0], this._size[1], 0,
			gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(this._size[0] * this._size[1] * 4));
			
		gl.bindTexture(gl.TEXTURE_2D, this._depth);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH24_STENCIL8, this._size[0], this._size[1], 0,
			gl.DEPTH_STENCIL, gl.UNSIGNED_INT_24_8, null);
		
		gl.bindFramebuffer(gl.FRAMEBUFFER, this._buffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
			gl.TEXTURE_2D, this._texture, 0);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT,
			gl.TEXTURE_2D, this._depth, 0);
			
		this._context.fbos.currentBind?.bind();
	}
	
	// Bind
	public bind()
	{
		if (this._context.fbos.currentBind != this) {
			let gl = this._context.gl;
			gl.bindFramebuffer(gl.FRAMEBUFFER, this._buffer);
			this._context.fbos.currentBind = this;
		}
	}

	// Bind texture
	public bindTexture()
	{
		if (this._context.textures.currentBind != this) {
			let gl = this._context.gl;
			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			this._context.textures.currentBind = this;
		}
	}
	
	// Set size
	public setSize(size: Vector2<number>)
	{
		let gl = this._context.gl;
		this.bindTexture();
		this._size = size;

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._size[0], this._size[1], 0,
			gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(this._size[0] * this._size[1] * 4));
	}

	// Set width
	public setWidth(width: number)
	{
		this.setSize([width, this.size[1]]);
	}

	// Set height
	public setHeight(height: number)
	{
		this.setSize([this.size[0], height]);
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
		this.bindTexture();
		this._filter[0] = filter;

		if (filter == Texture.Bilinear) {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		}
	}

	// Set magnification filter
	public setMagFilter(filter: number)
	{
		let gl = this._context.gl;
		this.bindTexture();
		this._filter[1] = filter;

		if (filter == Texture.Bilinear) {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		}
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
		this.bindTexture();

		this._wrap[0] = mode;
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.getWrapMode(mode));
	}
	
	// Set vertical wrap mode
	public setWrapY(mode: number)
	{
		let gl = this._context.gl;
		this.bindTexture();

		this._wrap[1] = mode;
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.getWrapMode(mode));
	}
	
	// Delete
	public delete()
	{
		let gl = this._context.gl;
		gl.deleteFramebuffer(this._buffer);
		gl.deleteTexture(this._texture);
		gl.deleteTexture(this._buffer);
	}
	
	/********************/
	/* STATIC FUNCTIONS */
	/********************/
	
	// Get framebuffer
	private static getFBO(fboID: string): Framebuffer
	{
		return ContextCollection.getBind()?.fbos.get(fboID) as Framebuffer;
	}

	// Create
	public static create(fboID: string, size: Vector2<number>)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let fbo = new Framebuffer(context, fboID, size);
			context.fbos.add(fboID, fbo);
		}
	}
	
	// Bind
	public static bind(fboID: string)
	{
		return this.getFBO(fboID)?.bind();
	}
	
	// Unbind
	public static unbind()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			context.fbos.currentBind = null;
		}
	}

	// Get size
	public static getSize(fboID: string): Vector2<number>
	{
		return this.getFBO(fboID)?.size;
	}
	
	// Get width
	public static getWidth(fboID: string): number
	{
		return this.getFBO(fboID)?.width;
	}
	
	// Get height
	public static getHeight(fboID: string): number
	{
		return this.getFBO(fboID)?.height;
	}
	
	// Get filter
	public static getFilter(fboID: string): Vector2<number>
	{
		return this.getFBO(fboID)?.filter;
	}
	
	// Get minification filter
	public static getMinFilter(fboID: string): number
	{
		return this.getFBO(fboID)?.minFilter;
	}
	
	// Get magnification filter
	public static getMagFilter(fboID: string): number
	{
		return this.getFBO(fboID)?.magFilter;
	}

	// Get wrap modes
	public static getWrap(fboID: string): Vector2<number>
	{
		return this.getFBO(fboID)?.wrap;
	}
	
	// Get horizontal wrap mode
	public static getWrapX(fboID: string): number
	{
		return this.getFBO(fboID)?.wrapX;
	}
	
	// Get vertical wrap mode
	public static getWrapY(fboID: string): number
	{
		return this.getFBO(fboID)?.wrapY;
	}
	
	// Set size
	public static setSize(fboID: string, size: Vector2<number>)
	{
		this.getFBO(fboID)?.setSize(size);
	}

	// Set width
	public static setWidth(fboID: string, width: number)
	{
		this.getFBO(fboID)?.setWidth(width);
	}

	// Set height
	public static setHeight(fboID: string, height: number)
	{
		this.getFBO(fboID)?.setHeight(height);
	}
	
	// Set filter
	public static setFilter(fboID: string, filter: number)
	{
		this.getFBO(fboID)?.setFilter(filter);
	}
	
	// Set minification filter
	public static setMinFilter(fboID: string, filter: number)
	{
		this.getFBO(fboID)?.setMinFilter(filter);
	}
	
	// Set magnification filter
	public static setMagFilter(fboID: string, filter: number)
	{
		this.getFBO(fboID)?.setMagFilter(filter);
	}
	
	// Set wrap mode
	public static setWrap(fboID: string, mode: number)
	{
		this.getFBO(fboID)?.setWrap(mode);
	}
	
	// Set horizontal wrap mode
	public static setWrapX(fboID: string, mode: number)
	{
		this.getFBO(fboID)?.setWrapX(mode);
	}
	
	// Set vertical wrap mode
	public static setWrapY(fboID: string, mode: number)
	{
		this.getFBO(fboID)?.setWrapY(mode);
	}
	
	// Set active texture number
	public static setActiveTexture(num: number, fboID: string)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.activeTexture(gl.TEXTURE1 + num);
			this.getFBO(fboID)?.bindTexture();
			gl.activeTexture(gl.TEXTURE0);
		}
	}
	
	// Delete
	public static delete(fboID: string)
	{
		ContextCollection.getBind()?.fbos.delete(fboID);
	}
	
	// Delete all textures
	public static clear()
	{
		ContextCollection.getBind()?.fbos.clear();
	}
}