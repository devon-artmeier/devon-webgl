import { Mesh } from "./mesh";
import { RenderTexture } from "./render-texture";
import { Shader } from "./shader";
import { Texture } from "./texture";
import { Vertex } from "../public/vertex";

/**
 * A class that represents a WebGL context.
 */
export class Context
{
	/** The texture collection. */
	public readonly textures: Map<string, Texture> = new Map<string, Texture>();

	/** The shader collection. */
	public readonly shaders: Map<string, Shader> = new Map<string, Shader>();

	/** The mesh collection. */
	public readonly meshes: Map<string, Mesh<Vertex>> = new Map<string, Mesh<Vertex>>();

	/** The currently bound WebGL texture. */
	public currentTexture: WebGLTexture;

	/** The currently bound WebGL shader. */
	public currentShader: WebGLProgram;

	/** The currently bound WebGL vertex buffer object. */
	public currentVBO: WebGLBuffer;

	/** The currently bound WebGL element buffer object. */
	public currentEBO: WebGLBuffer;

	/** The currently bound WebGL vertex array object. */
	public currentVAO: WebGLVertexArrayObject;

	/** The currently bound WebGL framebuffer object. */
	public currentFBO: WebGLFramebuffer;

	/**
	 * The constructor of the `Context` class.
	 * 
	 * @param gl: The WebGL context.
	 */
	constructor(public readonly gl: WebGL2RenderingContext) { }

	/**
	 * Bind a WebGL texture.
	 * 
	 * @param texture The WebGL texture to bind.
	 */
	public bindGLTexture(texture: WebGLTexture)
	{
		if (this.currentTexture != texture) {
			this.currentTexture = texture;
			this.gl.bindTexture(this.gl.TEXTURE_2D, this.currentTexture);
		}
	}

	/**
	 *  Delete a WebGL texture.
	 * 
	 * @param texture The WebGL texture to delete.
	 */
	public deleteGLTexture(texture: WebGLTexture)
	{
		if (this.currentTexture == texture) {
			this.bindGLTexture(null);
		}
		this.gl.deleteTexture(texture);
	}

	/**
	 * Bind a WebGL shader.
	 * 
	 * @param shader The WebGL shader to bind.
	 */
	public bindGLShader(texture: WebGLProgram)
	{
		if (this.currentShader != texture) {
			this.currentShader = texture;
			this.gl.useProgram(this.currentShader);
		}
	}

	/**
	 *  Delete a WebGL shader.
	 * 
	 * @param shader The WebGL shader to delete.
	 */
	public deleteGLShader(shader: WebGLProgram)
	{
		if (this.currentShader == shader) {
			this.bindGLShader(null);
		}
		this.gl.deleteProgram(shader);
	}

	/**
	 * Bind a WebGL vertex buffer object.
	 * 
	 * @param vbo The WebGL vertex buffer object to bind.
	 */
	public bindGLVertexBuffer(vbo: WebGLBuffer)
	{
		if (this.currentVBO != vbo) {
			this.currentVBO = vbo;
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
		}
	}

	/**
	 *  Delete a WebGL vertex buffer object.
	 * 
	 * @param vbo The WebGL vertex buffer object to delete.
	 */
	public deleteGLVertexBuffer(vbo: WebGLBuffer)
	{
		if (this.currentVBO == vbo) {
			this.bindGLVertexBuffer(null);
		}
		this.gl.deleteBuffer(vbo);
	}

	/**
	 * Bind a WebGL element buffer object.
	 * 
	 * @param ebo The WebGL element buffer object to bind.
	 */
	public bindGLElementBuffer(ebo: WebGLBuffer)
	{
		if (this.currentEBO != ebo) {
			this.currentEBO = ebo;
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ebo);
		}
	}

	/**
	 *  Delete a WebGL element buffer object.
	 * 
	 * @param ebo The WebGL element buffer object to delete.
	 */
	public deleteGLElementBuffer(ebo: WebGLBuffer)
	{
		if (this.currentEBO == ebo) {
			this.bindGLElementBuffer(null);
		}
		this.gl.deleteBuffer(ebo);
	}

	/**
	 * Bind a WebGL vertex array object.
	 * 
	 * @param vao The WebGL vertex array object to bind.
	 */
	public bindGLVertexArray(vao: WebGLVertexArrayObject)
	{
		if (this.currentVAO != vao) {
			this.currentVAO = vao;
			this.gl.bindVertexArray(vao);
		}
	}

	/**
	 *  Delete a WebGL vertex array object.
	 * 
	 * @param vao The WebGL vertex array object to delete.
	 */
	public deleteGLVertexArray(vao: WebGLVertexArrayObject)
	{
		if (this.currentVAO == vao) {
			this.bindGLVertexArray(null);
		}
		this.gl.deleteVertexArray(vao);
	}

	/**
	 * Bind a WebGL framebuffer object.
	 * 
	 * @param fbo The WebGL framebuffer object to bind.
	 */
	public bindGLFramebuffer(fbo: WebGLFramebuffer)
	{
		if (this.currentFBO != fbo) {
			this.currentFBO = fbo;
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbo);
		}
	}

	/**
	 *  Delete a WebGL framebuffer object.
	 * 
	 * @param fbo The WebGL framebuffer object to delete.
	 */
	public deleteGLFramebuffer(fbo: WebGLFramebuffer)
	{
		if (this.currentFBO == fbo) {
			this.bindGLFramebuffer(null);
		}
		this.gl.deleteFramebuffer(fbo);
	}

	/**
	 * Delete all textures.
	 */
	public deleteTextures()
	{
		for (let [id, texture] of this.textures) {
			texture.delete();
		}
		this.textures.clear();
	}

	/**
	 * Delete all shaders.
	 */
	public deleteShaders()
	{
		for (let [id, shader] of this.shaders) {
			shader.delete();
		}
		this.shaders.clear();
	}

	/**
	 * Delete all meshes.
	 */
	public deleteMeshes()
	{
		for (let [id, mesh] of this.meshes) {
			mesh.delete();
		}
		this.meshes.clear();
	}

	/**
	 * Delete context.
	 */
	public delete()
	{
		this.deleteTextures();
		this.deleteShaders();
		this.deleteMeshes();
	}
}