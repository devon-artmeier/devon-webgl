import { TextureFilter, TextureWrap } from "./enums";
import { Resource } from "../private/resource";
import { ResourceManager } from "../private/resource-manager"
import { Context } from "./context";
import { ContextCollection } from "../private/context-collection";

export class Framebuffer extends Resource
{
	private _buffer: WebGLFramebuffer;
	private _texture: WebGLTexture;
	private _depth: WebGLTexture;
	private _filter: TextureFilter = TextureFilter.Bilinear;
	private _wrapX: TextureWrap = TextureWrap.Repeat;
	private _wrapY: TextureWrap = TextureWrap.Repeat;
	
	get width(): number { return this._width; }
	get height(): number { return this._height; }
	get filter(): TextureFilter { return this._filter; }
	get wrapX(): TextureWrap { return this._wrapX; }
	get wrapY(): TextureWrap { return this._wrapY; }
	
	/**************************/
	/* CLASS OBJECT FUNCTIONS */
	/**************************/
	
	// Constructor
	private constructor(context: Context, id: string, manager: ResourceManager,
		private _width: number, private _height: number)
	{
		super(context, id, manager);
		let gl = this._context.gl;
		
		this._buffer = gl.createFramebuffer();
		this._texture = gl.createTexture();
		this._depth = gl.createTexture();

		gl.bindTexture(gl.TEXTURE_2D, this._texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._width, this._height, 0,
			gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(this._width * this._height * 4));
			
		gl.bindTexture(gl.TEXTURE_2D, this._depth);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH24_STENCIL8, this._width, this._height, 0,
			gl.DEPTH_STENCIL, gl.UNSIGNED_INT_24_8, null);
		
		this._context.textures.rebind();
			
		this.tempBind();
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
			gl.TEXTURE_2D, this._texture, 0);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT,
			gl.TEXTURE_2D, this._depth, 0);
		this.tempUnbind();
	}
	
	// Bind
	public bind()
	{
		let gl = this._context.gl;
		gl.bindFramebuffer(gl.FRAMEBUFFER, this._buffer);
	}
	
	// Unbind
	public unbind()
	{
		let gl = this._context.gl;
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}

	// Bind texture
	public bindTexture()
	{
		let gl = this._context.gl;
		this._context.textures.unbindCurrent();
		gl.bindTexture(gl.TEXTURE_2D, this._texture);
	}
	
	// Set filter
	public setFilter(filter: TextureFilter)
	{
		let gl = this._context.gl;
		gl.bindTexture(gl.TEXTURE_2D, this._texture);
		this._filter = filter;

		if (this._filter == TextureFilter.Bilinear) {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		}

		this._context.textures.rebind();
	}
	
	// Get wrap mode
	private getWrapMode(mode: TextureWrap): number
	{
		let gl = this._context.gl;
		return [gl.CLAMP_TO_EDGE, gl.REPEAT, gl.MIRRORED_REPEAT][mode];
	}
	
	// Set horizontal wrap mode
	public setWrapX(mode: TextureWrap)
	{
		let gl = this._context.gl;
		gl.bindTexture(gl.TEXTURE_2D, this._texture);

		this._wrapX = mode;
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.getWrapMode(mode));

		this._context.textures.rebind();
	}
	
	// Set vertical wrap mode
	public setWrapY(mode: TextureWrap)
	{
		let gl = this._context.gl;
		gl.bindTexture(gl.TEXTURE_2D, this._texture);

		this._wrapY = mode;
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.getWrapMode(mode));

		this._context.textures.rebind();
	}
	
	// Set wrap modes
	public setWrap(modeX: TextureWrap, modeY: TextureWrap)
	{
		let gl = this._context.gl;
		gl.bindTexture(gl.TEXTURE_2D, this._texture);

		this._wrapX = modeX;
		this._wrapY = modeY;
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.getWrapMode(modeX));
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.getWrapMode(modeY));

		this._context.textures.rebind();
	}
	
	// Resize
	public resize(width: number, height: number)
	{
		let gl = this._context.gl;
		gl.bindTexture(gl.TEXTURE_2D, this._texture);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
			gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(width * height * 4));
		this._width = width;
		this._height = height;

		this._context.textures.rebind();
	}
	
	// Delete
	public delete()
	{
		let gl = this._context.gl;
		this._manager.unbind(this.id);
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
	public static create(fboID: string, width: number, height: number)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let manager = context.fbos;
			let fbo = new Framebuffer(context, fboID, manager, width, height);
			manager.add(fboID, fbo);
		}
	}
	
	// Bind
	public static bind(fboID: string)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let manager = context.fbos;
			manager.bind(fboID);
		}
	}
	
	// Unbind
	public static unbind()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			context.fbos.unbindCurrent();
		}
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
	public static getFilter(fboID: string): TextureFilter
	{
		return this.getFBO(fboID)?.height;
	}
	
	// Get horizontal wrap mode
	public static getWrapX(fboID: string): TextureWrap
	{
		return this.getFBO(fboID)?.wrapX;
	}
	
	// Get vertical wrap mode
	public static getWrapY(fboID: string): TextureWrap
	{
		return this.getFBO(fboID)?.wrapY;
	}
	
	// Set filter
	public static setFilter(fboID: string, filter: TextureFilter)
	{
		this.getFBO(fboID)?.setFilter(filter);
	}
	
	// Set horizontal wrap mode
	public static setWrapX(fboID: string, wrap: TextureWrap)
	{
		this.getFBO(fboID)?.setWrapX(wrap);
	}
	
	// Set vertical wrap mode
	public static setWrapY(fboID: string, wrap: TextureWrap)
	{
		this.getFBO(fboID)?.setWrapY(wrap);
	}
	
	// Set wrap modes
	public static setWrap(fboID: string, wrapX: TextureWrap, wrapY: TextureWrap)
	{
		this.getFBO(fboID)?.setWrap(wrapX, wrapY);
	}

	// Bind texture
	public static bindTexture(fboID: string)
	{
		this.getFBO(fboID)?.bindTexture();
	}
	
	// Resize
	public static resize(fboID: string, width: number, height: number)
	{
		this.getFBO(fboID)?.resize(width, height);
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