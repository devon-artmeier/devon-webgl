import { Context } from "./context";
import { Texture } from "./texture";

/**
 * A class that represents a render texture. Extends {@link Texture | `Texture`}.
 */
export class RenderTexture extends Texture
{
	/** The WebGL depth buffer texture object. */
	private readonly _glDepthBuffer: WebGLTexture;

	/** The WebGL framebuffer object. */
	private readonly _glFramebuffer: WebGLFramebuffer;

	/**
	 * The constructor of the `RenderTexture` class.
	 * 
	 * @param id The ID of the texture.
	 * @param _context The WebGL context.
	 * @param size: The size of the texture.
	 */
	constructor(id: string, context: Context, size: [number, number])
	{
		super(id, context, size);

		if (this._context != null) {
			let gl = this._context.gl;

			this._glFramebuffer = gl.createFramebuffer();
			this._glDepthBuffer = gl.createTexture();

			this._context.bindGLTexture(this._glDepthBuffer);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH24_STENCIL8, this._width, this._height, 0,
				gl.DEPTH_STENCIL, gl.UNSIGNED_INT_24_8, null);

			this.bindFBO();
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
				gl.TEXTURE_2D, this._glTexture, 0);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT,
				gl.TEXTURE_2D, this._glDepthBuffer, 0);
		}
	}

	/**
	 * Bind render texture's framebuffer for rendering onto.
	 */
	public override bindFBO()
	{
		this._context.bindGLFramebuffer(this._glFramebuffer);
	}
	
	/**
	 * Resize render texture.
	 * 
	 * @param size The new size of the render texture.
	 */
	public override resize(size: [number, number])
	{
		if (size[0] < 1) size[0] = 1;
		if (size[1] < 1) size[1] = 1;

		if (size[0] != this._width || size[1] != this._height) {
			let gl = this._context.gl;

			this._context.bindGLTexture(this._glDepthBuffer);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH24_STENCIL8, size[0], size[1], 0,
				gl.DEPTH_STENCIL, gl.UNSIGNED_INT_24_8, null);
			super.generateBlank(size);
		}
	}

	/**
	 * Generate blank texture (dummied out).
	 * 
	 * @param size Size of texture to generate.
	 */
	public override generateBlank(size: [number, number])
	{
		console.log(`Warning: Cannot create blank texture for render texture "${this.id}".`);
	}

	/**
	 * Load image file (dummied out).
	 * 
	 * @param path Path to image file.
	 */
	public override loadImageFile(path: string)
	{
		console.log(`Warning: Cannot load image file into render texture "${this.id}".`);
	}

	/**
	 * Load image (dummied out).
	 * 
	 * @param image Image to load.
	 */
	public override loadImage(image: HTMLImageElement)
	{
		console.log(`Warning: Cannot load image into render texture "${this.id}".`);
	}

	/**
	 * Load video frame (dummied out).
	 */
	public override loadVideoFrame(video: HTMLVideoElement)
	{
		console.log(`Warning: Cannot load video frame into render texture "${this.id}".`);
	}

	/**
	 * Delete render texture.
	 */
	public delete()
	{
		this._context.deleteGLFramebuffer(this._glFramebuffer);
		this._context.deleteGLTexture(this._glDepthBuffer);
		super.delete();
	}
}