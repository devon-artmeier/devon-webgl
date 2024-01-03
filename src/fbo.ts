import { Texture } from "./texture";
import { Color } from "./color";

// Framebuffer object class
export class FBO extends Texture
{
	private static _curBuffer: FBO;
	
	private _buffer: WebGLFramebuffer;
	private _depth: WebGLTexture;
	
	// Constructor
	constructor(gl: WebGL2RenderingContext, width: number, height: number)
	{
		super(gl);
		
		this._buffer = this._gl.createFramebuffer();
		this._depth = this._gl.createTexture();
		
		this._gl.bindTexture(this._gl.TEXTURE_2D, this._depth);
		this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.DEPTH24_STENCIL8, width, height, 0,
			this._gl.DEPTH_STENCIL, this._gl.UNSIGNED_INT_24_8, null);
		
		this.resize(width, height);
		
		this.bindFBO();
		this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0,
			this._gl.TEXTURE_2D, this._texture, 0);
		this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.DEPTH_STENCIL_ATTACHMENT,
			this._gl.TEXTURE_2D, this._depth, 0); 
		this.unbindFBO();
	}
	
	// Bind
	public bindFBO()
	{
		if (FBO._curBuffer != this) {
			FBO._curBuffer = this;
			this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._buffer);
		}
	}
	
	// Unbind
	public unbindFBO()
	{
		FBO._curBuffer = null;
		this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
	}
	
	// Unbind (static)
	public static unbindFBO(gl: WebGL2RenderingContext)
	{
		FBO._curBuffer = null;
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
	
	// Resize
	public resize(width: number, height: number)
	{
		this.bind();
		this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, width, height, 0,
			this._gl.RGBA, this._gl.UNSIGNED_BYTE, new Uint8Array(width * height * 4));
		this._width = width;
		this._height = height;
		this.unbind();
	}
	
	// Delete
	public delete()
	{
		if (FBO._curBuffer == this) {
			this.unbind();
		}
		super.delete();
		this._gl.deleteFramebuffer(this._buffer);
		this._gl.deleteTexture(this._depth);
		this._buffer = null;
		this._depth = null;
	}
}