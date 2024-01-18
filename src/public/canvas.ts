import { Context } from "../private/context";
import { BlendFunc, CullFace, FrontFace, DepthFunc, StencilFunc, StencilOption, TextureFilter, TextureWrap } from "./enum";
import { Mesh } from "../private/mesh";
import { RenderTexture } from "../private/render-texture";
import { Shader } from "../private/shader";
import { Texture } from "../private/texture"
import { Vertex } from "./vertex";

/**
 * A class that represents a WebGL canvas.
 */
export class Canvas
{
	/** The WebGL context. */
	private _context: Context;

	/** The container HTML element. */
	private _container: HTMLDivElement;

	/** The canvas HTML element. */
	private _canvas: HTMLCanvasElement;

	/**
	 * The constructor of the `Canvas` class.
	 * 
	 * @param id The ID of the canvas.
	 * @param size: The size of the canvas.
	 */
	constructor(public readonly id: string, size: [number, number])
	{
		this._container = document.createElement("div");
		this._container.id = id;
		this._container.className = "devon-webgl-container";
		this._container.style.width = `${size[0]}px`;
		this._container.style.height = `${size[1]}px`;
		this._container.style.display = `block`;
		this._container.style.zIndex = `-1`;
			
		this._canvas = document.createElement("canvas");
		this._canvas.className = "devon-webgl-canvas";
		this._canvas.style.position = "absolute";
		this._container.appendChild(this._canvas);

		this._context = new Context(this._canvas.getContext("webgl2",
			{ alpha: true, stencil: true, preserveDrawingBuffer: true }));
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
	public setViewport(pos: [number, number], res: [number, number])
	{
		this._context.gl.viewport(... pos, ... res);
	}

	/**
	 * Get viewport of canvas.
	 * 
	 * @returns Viewport of canvas.
	 */
	public getViewport(): [[number, number], [number, number]]
	{
		let viewport = this._context.gl.getParameter(this._context.gl.VIEWPORT)
		return [[viewport[0], viewport[1]], [viewport[2], viewport[3]]];
	}

	/************/
	/* BLENDING */
	/************/

	/**
	 * Enable blending.
	 */
	public enableBlend()
	{
		this._context.gl.enable(this._context.gl.BLEND);
	}

	/**
	 * Disable blending.
	 */
	public disableBlend()
	{
		this._context.gl.disable(this._context.gl.BLEND);
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
		this._context.gl.blendFunc(this.getGLBlendFunc(srcFunc), this.getGLBlendFunc(dstFunc));
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
		this._context.gl.blendFuncSeparate(this.getGLBlendFunc(srcRGB), this.getGLBlendFunc(dstRGB),
			this.getGLBlendFunc(srcAlpha), this.getGLBlendFunc(dstAlpha));
	}

	/***********/
	/* CULLING */
	/***********/
	
	/**
	 * Enable culling.
	 */
	public enableCull()
	{
		this._context.gl.enable(this._context.gl.CULL_FACE);
	}

	/**
	 * Disable culling.
	 */
	public disableCull()
	{
		this._context.gl.disable(this._context.gl.CULL_FACE);
	}

	/**
	 * Set cull face.
	 * 
	 * @param face Cull face.
	 */
	public setCullFace(face: CullFace)
	{
		let gl = this._context.gl;
		gl.cullFace([gl.FRONT, gl.BACK, gl.FRONT_AND_BACK][face]);
	}

	/**
	 * Set front face direction.
	 * 
	 * @param face Front face direction.
	 */
	public setFrontFace(face: FrontFace)
	{
		let gl = this._context.gl;
		gl.frontFace([gl.CW, gl.CCW][face]);
	}

	/*****************/
	/* DEPTH TESTING */
	/*****************/

	/**
	 * Enable depth testing.
	 */
	public enableDepth()
	{
		this._context.gl.enable(this._context.gl.DEPTH_TEST);
	}

	/**
	 * Disable depth testing.
	 */
	public disableDepth()
	{
		this._context.gl.disable(this._context.gl.DEPTH_TEST);
	}

	/**
	 * Clear depth buffer.
	 */
	public clearDepthBuffer()
	{
		this._context.gl.clear(this._context.gl.DEPTH_BUFFER_BIT);
	}

	/**
	 * Set depth testing function
	 * 
	 * @param func Depth testing function.
	 */
	public setDepthFunction(func: DepthFunc)
	{
		let gl = this._context.gl;
		gl.depthFunc([
			gl.ALWAYS, gl.NEVER, gl.EQUAL, gl.NOTEQUAL,
			gl.LESS, gl.LEQUAL, gl.GREATER, gl.GEQUAL
		][func]);
	}

	/**
	 * Enable depth testing mask
	 */
	public enableDepthMask()
	{
		this._context.gl.depthMask(true);
	}

	/**
	 * Disable depth testing mask
	 */
	public disableDepthMask()
	{
		this._context.gl.depthMask(false);
	}

	/*******************/
	/* SCISSOR TESTING */
	/*******************/

	/**
	 * Enable scissor testing.
	 */
	public enableScissor()
	{
		this._context.gl.enable(this._context.gl.SCISSOR_TEST);
	}

	/**
	 * Disable scissor testing.
	 */
	public disableScissor()
	{
		this._context.gl.disable(this._context.gl.SCISSOR_TEST);
	}

	/**
	 * Set scissor testing region.
	 * 
	 * @param pos Position of region.
	 * @param res Resolution of region.
	 */
	public setScissorRegion(pos: [number, number], res: [number, number])
	{
		let viewport = this.getViewport();
		this._context.gl.scissor(pos[0], viewport[1][1] - pos[1] - pos[0], ... res);
	}

	/*******************/
	/* STENCIL TESTING */
	/*******************/

	/**
	 * Enable stencil testing.
	 */
	public enableStencil()
	{
		this._context.gl.enable(this._context.gl.STENCIL_TEST);
	}

	/**
	 * Disable stencil testing.
	 */
	public disableStencil()
	{
		this._context.gl.disable(this._context.gl.STENCIL_TEST);
	}

	/**
	 * Clear stencil buffer.
	 */
	public clearStencilBuffer()
	{
		this._context.gl.clear(this._context.gl.DEPTH_BUFFER_BIT);
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
		let gl = this._context.gl;
		gl.stencilFunc([
			gl.ALWAYS, gl.NEVER, gl.EQUAL, gl.NOTEQUAL,
			gl.LESS, gl.LEQUAL, gl.GREATER, gl.GEQUAL
		][func], ref, mask);
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
		let gl = this._context.gl;
		let ops = [
			gl.KEEP, gl.ZERO, gl.REPLACE, gl.INCR,
			gl.INCR_WRAP, gl.DECR, gl.DECR_WRAP, gl.INVERT
		];
		gl.stencilOp(ops[fail], ops[zfail], ops[zpass]);
	}

	/**
	 * Set stencil testing mask.
	 * 
	 * @param mask Stencil testing mask.
	 */
	public setStencilMask(mask: number)
	{
		this._context.gl.stencilMask(mask);
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
	public createTexture(id: string, size: [number, number] = [1, 1])
	{
		new Texture(id, this._context, size);
	}

	/**
	 * Get width of texture.
	 * 
	 * @param id Texture ID.
	 * @returns Width of texture.
	 */
	public getTextureWidth(id: string): number
	{
		return this._context.textures.get(id)?.width;
	}

	/**
	 * Get height of texture.
	 * 
	 * @param id Texture ID.
	 * @returns Height of texture.
	 */
	public getTextureHeight(id: string): number
	{
		return this._context.textures.get(id)?.height;
	}

	/**
	 * Get size of texture.
	 * 
	 * @param id Texture ID.
	 * @returns Size of texture.
	 */
	public getTextureSize(id: string): [number, number]
	{
		return this._context.textures.get(id)?.size;
	}

	/**
	 * Get texture's minification filter.
	 * 
	 * @param id Texture ID.
	 * @returns Texture's minification filter.
	 */
	public getTextureMinFilter(id: string): TextureFilter
	{
		return this._context.textures.get(id)?.minFilter;
	}

	/**
	 * Set texture's minification filter.
	 * 
	 * @param id Texture ID.
	 * @param filter Filter.
	 */
	public setTextureMinFilter(id: string, filter: TextureFilter)
	{
		let texture = this._context.textures.get(id);
		if (texture != null) {
			texture.minFilter = filter;
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
		return this._context.textures.get(id)?.magFilter;
	}

	/**
	 * Set texture's magnification filter.
	 * 
	 * @param id Texture ID.
	 * @param filter Filter.
	 */
	public setTextureMagFilter(id: string, filter: TextureFilter)
	{
		let texture = this._context.textures.get(id);
		if (texture != null) {
			texture.magFilter = filter;
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
		return this._context.textures.get(id)?.wrapS;
	}

	/**
	 * Set texture's S wrap mode.
	 * 
	 * @param id Texture ID.
	 * @param mode Wrap mode.
	 */
	public setTextureWrapS(id: string, mode: TextureWrap)
	{
		let texture = this._context.textures.get(id);
		if (texture != null) {
			texture.wrapS = mode;
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
		return this._context.textures.get(id)?.wrapT;
	}

	/**
	 * Set texture's T wrap mode.
	 * 
	 * @param id Texture ID.
	 * @param mode Wrap mode.
	 */
	public setTextureWrapT(id: string, mode: TextureWrap)
	{
		let texture = this._context.textures.get(id);
		if (texture != null) {
			texture.wrapT = mode;
		}
	}

	/**
	 * Generate blank texture
	 * 
	 * @param id Texture ID.
	 * @param size Size of blank texture.
	 */
	public genBlankTexture(id: string, size: [number, number])
	{
		this._context.textures.get(id)?.generateBlank(size);	
	}

	/**
	 * Load image file into texture.
	 * 
	 * @param id Texture ID.
	 * @param path Path to image file.
	 */
	public loadTextureImageFile(id: string, path: string)
	{
		this._context.textures.get(id)?.loadImageFile(path);
	}

	/**
	 * Load image into texture.
	 * 
	 * @param id Texture ID.
	 * @param image Image to load.
	 */
	public loadTextureImage(id: string, image: HTMLImageElement)
	{
		this._context.textures.get(id)?.loadImage(image);
	}

	/**
	 * Load video frame into texture.
	 * 
	 * @param id Texture ID.
	 * @param image Image to load.
	 */
	public loadTextureVideoFrame(id: string, video: HTMLVideoElement)
	{
		this._context.textures.get(id)?.loadVideoFrame(video);
	}

	/**
	 * Generate mipmaps for texture.
	 * 
	 * @param id Texture ID.
	 */
	public genTextureMipmaps(id: string)
	{
		this._context.textures.get(id)?.generateMipmaps();
	}

	/**
	 * Delete texture
	 */
	public deleteTexture(id: string)
	{
		this._context.textures.get(id)?.delete();
	}

	/**
	 * Delete all textures
	 */
	public deleteAllTextures()
	{
		this._context.deleteTextures();
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
	public createRenderTexture(id: string, size: [number, number])
	{
		new RenderTexture(id, this._context, size);
	}

	/**
	 * Bind render texture.
	 * 
	 * @param id Render texture ID.
	 */
	public bindRenderTexture(id: string)
	{
		this._context.textures.get(id)?.bindFBO();
	}

	/**
	 * Resize render texture
	 * 
	 * @param id Render texture ID.
	 * @param size New render texture size.
	 */
	public resizeRenderTexture(id: string, size: [number, number])
	{
		this._context.textures.get(id)?.resize(size);
	}

	/**********/
	/* SHADER */
	/**********/

	/**
	 * Create shader
	 * 
	 * @param id Shader ID.
	 * @param vertexCode: The vertex shader code.
	 * @param fragCode: The gragment shader code.
	 */
	public createShader(id: string, vertexCode: string, fragCode: string)
	{
		new Shader(id, this._context, vertexCode, fragCode);
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
		this._context.shaders.get(id)?.setFloat(name, val);
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
		this._context.shaders.get(id)?.setInt(name, val);
	}
	
	/**
	 * Set 2-component float array uniform attribute for shader.
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setShaderVec2(id: string, name: string, val: [number, number])
	{
		this._context.shaders.get(id)?.setVec2(name, val);
	}

	/**
	 * Set 2-component integer array uniform attribute for shader.
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setShaderIVec2(id: string, name: string, val: [number, number])
	{
		this._context.shaders.get(id)?.setIVec2(name, val);
	}
	
	/**
	 * Set 3-component float array uniform attribute for shader.
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setShaderVec3(id: string, name: string, val: [number, number, number])
	{
		this._context.shaders.get(id)?.setVec3(name, val);
	}
	
	/**
	 * Set 3-component integer array uniform attribute for shader.
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setShaderIVec3(id: string, name: string, val: [number, number, number])
	{
		this._context.shaders.get(id)?.setIVec3(name, val);
	}
	
	/**
	 * Set 4-component float array uniform attribute for shader.
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setShaderVec4(id: string, name: string, val: [number, number, number, number])
	{
		this._context.shaders.get(id)?.setVec4(name, val);
	}
	
	/**
	 * Set 4-component integer array uniform attribute for shader.
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setShaderIVec4(id: string, name: string, val: [number, number, number, number])
	{
		this._context.shaders.get(id)?.setIVec4(name, val);
	}
	
	/**
	 * Set 2-component matrix uniform attribute for shader.
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setShaderMatrix2(id: string, name: string, val: [number, number, number, number])
	{
		this._context.shaders.get(id)?.setMatrix2(name, val);
	}
	
	/**
	 * Set 3-component matrix uniform attribute for shader.
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setShaderMatrix3(id: string, name: string, val:
		[number, number, number, number, number, number, number, number, number])
	{
		this._context.shaders.get(id)?.setMatrix3(name, val);
	}
	
	/**
	 * Set 4-component matrix uniform attribute for shader.
	 * 
	 * @param id Shader ID.
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setShaderMatrix4(id: string, name: string, val:
		[number, number, number, number, number, number, number, number,
		 number, number, number, number, number, number, number, number])
	{
		this._context.shaders.get(id)?.setMatrix4(name, val);
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
		let texture = this._context.textures.get(id);
		if (texture != null) {
			this._context.shaders.get(id)?.setTexture(name, texture, num);
		}
	}

	/**
	 * Delete shader
	 */
	public deleteShader(id: string)
	{
		this._context.shaders.get(id)?.delete();
	}

	/**
	 * Delete all shaders
	 */
	public deleteAllShaders()
	{
		this._context.deleteShaders();
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
		let mesh = new Mesh<T>(id, this._context, false);
		mesh.setVertexArray(vertices, 0, true);
		if (elements != null) {
			mesh.setElementArray(elements, 0, true);
		}
		mesh.createVBO();
		mesh.createEBO();
	}

	/**
	 * Create dynamic mesh.
	 * 
	 * @typeParam T Type of vertex.
	 * @param id: Mesh ID.
	 */
	public createDynamicMesh<T extends Vertex>(id: string)
	{
		let mesh = new Mesh<T>(id, this._context, true);
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
		return this._context.meshes.get(id)?.vertices as Array<T>;
	}

	/**
	 * Get mesh's element data.
	 * 
	 * @param id: Mesh ID.
	 * @return Mesh's element data.
	 */
	public getMeshElements(id: string): number[]
	{
		return this._context.meshes.get(id)?.elements;
	}

	/**
	 * Set array of mesh vertices (for dynamic meshes).
	 * 
	 * @param id: Mesh ID.
	 * @param vertices Vertex data.
	 * @param offset Desination data offset.
	 */
	public setVertexArray(id: string, vertices: Vertex[], offset: number)
	{
		this._context.meshes.get(id)?.setVertexArray(vertices, offset, false);
	}

	/**
	 * Set array of mesh elements (for dynamic meshes).
	 * 
	 * @param id: Mesh ID.
	 * @param elements Element data.
	 * @param offset Desination data offset.
	 */
	public setElementArray(id: string, elements: number[], offset: number)
	{
		this._context.meshes.get(id)?.setElementArray(elements, offset, false);
	}

	/**
	 * Reset mesh vertex data (for dynamic meshes).
	 * 
	 * @param id: Mesh ID.
	 * @param count Number of vertices to reset to.
	 */
	public clearVertices(id: string, count?: number)
	{
		this._context.meshes.get(id)?.resetVertices(count);
	}

	/**
	 * Reset mesh element data (for dynamic meshes).
	 * 
	 * @param id: Mesh ID.
	 * @param count Number of elements to reset to.
	 */
	public clearElements(id: string, count?: number)
	{
		this._context.meshes.get(id)?.resetElements(count);
	}

	/**
	 * Flush mesh vertex data.
	 * 
	 * @param id: Mesh ID.
	 */
	public flushVertices(id: string)
	{
		this._context.meshes.get(id)?.flushVertices();
	}

	/**
	 * Flush mesh element data.
	 * 
	 * @param id: Mesh ID.
	 */
	public flushElements(id: string)
	{
		this._context.meshes.get(id)?.flushElements();
	}

	/**
	 * Flush mesh data.
	 * 
	 * @param id: Mesh ID.
	 */
	public flushMeshData(id: string)
	{
		let mesh = this._context.meshes.get(id);
		if (mesh != null) {
			mesh.flushVertices();
			mesh.flushElements();
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
		let shader = this._context.shaders.get(shaderID);
		if (shader != null) {
			this._context.meshes.get(id)?.draw(shader);
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
		let shader = this._context.shaders.get(shaderID);
		if (shader != null) {
			this._context.meshes.get(id)?.drawPartial(shader, offset, length);
		}
	}
	
	/**
	 * Delete mesh.
	 */
	public deleteMesh(id: string)
	{
		this._context.meshes.delete(id);
	}
	
	/**
	 * Delete all meshes.
	 */
	public deleteAllMeshes()
	{
		this._context.deleteMeshes();
	}
}