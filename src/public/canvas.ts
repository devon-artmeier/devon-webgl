import { Context } from "../private/context";
import { BlendFunc, CullFace, FrontFace, DepthFunc,
	StencilFunc, StencilOption, TextureFilter, TextureWrap } from "./enum";
import { Log } from "../private/log";
import { Matrix } from "./matrix";
import { Mesh } from "../private/mesh";
import { RenderTexture } from "../private/render-texture";
import { Shader } from "../private/shader";
import { Texture } from "../private/texture"
import { Vector2, Vector3, Vector4, Matrix2, Matrix3, Matrix4 } from "./tuples";
import { Vertex } from "./vertex";

/**
 * Framebuffer vertex shader
 */
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

/**
 * Framebuffer fragment shader
 */
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

/**
 * Framebuffer vertex
 */
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

/**
 * Framebuffer vertex data
 */
const fboVertices = [
	new FBOVertex([0, 0], [0, 1]),
	new FBOVertex([1, 1], [1, 0]),
	new FBOVertex([1, 0], [1, 1]),
	new FBOVertex([1, 1], [1, 0]),
	new FBOVertex([0, 0], [0, 1]),
	new FBOVertex([0, 1], [0, 0])
];

/**
 * A class that represents a WebGL canvas.
 */
export class Canvas
{
	/** Fullscreen flag. */
	private static _fullscreen: boolean = false;

	/** Fullscreen initialized flag. */
	private static _fullscreenInit: boolean = false;

	/** Saved scroll position for exiting fullscreen with. */
	private static _savedScroll: Vector2<number>;

	/** The WebGL context. */
	private _context: Context;

	/** The container HTML element. */
	public readonly container: HTMLDivElement;

	/** The canvas HTML element. */
	public readonly canvas: HTMLCanvasElement;

	/** Deleted flag. */
	private _deleted: boolean = false;

	/**
	 * Get canvas width.
	 */
	get width(): number
	{
		return this.getTextureSize("fbo_devon_webgl")[0];
	}

	/**
	 * Resize canvas width.
	 */
	set width(value: number)
	{
		this.container.style.width = `${value}px`;
	}

	/**
	 * Get canvas height.
	 */
	get height(): number
	{
		return this.getTextureSize("fbo_devon_webgl")[1];
	}

	/**
	 * Resize canvas height.
	 */
	set height(value: number)
	{
		this.container.style.height = `${value}px`;
	}

	/**
	 * Get canvas size.
	 */
	get size(): Vector2<number>
	{
		return this.getTextureSize("fbo_devon_webgl");
	}

	/**
	 * Resize canvas.
	 */
	set size(value: Vector2<number>)
	{
		this.width = value[0];
		this.height = value[1];
	}

	/**
	 * The constructor of the `Canvas` class.
	 * 
	 * @param id The ID of the canvas.
	 * @param size: The size of the canvas.
	 */
	constructor(public readonly id: string, size: Vector2<number>)
	{
		this.container = document.createElement("div");
		this.container.id = id;
		this.container.className = "devon-webgl-container";
		this.container.style.width = `${size[0]}px`;
		this.container.style.height = `${size[1]}px`;
		this.container.style.display = `block`;
		this.container.style.zIndex = `-1`;
			
		this.canvas = document.createElement("canvas");
		this.canvas.className = "devon-webgl-canvas";
		this.canvas.style.position = "absolute";
		this.container.appendChild(this.canvas);

		this._context = new Context(this.canvas.getContext("webgl2",
			{ alpha: true, stencil: true, preserveDrawingBuffer: true }));

		let dpr = window.devicePixelRatio;
		size = [Math.round(size[0] * dpr), Math.round(size[1] * dpr)];

		this.createRenderTexture("fbo_devon_webgl", size);
		this.createShader("shader_devon_webgl", fboVertexShader, fboFragShader);
		this.createStaticMesh("mesh_devon_webgl", fboVertices);

		if (!Canvas._fullscreenInit) {
			document.addEventListener("fullscreenchange", function ()
			{
				Canvas._fullscreen = !Canvas._fullscreen;
				if (!Canvas._fullscreen) {
					window.scrollTo(Canvas._savedScroll[0], Canvas._savedScroll[1]);
				}
			});
			Canvas._fullscreenInit = true;
		}
	}

	/**
	 * Clear canvas.
	 * 
	 * @param color Clear color.
	 */
	public clear(color: Vector4<number>)
	{
		if (!this._deleted) {
			let gl = this._context.gl;
			gl.clearColor(... color);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
		}
	}

	/**
	 * Start canvas drawing.
	 */
	public startDraw()
	{
		if (!this._deleted) {
			const rect = this.container.getBoundingClientRect();
			
			let dpr = window.devicePixelRatio;
			this.canvas.width = Math.round(rect.width * dpr);
			this.canvas.height = Math.round(rect.height * dpr);

			if (!Canvas._fullscreen) {
				this.canvas.style.left = `${window.scrollX + rect.left}px`;
				this.canvas.style.top = `${window.scrollY + rect.top}px`;
			} else {
				this.canvas.style.left = `${rect.left}px`;
				this.canvas.style.top = `${rect.top}px`;
			}
			
			this.canvas.style.width = `${this.canvas.width / dpr}px`;
			this.canvas.style.height = `${this.canvas.height / dpr}px`;

			let fboSize = this.getTextureSize("fbo_devon_webgl");
			if (fboSize[0] != this.canvas.width || fboSize[1] != this.canvas.height) {
				fboSize = [this.canvas.width, this.canvas.height];
				this.resizeRenderTexture("fbo_devon_webgl", [this.canvas.width, this.canvas.height]);
			}

			this.bindRenderTexture("fbo_devon_webgl");
		}
	}

	/**
	 * Finish canvas drawing.
	 */
	public finishDraw()
	{
		if (!this._deleted) {
			this._context.bindGLFramebuffer(null);

			this.setViewport([0, 0], [this.canvas.width, this.canvas.height]);
			this.disableDepth();
			this.disableStencil();
			this.setStencilMask(0xFF);
			this.setStencilFunction(StencilFunc.Always, 1, 0xFF);
			this.disableCull();

			let projection = Matrix.ortho([0, 0], [1, 1], [0, 1]);
			
			this.setShaderTexture("shader_devon_webgl", "renderTexture", "fbo_devon_webgl", 0);
			this.setShaderMatrix4("shader_devon_webgl", "projection", projection);

			this.drawMesh("mesh_devon_webgl", "shader_devon_webgl");
		}
	}

	/**
	 * Set canvas to fullscreen.
	 */
	public setFullscreen()
	{
		if (!this._deleted) {
			this.container.requestFullscreen();
			Canvas._savedScroll = [window.scrollX, window.scrollY];
		}
	}

	/**
	 * Log deleted message.
	 * 
	 * @param funcName The name of the function that called this.
	 */
	private deletedMessage(funcName)
	{
		Log.error(`${funcName}: "${this.id}" has been deleted.`);
	}

	/**
	 * Delete canvas.
	 */
	public delete()
	{
		if (!this._deleted) {
			this._context.delete();
			this._deleted = true;
		}
	}

	/************/
	/* VIEWPORT */
	/************/

	/**
	 * Set viewport of canvas.
	 * 
	 * @param pos Position of viewport.
	 * @param res Resolution of viewport.
	 */
	public setViewport(pos: Vector2<number>, res: Vector2<number>)
	{
		if (!this._deleted) {
			this._context.gl.viewport(... pos, ... res);
		} else {
			this.deletedMessage("setViewport");
		}
	}

	/**
	 * Get viewport of canvas.
	 * 
	 * @returns Viewport of canvas.
	 */
	public getViewport(): [Vector2<number>, Vector2<number>]
	{
		if (!this._deleted) {
			let viewport = this._context.gl.getParameter(this._context.gl.VIEWPORT)
			return [[viewport[0], viewport[1]], [viewport[2], viewport[3]]];
		} else {
			this.deletedMessage("getViewport");
		}
		return [[0, 0], [0, 0]];
	}

	/************/
	/* BLENDING */
	/************/

	/**
	 * Enable blending.
	 */
	public enableBlend()
	{
		if (!this._deleted) {
			this._context.gl.enable(this._context.gl.BLEND);
		} else {
			this.deletedMessage("enableBlend");
		}
	}

	/**
	 * Disable blending.
	 */
	public disableBlend()
	{
		if (!this._deleted) {
			this._context.gl.disable(this._context.gl.BLEND);
		} else {
			this.deletedMessage("disableBlend");
		}
	}

	/**
	 * Get WebGL blend function
	 * 
	 * @param func Function ID.
	 * @returns WebGL blend function.
	 */
	private getGLBlendFunc(func: BlendFunc): number
	{
		let gl = this._context.gl;
		return [
			gl.ZERO, gl.ONE, gl.SRC_COLOR, gl.ONE_MINUS_SRC_COLOR,
			gl.DST_COLOR, gl.ONE_MINUS_DST_COLOR, gl.SRC_ALPHA,
			gl.ONE_MINUS_SRC_ALPHA, gl.DST_ALPHA, gl.ONE_MINUS_DST_ALPHA,
			gl.CONSTANT_COLOR, gl.ONE_MINUS_CONSTANT_COLOR,
			gl.CONSTANT_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA
		][func];
	}
	
	/**
	 * Set blend functions.
	 * 
	 * @param srcFunc Source function.
	 * @param dstFunc Destination function.
	 */
	public setBlendFunction(srcFunc: number, dstFunc: number)
	{
		if (!this._deleted) {
			this._context.gl.blendFunc(this.getGLBlendFunc(srcFunc), this.getGLBlendFunc(dstFunc));
		} else {
			this.deletedMessage("setBlendFunction");
		}
	}
	
	/**
	 * Set separate blend functions.
	 * 
	 * @param srcRGB Source red/green/blue blend function.
	 * @param dstRGB Destination red/green/blue blend function.
	 * @param srcAlpha Source alpha blend function.
	 * @param dstAlpha Destination Source blend function.
	 */
	public setBlendFuncSeparate(srcRGB: number, dstRGB: number, srcAlpha: number, dstAlpha: number)
	{
		if (!this._deleted) {
			this._context.gl.blendFuncSeparate(this.getGLBlendFunc(srcRGB), this.getGLBlendFunc(dstRGB),
				this.getGLBlendFunc(srcAlpha), this.getGLBlendFunc(dstAlpha));
		} else {
			this.deletedMessage("setBlendFuncSeparate");
		}
	}

	/***********/
	/* CULLING */
	/***********/
	
	/**
	 * Enable culling.
	 */
	public enableCull()
	{
		if (!this._deleted) {
			this._context.gl.enable(this._context.gl.CULL_FACE);
		} else {
			this.deletedMessage("enableCull");
		}
	}

	/**
	 * Disable culling.
	 */
	public disableCull()
	{
		if (!this._deleted) {
			this._context.gl.disable(this._context.gl.CULL_FACE);
		} else {
			this.deletedMessage("disableCull");
		}
	}

	/**
	 * Set cull face.
	 * 
	 * @param face Cull face.
	 */
	public setCullFace(face: CullFace)
	{
		if (!this._deleted) {
			let gl = this._context.gl;
			gl.cullFace([gl.FRONT, gl.BACK, gl.FRONT_AND_BACK][face]);
		} else {
			this.deletedMessage("setCullFace");
		}
	}

	/**
	 * Set front face direction.
	 * 
	 * @param face Front face direction.
	 */
	public setFrontFace(face: FrontFace)
	{
		if (!this._deleted) {
			let gl = this._context.gl;
			gl.frontFace([gl.CW, gl.CCW][face]);
		} else {
			this.deletedMessage("setFrontFace");
		}
	}

	/*****************/
	/* DEPTH TESTING */
	/*****************/

	/**
	 * Enable depth testing.
	 */
	public enableDepth()
	{
		if (!this._deleted) {
			this._context.gl.enable(this._context.gl.DEPTH_TEST);
		} else {
			this.deletedMessage("enableDepth");
		}
	}

	/**
	 * Disable depth testing.
	 */
	public disableDepth()
	{
		if (!this._deleted) {
			this._context.gl.disable(this._context.gl.DEPTH_TEST);
		} else {
			this.deletedMessage("disableDepth");
		}
	}

	/**
	 * Clear depth buffer.
	 */
	public clearDepthBuffer()
	{
		if (!this._deleted) {
			this._context.gl.clear(this._context.gl.DEPTH_BUFFER_BIT);
		} else {
			this.deletedMessage("clearDepthBuffer");
		}
	}

	/**
	 * Set depth testing function
	 * 
	 * @param func Depth testing function.
	 */
	public setDepthFunction(func: DepthFunc)
	{
		if (!this._deleted) {
			let gl = this._context.gl;
			gl.depthFunc([
				gl.ALWAYS, gl.NEVER, gl.EQUAL, gl.NOTEQUAL,
				gl.LESS, gl.LEQUAL, gl.GREATER, gl.GEQUAL
			][func]);
		} else {
			this.deletedMessage("setDepthFunction");
		}
	}

	/**
	 * Enable depth testing mask
	 */
	public enableDepthMask()
	{
		if (!this._deleted) {
			this._context.gl.depthMask(true);
		} else {
			this.deletedMessage("enableDepthMask");
		}
	}

	/**
	 * Disable depth testing mask
	 */
	public disableDepthMask()
	{
		if (!this._deleted) {
			this._context.gl.depthMask(false);
		} else {
			this.deletedMessage("disableDepthMask");
		}
	}

	/*******************/
	/* SCISSOR TESTING */
	/*******************/

	/**
	 * Enable scissor testing.
	 */
	public enableScissor()
	{
		if (!this._deleted) {
			this._context.gl.enable(this._context.gl.SCISSOR_TEST);
		} else {
			this.deletedMessage("enableScissor");
		}
	}

	/**
	 * Disable scissor testing.
	 */
	public disableScissor()
	{
		if (!this._deleted) {
			this._context.gl.disable(this._context.gl.SCISSOR_TEST);
		} else {
			this.deletedMessage("disableScissor");
		}
	}

	/**
	 * Set scissor testing region.
	 * 
	 * @param pos Position of region.
	 * @param res Resolution of region.
	 */
	public setScissorRegion(pos: Vector2<number>, res: Vector2<number>)
	{
		if (!this._deleted) {
			let viewport = this.getViewport();
			this._context.gl.scissor(pos[0], viewport[1][1] - pos[1] - pos[0], ... res);
		} else {
			this.deletedMessage("setScissorRegion");
		}
	}

	/*******************/
	/* STENCIL TESTING */
	/*******************/

	/**
	 * Enable stencil testing.
	 */
	public enableStencil()
	{
		if (!this._deleted) {
			this._context.gl.enable(this._context.gl.STENCIL_TEST);
		} else {
			this.deletedMessage("enableStencil");
		}
	}

	/**
	 * Disable stencil testing.
	 */
	public disableStencil()
	{
		if (!this._deleted) {
			this._context.gl.disable(this._context.gl.STENCIL_TEST);
		} else {
			this.deletedMessage("disableStencil");
		}
	}

	/**
	 * Clear stencil buffer.
	 */
	public clearStencilBuffer()
	{
		if (!this._deleted) {
			this._context.gl.clear(this._context.gl.DEPTH_BUFFER_BIT);
		} else {
			this.deletedMessage("clearStencilBuffer");
		}
	}

	/**
	 * Set stencil testing function
	 * 
	 * @param func Stencil testing function.
	 * @param ref Reference value.
	 * @param mask Reference value mask.
	 */
	public setStencilFunction(func: StencilFunc, ref: number, mask: number)
	{
		if (!this._deleted) {
			let gl = this._context.gl;
			gl.stencilFunc([
				gl.ALWAYS, gl.NEVER, gl.EQUAL, gl.NOTEQUAL,
				gl.LESS, gl.LEQUAL, gl.GREATER, gl.GEQUAL
			][func], ref, mask);
		} else {
			this.deletedMessage("setStencilFunction");
		}
	}

	/**
	 * Set stencil testing options
	 * 
	 * @param fail Stencil test fail option.
	 * @param zfail Depth test fail option.
	 * @param zpass Depth test pass option.
	 */
	public setStencilOptions(fail: StencilOption, zfail: StencilOption, zpass: StencilOption)
	{
		if (!this._deleted) {
			let gl = this._context.gl;
			let ops = [
				gl.KEEP, gl.ZERO, gl.REPLACE, gl.INCR,
				gl.INCR_WRAP, gl.DECR, gl.DECR_WRAP, gl.INVERT
			];
			gl.stencilOp(ops[fail], ops[zfail], ops[zpass]);
		} else {
			this.deletedMessage("setStencilOptions");
		}
	}

	/**
	 * Set stencil testing mask.
	 * 
	 * @param mask Stencil testing mask.
	 */
	public setStencilMask(mask: number)
	{
		if (!this._deleted) {
			this._context.gl.stencilMask(mask);
		} else {
			this.deletedMessage("setStencilMask");
		}
	}

	/***********/
	/* TEXTURE */
	/***********/
	
	/**
	 * Create texture.
	 * 
	 * @param id Texture ID.
	 * @param size Texture size.
	 */
	public createTexture(id: string, size: Vector2<number> = [1, 1])
	{
		if (!this._deleted) {
			new Texture(id, this._context, size);
		} else {
			this.deletedMessage("createTexture");
		}
	}

	/**
	 * Get texture
	 * 
	 * @param id Texture ID.
	 * @param funcName The name of the function that called this.
	 * @returns The texture.
	 */
	private getTexture(id: string, funcName: string): Texture
	{
		let texture = this._context.textures.get(id);
		if (texture == null) {
			Log.error(`${funcName}: Cannot find "${id}".`);
		}
		return texture;
	}

	/**
	 * Get width of texture.
	 * 
	 * @param id Texture ID.
	 * @returns Width of texture.
	 */
	public getTextureWidth(id: string): number
	{
		if (!this._deleted) {
			let width =  this.getTexture(id, "getTextureWidth")?.width;
			if (width != null) {
				return width;
			}
		} else {
			this.deletedMessage("getTextureWidth");
		}
		return 0;
	}

	/**
	 * Get height of texture.
	 * 
	 * @param id Texture ID.
	 * @returns Height of texture.
	 */
	public getTextureHeight(id: string): number
	{
		if (!this._deleted) {
			let height =  this.getTexture(id, "getTextureHeight")?.height;
			if (height != null) {
				return height;
			}
		} else {
			this.deletedMessage("getTextureHeight");
		}
		return 0;
	}

	/**
	 * Get size of texture.
	 * 
	 * @param id Texture ID.
	 * @returns Size of texture.
	 */
	public getTextureSize(id: string): Vector2<number>
	{
		if (!this._deleted) {
			let size = this.getTexture(id, "getTextureSize")?.size;
			if (size != null) {
				return size;
			}
		} else {
			this.deletedMessage("getTextureSize");
		}
		return [0, 0];
	}

	/**
	 * Get texture's minification filter.
	 * 
	 * @param id Texture ID.
	 * @returns Texture's minification filter.
	 */
	public getTextureMinFilter(id: string): TextureFilter
	{
		if (!this._deleted) {
			let filter = this.getTexture(id, "getTextureMinFilter")?.minFilter;
			if (filter != null) {
				return filter;
			}
		} else {
			this.deletedMessage("getTextureMinFilter");
		}
		return TextureFilter.Linear;
	}

	/**
	 * Set texture's minification filter.
	 * 
	 * @param id Texture ID.
	 * @param filter Filter.
	 */
	public setTextureMinFilter(id: string, filter: TextureFilter)
	{
		if (!this._deleted) {
			let texture = this.getTexture(id, "setTextureMinFilter");
			if (texture != null) {
				texture.minFilter = filter;
			}
		} else {
			this.deletedMessage("setTextureMinFilter");
		}
	}

	/**
	 * Get texture's magnification filter.
	 * 
	 * @param id Texture ID.
	 * @returns Texture's magnification filter.
	 */
	public getTextureMagFilter(id: string): TextureFilter
	{
		if (!this._deleted) {	
			let filter = this.getTexture(id, "getTextureMagFilter")?.magFilter;
			if (filter != null) {
				return filter;
			}
		} else {
			this.deletedMessage("getTextureMagFilter");
		}
		return TextureFilter.Linear;
	}

	/**
	 * Set texture's magnification filter.
	 * 
	 * @param id Texture ID.
	 * @param filter Filter.
	 */
	public setTextureMagFilter(id: string, filter: TextureFilter)
	{
		if (!this._deleted) {
			let texture = this.getTexture(id, "setTextureMagFilter");
			if (texture != null) {
				texture.magFilter = filter;
			}
		} else {
			this.deletedMessage("setTextureMagFilter");
		}
	}

	/**
	 * Get texture's S wrap mode.
	 * 
	 * @param id Texture ID.
	 * @returns Texture's minification filter.
	 */
	public getTextureWrapS(id: string): TextureWrap
	{
		if (!this._deleted) {	
			let mode = this.getTexture(id, "getTextureWrapS")?.wrapS;
			if (mode != null) {
				return mode;
			}
		} else {
			this.deletedMessage("getTextureWrapS");
		}
		return TextureWrap.Repeat;
	}

	/**
	 * Set texture's S wrap mode.
	 * 
	 * @param id Texture ID.
	 * @param mode Wrap mode.
	 */
	public setTextureWrapS(id: string, mode: TextureWrap)
	{
		if (!this._deleted) {
			let texture = this.getTexture(id, "setTextureWrapS");
			if (texture != null) {
				texture.wrapS = mode;
			}
		} else {
			this.deletedMessage("setTextureWrapS");
		}
	}

	/**
	 * Get texture's T wrap mode.
	 * 
	 * @param id Texture ID.
	 * @returns Texture's T wrap mode.
	 */
	public getTextureWrapT(id: string): TextureWrap
	{
		if (!this._deleted) {	
			let mode = this.getTexture(id, "getTextureWrapT")?.wrapT;
			if (mode != null) {
				return mode;
			}
		} else {
			this.deletedMessage("getTextureWrapT");
		}
		return TextureWrap.Repeat;
	}

	/**
	 * Set texture's T wrap mode.
	 * 
	 * @param id Texture ID.
	 * @param mode Wrap mode.
	 */
	public setTextureWrapT(id: string, mode: TextureWrap)
	{
		if (!this._deleted) {
			let texture = this.getTexture(id, "setTextureWrapT");
			if (texture != null) {
				texture.wrapT = mode;
			}
		} else {
			this.deletedMessage("setTextureWrapT");
		}
	}

	/**
	 * Generate blank texture.
	 * 
	 * @param id Texture ID.
	 * @param size Size of blank texture.
	 */
	public genBlankTexture(id: string, size: Vector2<number>)
	{
		if (!this._deleted) {
			let texture = this.getTexture(id, "genBlankTexture");
			if (texture != null) {
				if (texture instanceof RenderTexture) {
					Log.error(`genBlankTexture: Cannot generate blank texture in render texture "${id}".`);
				} else {
					texture.generateBlank(size);
				}
			}
		} else {
			this.deletedMessage("genBlankTexture");
		}
	}

	/**
	 * Load image file into texture.
	 * 
	 * @param id Texture ID.
	 * @param path Path to image file.
	 */
	public loadTextureImageFile(id: string, path: string)
	{
		if (!this._deleted) {
			let texture = this.getTexture(id, "loadTextureImageFile");
			if (texture != null) {
				if (texture instanceof RenderTexture) {
					Log.error(`loadTextureImageFile: Cannot load image file into render texture "${id}".`);
				} else {
					texture.loadImageFile(path);
				}
			}
		} else {
			this.deletedMessage("loadTextureImageFile");
		}
	}

	/**
	 * Load image into texture.
	 * 
	 * @param id Texture ID.
	 * @param image Image to load.
	 */
	public loadTextureImage(id: string, image: HTMLImageElement)
	{
		if (!this._deleted) {
			let texture = this.getTexture(id, "loadTextureImage");
			if (texture != null) {
				if (texture instanceof RenderTexture) {
					Log.error(`loadTextureImage: Cannot load image into render texture "${id}".`);
				} else {
					texture.loadImage(image);
				}
			}
		} else {
			this.deletedMessage("loadTextureImage");
		}
	}

	/**
	 * Load video frame into texture.
	 * 
	 * @param id Texture ID.
	 * @param image Image to load.
	 */
	public loadTextureVideoFrame(id: string, video: HTMLVideoElement)
	{
		if (!this._deleted) {
			let texture = this.getTexture(id, "loadTextureVideoFrame");
			if (texture != null) {
				if (texture instanceof RenderTexture) {
					Log.error(`loadTextureVideoFrame: Cannot load video frame into render texture "${id}".`);
				} else {
					texture.loadVideoFrame(video);
				}
			}
		} else {
			this.deletedMessage("loadTextureVideoFrame");
		}
	}

	/**
	 * Generate mipmaps for texture.
	 * 
	 * @param id Texture ID.
	 */
	public genTextureMipmaps(id: string)
	{
		if (!this._deleted) {
			this.getTexture(id, "genTextureMipmaps")?.generateMipmaps();
		} else {
			this.deletedMessage("genTextureMipmaps");
		}
	}

	/**
	 * Delete texture
	 */
	public deleteTexture(id: string)
	{
		if (!this._deleted) {
			this.getTexture(id, "deleteTexture")?.delete();
		} else {
			this.deletedMessage("deleteTexture");
		}
	}

	/**
	 * Delete all textures
	 */
	public deleteAllTextures()
	{
		if (!this._deleted) {
			this._context.deleteTextures();
		} else {
			this.deletedMessage("deleteAllTextures");
		}
	}

	/******************/
	/* RENDER TEXTURE */
	/******************/

	/**
	 * Create render texture.
	 * 
	 * @param id Render texture ID.
	 * @param size Render texture size.
	 */
	public createRenderTexture(id: string, size: Vector2<number>)
	{
		if (!this._deleted) {
			new RenderTexture(id, this._context, size);
		} else {
			this.deletedMessage("createRenderTexture");
		}
	}

	/**
	 * Bind render texture.
	 * 
	 * @param id Render texture ID.
	 */
	public bindRenderTexture(id: string)
	{
		if (!this._deleted) {
			let renderTexture = this.getTexture(id, "bindRenderTexture");
			if (renderTexture != null) {
				if (renderTexture instanceof RenderTexture) {
					renderTexture.bindFBO();
				} else {
					Log.error(`bindRenderTexture: "${id}" is not a render texture.`);
				}
			}
		} else {
			this.deletedMessage("bindRenderTexture");
		}
	}

	/**
	 * Unbind render texture
	 */
	public unbindRenderTexture()
	{
		if (!this._deleted) {
			this.bindRenderTexture("fbo_devon_webgl");
		} else {
			this.deletedMessage("unbindRenderTexture");
		}
	}

	/**
	 * Resize render texture
	 * 
	 * @param id Render texture ID.
	 * @param size New render texture size.
	 */
	public resizeRenderTexture(id: string, size: Vector2<number>)
	{
		if (!this._deleted) {
			let renderTexture = this.getTexture(id, "resizeRenderTexture");
			if (renderTexture != null) {
				if (renderTexture instanceof RenderTexture) {
					renderTexture.resize(size);
				} else {
					Log.error(`resizeRenderTexture: "${id}" is not a render texture.`);
				}
			}
		} else {
			this.deletedMessage("resizeRenderTexture");
		}
	}

	/**********/
	/* SHADER */
	/**********/

	/**
	 * Create shader
	 * 
	 * @param id Shader ID.
	 * @param vertexCode: The vertex shader code.
	 * @param fragCode: The fragment shader code.
	 */
	public createShader(id: string, vertexCode: string, fragCode: string)
	{
		if (!this._deleted) {
			new Shader(id, this._context, vertexCode, fragCode);
		} else {
			this.deletedMessage("createShader");
		}
	}

	/**
	 * Get shader
	 * 
	 * @param id Shader ID.
	 * @param funcName The name of the function that called this.
	 * @returns The shader.
	 */
	private getShader(id: string, funcName: string): Shader
	{
		let shader = this._context.shaders.get(id);
		if (shader == null) {
			Log.error(`${funcName}: Cannot find "${id}".`);
		}
		return shader;
	}

	/**
	 * Set float value uniform attribute for shader.
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param val Value to set.
	 */
	public setShaderFloat(id: string, name: string, val: number)
	{
		if (!this._deleted) {
			let shader = this.getShader(id, "setShaderFloat");
			shader?.setFloat(name, val);
		} else {
			this.deletedMessage("setShaderFloat");
		}
	}

	/**
	 * Set integer value uniform attribute for shader.
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param val Value to set.
	 */
	public setShaderInt(id: string, name: string, val: number)
	{
		if (!this._deleted) {
			let shader = this.getShader(id, "setShaderInt");
			shader?.setInt(name, val);
		} else {
			this.deletedMessage("setShaderInt");
		}
	}
	
	/**
	 * Set 2-component float array uniform attribute for shader.
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setShaderVec2(id: string, name: string, val: Vector2<number>)
	{
		if (!this._deleted) {
			let shader = this.getShader(id, "setShaderVec2");
			shader?.setVec2(name, val);
		} else {
			this.deletedMessage("setShaderVec2");
		}
	}

	/**
	 * Set 2-component integer array uniform attribute for shader.
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setShaderIVec2(id: string, name: string, val: Vector2<number>)
	{
		if (!this._deleted) {
			let shader = this.getShader(id, "setShaderIVec2");
			shader?.setIVec2(name, val);
		} else {
			this.deletedMessage("setShaderIVec2");
		}
	}
	
	/**
	 * Set 3-component float array uniform attribute for shader.
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setShaderVec3(id: string, name: string, val: Vector3<number>)
	{
		if (!this._deleted) {
			let shader = this.getShader(id, "setShaderVec3");
			shader?.setVec3(name, val);
		} else {
			this.deletedMessage("setShaderVec3");
		}
	}
	
	/**
	 * Set 3-component integer array uniform attribute for shader.
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setShaderIVec3(id: string, name: string, val: Vector3<number>)
	{
		if (!this._deleted) {
			let shader = this.getShader(id, "setShaderIVec3");
			shader?.setIVec3(name, val);
		} else {
			this.deletedMessage("setShaderIVec3");
		}
	}
	
	/**
	 * Set 4-component float array uniform attribute for shader.
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setShaderVec4(id: string, name: string, val: Vector4<number>)
	{
		if (!this._deleted) {
			let shader = this.getShader(id, "setShaderVec4");
			shader?.setVec4(name, val);
		} else {
			this.deletedMessage("setShaderVec4");
		}
	}
	
	/**
	 * Set 4-component integer array uniform attribute for shader.
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setShaderIVec4(id: string, name: string, val: Vector4<number>)
	{
		if (!this._deleted) {
			let shader = this.getShader(id, "setShaderIVec4");
			shader?.setIVec4(name, val);
		} else {
			this.deletedMessage("setShaderIVec4");
		}
	}
	
	/**
	 * Set 2-component matrix uniform attribute for shader.
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setShaderMatrix2(id: string, name: string, val: Matrix2<number>)
	{
		if (!this._deleted) {
			let shader = this.getShader(id, "setShaderMatrix2");
			shader?.setMatrix2(name, val);
		} else {
			this.deletedMessage("setShaderMatrix2");
		}
	}
	
	/**
	 * Set 3-component matrix uniform attribute for shader.
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setShaderMatrix3(id: string, name: string, val: Matrix3<number>)
	{
		if (!this._deleted) {
			let shader = this.getShader(id, "setShaderMatrix3");
			shader?.setMatrix3(name, val);
		} else {
			this.deletedMessage("setShaderMatrix3");
		}
	}
	
	/**
	 * Set 4-component matrix uniform attribute for shader.
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setShaderMatrix4(id: string, name: string, val: Matrix4<number>)
	{
		if (!this._deleted) {
			let shader = this.getShader(id, "setShaderMatrix4");
			shader?.setMatrix4(name, val);
		} else {
			this.deletedMessage("setShaderMatrix4");
		}
	}

	/**
	 * Set texture value uniform attribute
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param texture Texture to set.
	 * @param num Texture number to set.
	 */
	public setShaderTexture(id: string, name: string, textureID: string, num: number)
	{
		if (!this._deleted) {
			let texture = this.getTexture(textureID, "setShaderTexture");
			if (texture != null) {
				this.getShader(id, "setShaderTexture")?.setTexture(name, texture, num);
			}
		} else {
			this.deletedMessage("setShaderTexture");
		}
	}

	/**
	 * Delete shader
	 */
	public deleteShader(id: string)
	{
		if (!this._deleted) {
			this.getShader(id, "deleteShader")?.delete();
		} else {
			this.deletedMessage("deleteShader");
		}
	}

	/**
	 * Delete all shaders
	 */
	public deleteAllShaders()
	{
		if (!this._deleted) {
			this._context.deleteShaders();
		} else {
			this.deletedMessage("deleteAllShaders");
		}
	}

	/********/
	/* MESH */
	/********/

	/**
	 * Create static mesh.
	 * 
	 * @typeParam T Type of vertex.
	 * @param id: Mesh ID.
	 * @param vertices: Vertex data.
	 * @param elements: Elements data.
	 */
	public createStaticMesh<T extends Vertex>(id: string, vertices: Array<T>, elements?: number[])
	{
		if (!this._deleted) {
			let mesh = new Mesh<T>(id, this._context, false);

			mesh.setVertices(vertices, 0);
			if (elements != null) {
				mesh.setElements(elements, 0);
			}

			mesh.createVBO();
			mesh.createEBO();
		} else {
			this.deletedMessage("createStaticMesh");
		}
	}

	/**
	 * Create dynamic mesh.
	 * 
	 * @typeParam T Type of vertex.
	 * @param id: Mesh ID.
	 */
	public createDynamicMesh<T extends Vertex>(id: string)
	{
		if (!this._deleted) {
			new Mesh<T>(id, this._context, true);
		} else {
			this.deletedMessage("createDynamicMesh");
		}
	}

	/**
	 * Get mesh
	 * 
	 * @param id Mesh ID.
	 * @param funcName The name of the function that called this.
	 * @returns The mesh.
	 */
	private getMesh(id: string, funcName: string): Mesh<Vertex>
	{
		let mesh = this._context.meshes.get(id);
		if (mesh == null) {
			Log.error(`${funcName}: Cannot find "${id}".`);
		}
		return mesh;
	}

	/**
	 * Get mesh's vertex data.
	 * 
	 * @typeParam T Type of vertex.
	 * @param id: Mesh ID.
	 * @return Mesh's vertex data.
	 */
	public getMeshVertices<T extends Vertex>(id: string): Array<T>
	{
		if (!this._deleted) {
			let mesh = this.getMesh(id, "getMeshVertices");
			if (mesh != null) {
				return mesh.vertices as Array<T>;
			}
		} else {
			this.deletedMessage("getMeshVertices");
		}
		return new Array<T>(0);
	}

	/**
	 * Get mesh's element data.
	 * 
	 * @param id: Mesh ID.
	 * @return Mesh's element data.
	 */
	public getMeshElements(id: string): number[]
	{
		if (!this._deleted) {	
			let mesh = this.getMesh(id, "getMeshElements");
			if (mesh != null) {
				return mesh.elements;
			}
		} else {
			this.deletedMessage("getMeshElements");
		}
		return new Array<number>(0);
	}

	/**
	 * Set mesh vertex data (for dynamic meshes).
	 * 
	 * @param id: Mesh ID.
	 * @param vertices Vertex data.
	 * @param offset Desination data offset.
	 */
	public setMeshVertices(id: string, vertices: Vertex[], offset: number)
	{
		if (!this._deleted) {
			let mesh = this.getMesh(id, "setMeshVertices");
			if (mesh != null) {
				if (mesh.dynamic) {
					mesh.setVertices(vertices, offset);
				} else {
					Log.error(`setMeshVertices: "${id}" is not a dynamic mesh.`);
				}
			}
		} else {
			this.deletedMessage("setMeshVertices");
		}
	}

	/**
	 * Set mesh element data (for dynamic meshes).
	 * 
	 * @param id: Mesh ID.
	 * @param elements Element data.
	 * @param offset Desination data offset.
	 */
	public setMeshElements(id: string, elements: number[], offset: number)
	{
		if (!this._deleted) {
			let mesh = this.getMesh(id, "setMeshElements");
			if (mesh != null) {
				if (mesh.dynamic) {
					mesh.setElements(elements, offset);
				} else {
					Log.error(`setMeshElements: "${id}" is not a dynamic mesh.`);
				}
			}
		} else {
			this.deletedMessage("setMeshElements");
		}
	}

	/**
	 * Reset mesh vertex data (for dynamic meshes).
	 * 
	 * @param id: Mesh ID.
	 * @param count Number of vertices to reset to.
	 */
	public resetMeshVertices(id: string, count?: number)
	{
		if (!this._deleted) {
			let mesh = this.getMesh(id, "resetMeshVertices");
			if (mesh != null) {
				if (mesh.dynamic) {
					mesh.resetVertices(count);
				} else {
					Log.error(`resetMeshVertices: "${id}" is not a dynamic mesh.`);
				}
			}
		} else {
			this.deletedMessage("resetMeshVertices");
		}
	}

	/**
	 * Reset mesh element data (for dynamic meshes).
	 * 
	 * @param id: Mesh ID.
	 * @param count Number of elements to reset to.
	 */
	public resetMeshElements(id: string, count?: number)
	{
		if (!this._deleted) {
			let mesh = this.getMesh(id, "resetMeshElements");
			if (mesh != null) {
				if (mesh.dynamic) {
					mesh.resetElements(count);
				} else {
					Log.error(`resetMeshElements: "${id}" is not a dynamic mesh.`);
				}
			}
		} else {
			this.deletedMessage("resetMeshElements");
		}
	}

	/**
	 * Flush mesh vertex data (for dynamic meshes).
	 * 
	 * @param id: Mesh ID.
	 */
	public flushMeshVertices(id: string)
	{
		if (!this._deleted) {
			let mesh = this.getMesh(id, "flushMeshVertices");
			if (mesh != null) {
				if (mesh.dynamic) {
					mesh.flushVertices();
				} else {
					Log.error(`flushMeshVertices: "${id}" is not a dynamic mesh.`);
				}
			}
		} else {
			this.deletedMessage("flushMeshVertices");
		}
	}

	/**
	 * Flush mesh element data (for dynamic meshes).
	 * 
	 * @param id: Mesh ID.
	 */
	public flushMeshElements(id: string)
	{
		if (!this._deleted) {
			let mesh = this.getMesh(id, "flushMeshElements");
			if (mesh != null) {
				if (mesh.dynamic) {
					mesh.flushElements();
				} else {
					Log.error(`flushMeshElements: "${id}" is not a dynamic mesh.`);
				}
			}
		} else {
			this.deletedMessage("flushMeshElements");
		}
	}

	/**
	 * Flush mesh data (for dynamic meshes).
	 * 
	 * @param id: Mesh ID.
	 */
	public flushMeshData(id: string)
	{
		if (!this._deleted) {
			let mesh = this.getMesh(id, "flushMeshData");
			if (mesh != null) {
				if (mesh.dynamic) {
					mesh.flushVertices();
					mesh.flushElements();
				} else {
					Log.error(`flushMeshElements: "${id}" is not a dynamic mesh.`);
				}
			}
		} else {
			this.deletedMessage("flushMeshData");
		}
	}

	/**
	 * Draw mesh
	 * 
	 * @param id: Mesh ID.
	 * @param shaderID ID of shader to draw with.
	 */
	public drawMesh(id: string, shaderID: string)
	{
		if (!this._deleted) {
			let shader = this.getShader(shaderID, "drawMesh");
			if (shader != null) {
				this.getMesh(id, "drawMesh")?.draw(shader);
			}
		} else {
			this.deletedMessage("drawMesh");
		}
	}

	/**
	 * Partially draw mesh
	 * 
	 * @param id: Mesh ID.
	 * @param shaderID ID of shader to draw with.
	 * @param offset Mesh data offset.
	 * @param length Mesh data length.
	 */
	public drawMeshPartial(id: string, shaderID: string, offset: number, length: number)
	{
		if (!this._deleted) {
			let shader = this.getShader(shaderID, "drawMeshPartial");
			if (shader != null) {
				this.getMesh(id, "drawMeshPartial")?.drawPartial(shader, offset, length);
			}
		} else {
			this.deletedMessage("drawMeshPartial");
		}
	}
	
	/**
	 * Delete mesh.
	 */
	public deleteMesh(id: string)
	{
		if (!this._deleted) {
			this.getMesh(id, "deleteMesh")?.delete();
		} else {
			this.deletedMessage("deleteMesh");
		}
	}
	
	/**
	 * Delete all meshes.
	 */
	public deleteAllMeshes()
	{
		if (!this._deleted) {
			this._context.deleteMeshes();
		} else {
			this.deletedMessage("deleteAllMeshes");
		}
	}
}