import { Color } from "./color";
import { Resource } from "./resource";
import { Shader } from "./shader";
import { Texture, TextureFilter, TextureWrap } from "./texture";
import { VertexBuffer, VBOUsage } from "./vertex-buffer";
import { ElementBuffer, EBOUsage } from "./element-buffer";

// WebGL instance
export class WebGLInstance
{
	private _gl: WebGL2RenderingContext;
	
	// Constructor
	constructor(private _canvas: HTMLCanvasElement)
	{
		this._gl = this._canvas.getContext("webgl2");
		this._gl.enable(this._gl.BLEND);
		this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA);
	}
	
	// Set viewport
	public setViewport(x: number, y: number, width: number, height: number)
	{
		this._gl.viewport(x, y, width, height);
	}
	
	// Clear with color
	public clearColor(color: Color)
	{
		this._gl.clearColor(color.r, color.g, color.b, color.a);
		this._gl.clear(this._gl.COLOR_BUFFER_BIT);
	}
	
	/* -------- */
	/* RESOURCE */
	/* -------- */
	
	private _resources = new Map<string, Map<string, Resource>>();
	
	// Create resource pool
	private createResourcePool(poolID: string)
	{
		if (!this._resources.has(poolID)) {
			this._resources.set(poolID, new Map<string, Resource>());
		}
	}
	
	// Add resource to pool
	private addToResourcePool(poolID: string, resourceID: string, resource: Resource)
	{
		this.createResourcePool(poolID);
		let pool = this._resources.get(poolID);
		if (pool.has(resourceID)) {
			pool.get(resourceID).delete();
			pool.delete(resourceID);
		}
		pool.set(resourceID, resource);
	}
	
	// Check if resource pool has a resource
	private checkResource(poolID: string, resourceID: string): boolean
	{
		if (!this._resources.has(poolID)) return false;
		return this._resources.get(poolID).has(resourceID);
	}
	
	// Get resource from pool
	private getResource(poolID: string, resourceID: string): Resource
	{
		if (!this.checkResource(poolID, resourceID)) return null
		return this._resources.get(poolID).get(resourceID);
	}
	
	// Delete resource
	private deleteResource(poolID: string, resourceID: string)
	{
		if (this.checkResource(poolID, resourceID)) {
			let pool = this._resources.get(poolID);
			let resource = pool.get(resourceID);
			resource.delete();
			pool.delete(resourceID);
		}
	}
	
	// Delete resource pool
	private deleteResourcePool(poolID: string)
	{
		if (this._resources.has(poolID)) {
			let pool = this._resources.get(poolID);
			for (const [id, resource] of pool.entries()) {
				resource.delete();
			}
			pool.clear();
		}
		this._resources.delete(poolID);
	}
	
	// Delete all resources
	public deleteAllResources()
	{
		for (const [id, pool] of this._resources.entries()) {
			this.deleteResourcePool(id);
		}
	}
	
	/* ------ */
	/* SHADER */
	/* ------ */
	
	// Create shader
	public createShader(id: string, vertexCode: string, fragCode: string)
	{
		let shader = new Shader(this._gl, vertexCode, fragCode);
		this.addToResourcePool("shaders", id, shader);
	}
	
	// Set 1D float value uniform shader attribute
	public setShaderUniform1f(id: string, name: string, v0: number)
	{
		(this.getResource("shaders", id) as Shader)?.setUniform1f(name, v0);
	}
	
	// Set 1D float array uniform shader attribute
	public setShaderUniform1fv(id: string, name: string, val: Float32Array)
	{
		(this.getResource("shaders", id) as Shader)?.setUniform1fv(name, val);
	}
	
	// Set 1D integer values uniform shader attribute
	public setShaderUniform1i(id: string, name: string, v0: number)
	{
		(this.getResource("shaders", id) as Shader)?.setUniform1i(name, v0);
	}
	
	// Set 1D integer array uniform shader attribute
	public setShaderUniform1iv(id: string, name: string, val: Int32Array)
	{
		(this.getResource("shaders", id) as Shader)?.setUniform1iv(name, val);
	}
	
	// Set 2D float values uniform shader attribute
	public setShaderUniform2f(id: string, name: string, v0: number, v1: number)
	{
		(this.getResource("shaders", id) as Shader)?.setUniform2f(name, v0, v1);
	}
	
	// Set 2D float array uniform shader attribute
	public setShaderUniform2fv(id: string, name: string, val: Float32Array)
	{
		(this.getResource("shaders", id) as Shader)?.setUniform2fv(name, val);
	}
	
	// Set 2D integer values uniform shader attribute
	public setShaderUniform2i(id: string, name: string, v0: number, v1: number)
	{
		(this.getResource("shaders", id) as Shader)?.setUniform2i(name, v0, v1);
	}
	
	// Set 2D integer array uniform shader attribute
	public setShaderUniform2iv(id: string, name: string, val: Int32Array)
	{
		(this.getResource("shaders", id) as Shader)?.setUniform2iv(name, val);
	}
	
	// Set 3D float values uniform shader attribute
	public setShaderUniform3f(id: string, name: string, v0: number, v1: number, v2: number)
	{
		(this.getResource("shaders", id) as Shader)?.setUniform3f(name, v0, v1, v2);
	}
	
	// Set 3D float array uniform shader attribute
	public setShaderUniform3fv(id: string, name: string, val: Float32Array)
	{
		(this.getResource("shaders", id) as Shader)?.setUniform3fv(name, val);
	}
	
	// Set 3D integer values uniform shader attribute
	public setShaderUniform3i(id: string, name: string, v0: number, v1: number, v2: number)
	{
		(this.getResource("shaders", id) as Shader)?.setUniform3i(name, v0, v1, v2);
	}
	
	// Set 3D integer array uniform shader attribute
	public setShaderUniform3iv(id: string, name: string, val: Int32Array)
	{
		(this.getResource("shaders", id) as Shader)?.setUniform3iv(name, val);
	}
	
	// Set 4D float values uniform shader attribute
	public setShaderUniform4f(id: string, name: string, v0: number, v1: number, v2: number, v3: number)
	{
		(this.getResource("shaders", id) as Shader)?.setUniform4f(name, v0, v1, v2, v3);
	}
	
	// Set 4D float array uniform shader attribute
	public setShaderUniform4fv(id: string, name: string, val: Float32Array)
	{
		(this.getResource("shaders", id) as Shader)?.setUniform4fv(name, val);
	}
	
	// Set 4D integer values uniform shader attribute
	public setShaderUniform4i(id: string, name: string, v0: number, v1: number, v2: number, v3: number)
	{
		(this.getResource("shaders", id) as Shader)?.setUniform4i(name, v0, v1, v2, v3);
	}
	
	// Set 4D integer array uniform shader attribute
	public setShaderUniform4iv(id: string, name: string, val: Int32Array)
	{
		(this.getResource("shaders", id) as Shader)?.setUniform4iv(name, val);
	}
	
	// Set 2-component matrix uniform shader attribute
	public setShaderUniformMatrix2fv(id: string, name: string, val: Float32Array)
	{
		(this.getResource("shaders", id) as Shader)?.setUniformMatrix2fv(name, val);
	}
		
	// Set 3-component matrix uniform shader attribute
	public setUniformMatrix3fv(id: string, name: string, val: Float32Array)
	{
		(this.getResource("shaders", id) as Shader)?.setUniformMatrix3fv(name, val);
	}
		
	// Set 4-component matrix uniform shader attribute
	public setUniformMatrix4fv(id: string, name: string, val: Float32Array)
	{
		(this.getResource("shaders", id) as Shader)?.setUniformMatrix4fv(name, val);
	}
	
	// Get shader uniform attribute
	public getShaderUniform(id: string, name: string)
	{
		(this.getResource("shaders", id) as Shader)?.getUniform(name);
	}
		
	// Use shader
	public useShader(id: string)
	{
		(this.getResource("shaders", id) as Shader)?.use();
	}
	
	// Delete shader
	public deleteShader(id: string)
	{
		this.deleteResource("shaders", id);
	}
	
	// Delete all shaders
	public deleteAllShaders()
	{
		this.deleteResourcePool("shaders");
	}
	
	/* ------- */
	/* TEXTURE */
	/* ------- */
	
	// Create texture
	public createTexture(id: string)
	{
		let texture = new Texture(this._gl);
		this.addToResourcePool("textures", id, texture);
	}
	
	// Set texture filter
	public setTextureFilter(id: string, filter: TextureFilter)
	{
		(this.getResource("textures", id) as Texture)?.setFilter(filter);
	}
	
	// Set texture horizontal wrap mode
	public setTextureWrapX(id: string, mode: TextureWrap)
	{
		(this.getResource("textures", id) as Texture)?.setWrapX(mode);
	}
	
	// Set texture vertical wrap mode
	public setTextureWrapY(id: string, mode: TextureWrap)
	{
		(this.getResource("textures", id) as Texture)?.setWrapY(mode);
	}
	
	// Set texture wrap mode
	public setTextureWrap(id: string, modeX: TextureWrap, modeY: TextureWrap)
	{
		(this.getResource("textures", id) as Texture)?.setWrap(modeX, modeY);
	}
	
	// Set active texture
	public setActiveTexture(id: string, num: number)
	{
		(this.getResource("textures", id) as Texture)?.setActive(num);
	}
	
	// Generate texture with color
	public generateTexture(id: string, color: Color)
	{
		(this.getResource("textures", id) as Texture)?.generate(color);
	}
	
	// Load image as texture
	public loadTextureImage(id: string, path: string)
	{
		(this.getResource("textures", id) as Texture)?.loadImage(path);
	}
	
	// Delete texture
	public deleteTexture(id: string)
	{
		this.deleteResource("textures", id);
	}
	
	// Delete all textures
	public deleteAllTextures()
	{
		this.deleteResourcePool("textures");
	}
	
	/* ------------- */
	/* VERTEX BUFFER */
	/* ------------- */
	
	// Create vertex buffer
	public createVBO(id: string, vertexCount: number, attribLengths: number[], usage: VBOUsage)
	{
		let buffer = new VertexBuffer(this._gl, vertexCount, attribLengths, usage);
		this.addToResourcePool("vbos", id, buffer);
	}
	
	// Get vertex buffer vertex count
	public getVBOVertexCount(id: string): number
	{
		return (this.getResource("vbos", id) as VertexBuffer)?.vertexCount;
	}
	
	// Get vertex buffer attribute count
	public getVBOAttribCount(id: string): number
	{
		return (this.getResource("vbos", id) as VertexBuffer)?.attribCount;
	}
	
	// Get vertex buffer attribute lengths
	public getVBOAttribLengths(id: string): ReadonlyArray<number>
	{
		return (this.getResource("vbos", id) as VertexBuffer)?.attribLengths;
	}
	
	// Get vertex buffer attribute offsets
	public getVBOAttribOffsets(id: string): ReadonlyArray<number>
	{
		return (this.getResource("vbos", id) as VertexBuffer)?.attribOffsets;
	}
	
	// Get vertex buffer stride
	public getVBOStride(id: string): number
	{
		return (this.getResource("vbos", id) as VertexBuffer)?.stride;
	}
	
	// Get vertex buffer usage
	public getVBOUsage(id: string): VBOUsage
	{
		return (this.getResource("vbos", id) as VertexBuffer)?.usage;
	}
	
	// Get vertex buffer data
	public getVBOData(id: string): Float32Array
	{
		return (this.getResource("vbos", id) as VertexBuffer)?.data;
	}
	
	// Set vertex buffer data
	public setVBOData(id: string, data: Float32Array, offset: number)
	{
		(this.getResource("vbos", id) as VertexBuffer)?.setData(data, offset);
	}
	
	// Buffer vertex buffer data
	public bufferVBOData(id: string)
	{
		(this.getResource("vbos", id) as VertexBuffer)?.bufferData();
	}
	
	// Draw with vertex buffer
	public drawVBO(id: string)
	{
		(this.getResource("vbos", id) as VertexBuffer)?.draw();
	}
	
	// Delete vertex buffer
	public deleteVBO(id: string)
	{
		this.deleteResource("vbos", id);
	}
	
	// Delete all vertex buffers
	public deleteAllVBOs()
	{
		this.deleteResourcePool("vbos");
	}
	
	/* -------------- */
	/* ELEMENT BUFFER */
	/* -------------- */
	
	// Create element buffer
	public createEBO(id: string, count: number, usage: EBOUsage)
	{
		let buffer = new ElementBuffer(this._gl, count, usage);
		this.addToResourcePool("ebos", id, buffer);
	}
	
	// Set element buffer data
	public setEBOData(id: string, data: Uint16Array, offset: number)
	{
		(this.getResource("ebos", id) as ElementBuffer)?.setData(data, offset);
	}
	
	// Buffer element buffer data
	public bufferEBOData(id: string)
	{
		(this.getResource("ebos", id) as ElementBuffer)?.bufferData();
	}
	
	// Draw with vertex buffer and element buffer
	public drawVBOWithEBO(vboID: string, eboID: string)
	{
		let vbo = this.getResource("vbos", vboID) as VertexBuffer;
		(this.getResource("ebos", eboID) as ElementBuffer)?.draw(vbo);
	}
	
	// Delete element buffer
	public deleteEBO(id: string)
	{
		this.deleteResource("ebos", id);
	}
	
	// Delete all element buffers
	public deleteAllEBOs()
	{
		this.deleteResourcePool("ebos");
	}
}