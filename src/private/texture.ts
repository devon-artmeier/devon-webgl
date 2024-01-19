import { Context } from "./context";
import { TextureFilter, TextureWrap } from "../public/enum";

/**
 * A class that represents a texture.
 */
export class Texture
{
	/** The WebGL texture object */
	protected readonly _glTexture: WebGLTexture;

	/** The width of the texture. */
	protected _width: number = 0;

	/** The height of the texture. */
	protected _height: number = 0;

	/** The minification filter mode of the texture. */
	protected _minFilter: TextureFilter = TextureFilter.Linear;

	/** The magnification filter mode of the texture. */
	protected _magFilter: TextureFilter = TextureFilter.Linear;

	/** The S-axis wrap mode of the texture. */
	protected _wrapS: TextureWrap = TextureWrap.Clamp;

	/** The T-axis wrap mode of the texture. */
	protected _wrapT: TextureWrap = TextureWrap.Clamp;

	/** Texture has mipmaps flag. */
	protected _hasMipmaps: boolean = false;

	/** 
	 * Get the width of the texture.
	 */
	get width(): number
	{
		return this._width;
	}

	/** 
	 * Get the height of the texture.
	 */
	get height(): number
	{
		return this._height;
	}

	/**
	 * Get the size of the texture.
	 */
	get size(): [number, number]
	{
		return [this._width, this._height];
	}
	
	/** 
	 * Get the minification filter mode of the texture.
	 */
	get minFilter(): TextureFilter
	{
		return this._minFilter;
	}
	
	/** 
	 * Set the minification filter mode of the texture.
	 */
	set minFilter(value: TextureFilter)
	{
		let gl = this._context.gl;
		this.bind();
		this._minFilter = value;

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
			[gl.NEAREST, gl.LINEAR,
			 gl.NEAREST_MIPMAP_LINEAR, gl.LINEAR_MIPMAP_LINEAR,
			][value + (this._hasMipmaps ? 2 : 0)]);
	}

	/** 
	 * Get the magnification filter mode of the texture.
	 */
	get magFilter(): TextureFilter
	{
		return this._magFilter;
	}

	/** 
	 * Set the magnification filter mode of the texture.
	 */
	set magFilter(value: TextureFilter)
	{
		let gl = this._context.gl;
		this.bind();
		this._magFilter = value;

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,
			[gl.NEAREST, gl.LINEAR][value]);
	}
	
	/** 
	 * Get the minification filter mode of the texture.
	 */
	get wrapS(): TextureWrap
	{
		return this._wrapS;
	}

	/** 
	 * Set the S-axis wrap mode of the texture.
	 */
	set wrapS(value: TextureWrap)
	{
		let gl = this._context.gl;
		this.bind();
		this._wrapS = value;

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,
			[gl.CLAMP_TO_EDGE, gl.REPEAT, gl.MIRRORED_REPEAT][value]);
	}

	/** 
	 * Set the T-axis wrap mode of the texture.
	 */
	get wrapT(): TextureWrap
	{
		return this._wrapT;
	}

	/** 
	 * Set the T-axis wrap mode of the texture.
	 */
	set wrapT(value: TextureWrap)
	{
		let gl = this._context.gl;
		this.bind();
		this._wrapT = value;

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,
			[gl.CLAMP_TO_EDGE, gl.REPEAT, gl.MIRRORED_REPEAT][value]);
	}

	/**
	 * The constructor of the `Texture` class.
	 * 
	 * @param id The ID of the texture.
	 * @param _context The WebGL context.
	 * @param size: The size of the texture.
	 * @param renderTexture: Render texture flag.
	 */
	constructor(public readonly id: string, protected readonly _context: Context,
		size: [number, number])
	{
		if (this._context != null) {
			let gl = this._context.gl;
	
			this._context.textures.get(this.id)?.delete();
			this._context.textures.set(this.id, this);
			
			// Create WebGL texture
			// (Minification filter is set in generateBlank)
			this._glTexture = gl.createTexture();
			this.magFilter = this._magFilter;
			this.wrapS = this._wrapS;
			this.wrapT = this._wrapT;
			this.generateBlank(size);
		}
	}

	/**
	 * Bind texture.
	 */
	public bind()
	{
		this._context.bindGLTexture(this._glTexture);
	}

	/**
	 * Bind render texture's framebuffer for rendering onto (dummied out).
	 */
	public bindFBO() { }
	
	/**
	 * Resize render texture (dummied out).
	 * 
	 * @param size The new size of the render texture.
	 */
	public resize(size: [number, number]) { }

	/**
	 * Generate blank texture.
	 * 
	 * @param size Size of texture to generate.
	 */
	public generateBlank(size: [number, number])
	{
		// No mipmaps, make sure minification filter is set properly
		this._hasMipmaps = false;
		this.minFilter = this._minFilter;

		if (size[0] < 1) size[0] = 1;
		if (size[1] < 1) size[1] = 1;

		let gl = this._context.gl;
		this.bind();

		if (size[0] != this._width || size[1] != this._height) {
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0], size[1], 0,
				gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(size[0] * size[1] * 4));
		} else {
			gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, size[0], size[1],
				gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(size[0] * size[1] * 4));
		}

		this._width = size[0];
		this._height = size[1];
	}

	/**
	 * Load image file into texture.
	 * 
	 * @param path Path to image file.
	 */
	public loadImageFile(path: string)
	{
		let image = new Image();
		image.crossOrigin = "anonymous";
		image.src = path;
			
		image.onload = () => {
			let oldTexture = this._context.currentTexture;
			this.loadImage(image);
			this._context.bindGLTexture(oldTexture);
		};
	}

	/**
	 * Load image into texture.
	 * 
	 * @param image Image to load.
	 */
	public loadImage(image: HTMLImageElement)
	{
		let gl = this._context.gl;
		this.bind();
		
		if (image.width != this._width || image.height != this._height) {
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
		} else {
			gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, image.width, image.height,
				gl.RGBA, gl.UNSIGNED_BYTE, image);
		}
		
		this._width = image.width;
		this._height = image.height;
		
		// No mipmaps, make sure minification filter is set properly
		this._hasMipmaps = false;
		this.minFilter = this._minFilter;
	}

	/**
	 * Load video frame into texture.
	 */
	public loadVideoFrame(video: HTMLVideoElement)
	{
		let gl = this._context.gl;
		this.bind();
		
		if (video.videoWidth != this._width || video.videoHeight != this._height) {
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video)
		} else {
			gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, video.videoWidth, video.videoHeight,
				gl.RGBA, gl.UNSIGNED_BYTE, video);
		}
		
		this._width = video.videoWidth;
		this._height = video.videoHeight;
		
		// No mipmaps, make sure minification filter is set properly
		this._hasMipmaps = false;
		this.minFilter = this._minFilter;
	}

	/**
	 * Generate mipmaps for texture.
	 */
	public generateMipmaps()
	{
		let gl = this._context.gl;
		this.bind();

		gl.generateMipmap(gl.TEXTURE_2D);
		this._hasMipmaps = true;
		
		// Mipmaps generated, make sure minification filter is set properly
		this.minFilter = this._minFilter;
	}

	/**
	 * Delete texture.
	 */
	public delete()
	{
		this._context.deleteGLTexture(this._glTexture);
		this._context.textures.delete(this.id);
	}
}