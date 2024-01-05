import { Resource } from "../resources/resource";
import { Context } from "./context";
import { ContextCollection } from "../resources/context-collection";
import { TextureFilter, TextureWrap } from "../types/enums";

export class Framebuffer extends Resource
{
	private _buffer: WebGLFramebuffer;
	private _texture: WebGLTexture;
	private _depth: WebGLTexture;
	private _filter: TextureFilter = TextureFilter.Bilinear;
	private _wrapX: TextureWrap = TextureWrap.Repeat;
	private _wrapY: TextureWrap = TextureWrap.Repeat;
	private _tempBind: boolean = false;
	
	get width(): number { return this._width; }
	get height(): number { return this._height; }
	get filter(): TextureFilter { return this._filter; }
	get wrapX(): TextureWrap { return this._wrapX; }
	get wrapY(): TextureWrap { return this._wrapY; }
	
	/**************************/
	/* CLASS OBJECT FUNCTIONS */
	/**************************/
	
	// Constructor
	private constructor(context: Context, id: string, private _width: number, private _height: number)
	{
		super(context, id);
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
		
		this.rebindTexture();
		
		this.tempBind();
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
			gl.TEXTURE_2D, this._texture, 0);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT,
			gl.TEXTURE_2D, this._depth, 0); 
		this.tempUnbind();
	}
	
	// Temporary bind
	public tempBind()
	{
		if (this._context.fbos.bind?.id != this.id) {
			let gl = this._context.gl;
			gl.bindFramebuffer(gl.FRAMEBUFFER, this._buffer);
			this._tempBind = true;
		}
	}
	
	// Unbind temporary bind
	public tempUnbind()
	{
		if (this._tempBind) {
			Framebuffer.rebind(this._context.id);
			this._tempBind = false;
		}
	}

	// Rebind previous texture
	private rebindTexture()
	{
		let gl = this._context.gl;
		gl.bindTexture(gl.TEXTURE_2D, ContextCollection.get(this._context.id).textures.bind);
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
		
		this.rebindTexture();
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
		
		this.rebindTexture();
	}
	
	// Set vertical wrap mode
	public setWrapY(mode: TextureWrap)
	{
		let gl = this._context.gl;
		gl.bindTexture(gl.TEXTURE_2D, this._texture);
		
		this._wrapY = mode;
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.getWrapMode(mode));
		
		this.rebindTexture();
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
		
		this.rebindTexture();
	}

	// Bind texture
	public bindTexture()
	{
		let gl = this._context.gl;
		if (gl != null) {
			if (this._context.textures.bind != this) {
				gl.bindTexture(gl.TEXTURE_2D, this._texture);
				this._context.textures.bind = this;
			}
		}
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
		
		this.rebindTexture();
	}
	
	// Delete
	public delete()
	{
		let gl = this._context.gl;
		if (this._context.fbos.bind?.id == this.id) {
			Framebuffer.unbind(this._context.id);
		}
		gl.deleteFramebuffer(this._buffer);
		gl.deleteTexture(this._texture);
		gl.deleteTexture(this._buffer);
	}
	
	/********************/
	/* STATIC FUNCTIONS */
	/********************/
	
	// Get framebuffer
	private static getFramebuffer(contextID: string, fboID: string): Framebuffer
	{
		return ContextCollection.get(contextID).fbos.get(fboID) as Framebuffer;
	}

	// Create
	public static create(contextID: string, fboID: string, width: number, height: number)
	{
		let context = ContextCollection.get(contextID);
		if (context != null) {
			let fbo = new Framebuffer(context, fboID, width, height);
			ContextCollection.get(contextID).fbos.add(fboID, fbo);
		}
	}
	
	// Bind
	public static bind(contextID: string, fboID: string)
	{
		let gl = ContextCollection.get(contextID)?.gl;
		let fbo = this.getFramebuffer(contextID, fboID);
		if (gl != null) {
			if (ContextCollection.get(contextID).fbos.bind != fbo) {
				gl.bindFramebuffer(gl.FRAMEBUFFER, fbo._buffer);
				ContextCollection.get(contextID).fbos.bind = fbo;
			}
		}
	}
	
	// Unbind
	public static unbind(contextID: string)
	{
		let gl = ContextCollection.get(contextID)?.gl;
		if (gl != null && ContextCollection.get(contextID).fbos.bind != null) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			ContextCollection.get(contextID).fbos.bind = null;
		}
	}
	
	// Rebind
	public static rebind(contextID: string)
	{
		let gl = ContextCollection.get(contextID).gl;
		let fbo = this.getFramebuffer(contextID, ContextCollection.get(contextID).fbos.bind?.id);
		if (gl != null && fbo != null) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, fbo._buffer);
		}
	}
	
	// Get width
	public static getWidth(contextID: string, fboID: string): number
	{
		return this.getFramebuffer(contextID, fboID)?.width;
	}
	
	// Get height
	public static getHeight(contextID: string, fboID: string): number
	{
		return this.getFramebuffer(contextID, fboID)?.height;
	}
	
	// Get filter
	public static getFilter(contextID: string, fboID: string): TextureFilter
	{
		return this.getFramebuffer(contextID, fboID)?.height;
	}
	
	// Get horizontal wrap mode
	public static getWrapX(contextID: string, fboID: string): TextureWrap
	{
		return this.getFramebuffer(contextID, fboID)?.wrapX;
	}
	
	// Get vertical wrap mode
	public static getWrapY(contextID: string, fboID: string): TextureWrap
	{
		return this.getFramebuffer(contextID, fboID)?.wrapY;
	}
	
	// Set filter
	public static setFilter(contextID: string, fboID: string, filter: TextureFilter)
	{
		this.getFramebuffer(contextID, fboID)?.setFilter(filter);
	}
	
	// Set horizontal wrap mode
	public static setWrapX(contextID: string, fboID: string, wrap: TextureWrap)
	{
		this.getFramebuffer(contextID, fboID)?.setWrapX(wrap);
	}
	
	// Set vertical wrap mode
	public static setWrapY(contextID: string, fboID: string, wrap: TextureWrap)
	{
		this.getFramebuffer(contextID, fboID)?.setWrapY(wrap);
	}
	
	// Set wrap modes
	public static setWrap(contextID: string, fboID: string, wrapX: TextureWrap, wrapY: TextureWrap)
	{
		this.getFramebuffer(contextID, fboID)?.setWrap(wrapX, wrapY);
	}

	// Bind texture
	public static bindTexture(contextID: string, fboID: string)
	{
		this.getFramebuffer(contextID, fboID)?.bindTexture();
	}
	
	// Resize
	public static resize(contextID: string, fboID: string, width: number, height: number)
	{
		this.getFramebuffer(contextID, fboID)?.resize(width, height);
	}
	
	// Delete
	public static delete(contextID: string, fboID: string)
	{
		ContextCollection.get(contextID).fbos.delete(fboID);
	}
	
	// Delete all textures
	public static clear(contextID: string)
	{
		ContextCollection.get(contextID).fbos.clear();
	}
}