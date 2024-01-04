import { Color } from "./color";
import { Resource } from "./resource";
import { Shader } from "./shader";
import { Texture, TextureFilter, TextureWrap } from "./texture";
import { VBO, VBOUsage } from "./vbo";
import { EBO, EBOUsage } from "./ebo";
import { VAO } from "./vao";
import { FBO } from "./fbo";
import { Matrix } from "./matrix";
import { Vector3 } from "./vector";

// Depth function
export enum DepthFunction
{
	Always,
	Never,
	Equal,
	NotEqual,
	Less,
	LessEqual,
	Greater,
	GreaterEqual
}

// Stencil function
export enum StencilFunction
{
	Always,
	Never,
	Equal,
	NotEqual,
	Less,
	LessEqual,
	Greater,
	GreaterEqual
}

// Stencil action option
export enum StencilOption
{
	Keep,
	Zero,
	Replace,
	Increase,
	IncreaseWrap,
	Decrease,
	DecreaseWrap,
	Invert
}

// WebGL instance
export class WebGLInstance
{
	private _gl: WebGL2RenderingContext;
	
	// Constructor
	constructor(private _canvas: HTMLCanvasElement)
	{
		this._gl = this._canvas.getContext("webgl2",
			{ alpha: true, stencil: true });
		this._gl.enable(this._gl.BLEND);
		this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA);
		this._gl.enable(this._gl.DEPTH_TEST); 
		this._gl.depthFunc(this._gl.LESS);
		this._gl.depthMask(true); 
	}
	
	/* ------ */
	/* SCREEN */
	/* ------ */
	
	// Set viewport
	public setViewport(x: number, y: number, width: number, height: number)
	{
		this._gl.viewport(x, y, width, height);
	}
	
	// Get viewport
	public getViewport(): number[]
	{
		return this._gl.getParameter(this._gl.VIEWPORT);
	}
	
	// Clear screen
	public clearScreen(color: Color)
	{
		this._gl.clearColor(color.r, color.g, color.b, color.a);
		this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT | this._gl.STENCIL_BUFFER_BIT);
	}
	
	/* -------- */
	/* BLENDING */
	/* -------- */

	// Enable blending
	public enableBlend()
	{
		this._gl.enable(this._gl.BLEND);
	}

	// Disable blending
	public disableBlend()
	{
		this._gl.disable(this._gl.BLEND);
	}
	
	/* ---------- */
	/* DEPTH TEST */
	/* ---------- */
	
	// Enable depth testing
	public enableDepthTest()
	{
		this._gl.enable(this._gl.DEPTH_TEST); 
	}
	
	// Disable depth testing
	public disableDepthTest()
	{
		this._gl.disable(this._gl.DEPTH_TEST); 
	}

	// Set depth function
	public setDepthFunction(func: DepthFunction)
	{
		this._gl.depthFunc([
			this._gl.ALWAYS, this._gl.NEVER, this._gl.EQUAL, this._gl.NOTEQUAL,
			this._gl.LESS, this._gl.LEQUAL, this._gl.GREATER, this._gl.GEQUAL
		][func]);
	}
	
	// Set depth mask
	public setDepthMask(enable: boolean)
	{
		this._gl.depthMask(enable); 
	}
	
	/* ------------ */
	/* STENCIL TEST */
	/* ------------ */
	
	// Enable stencil testing
	public enableStencilTest()
	{
		this._gl.enable(this._gl.STENCIL_TEST); 
	}
	
	// Disable stencil testing
	public disableStencilTest()
	{
		this._gl.disable(this._gl.STENCIL_TEST); 
	}

	// Set stencil function
	public setStencilFunction(func: StencilFunction, ref: number, mask: number)
	{
		this._gl.stencilFunc([
			this._gl.ALWAYS, this._gl.NEVER, this._gl.EQUAL, this._gl.NOTEQUAL,
			this._gl.LESS, this._gl.LEQUAL, this._gl.GREATER, this._gl.GEQUAL
		][func], ref, mask);
	}

	// Set stencil options
	public setStencilOptions(sfail: StencilOption, dpfail: StencilOption, dppass: StencilOption)
	{
		let ops = [
			this._gl.KEEP, this._gl.ZERO, this._gl.REPLACE, this._gl.INCR,
			this._gl.INCR_WRAP, this._gl.DECR, this._gl.DECR_WRAP, this._gl.INVERT
		];
		this._gl.stencilOp(ops[sfail], ops[dpfail], ops[dppass]);
	}
	
	// Set stencil mask
	public setStencilMask(mask: number)
	{
		this._gl.stencilMask(mask); 
	}
	
	/* ---- */
	/* MATH */
	/* ---- */
	
	// Convert degrees to radians
	public degToRad(angle: number): number
	{
		return angle * (Math.PI / 180);
	}
	
	// Convert radians to degrees
	public radToDeg(angle: number): number
	{
		return angle * (180 / Math.PI);
	}
	
	// Generate orthographic projection matrix 
	public orthoMatrix(l: number, r: number, t: number, b: number, n: number, f: number): Matrix
	{
		return new Matrix([
			[2/(r-l), 0, 0, 0],
			[0, 2/(t-b), 0, 0],
			[0, 0, -2/(f-n), 0],
			[-(r+l)/(r-l), -(t+b)/(t-b), 0, 1]]);
	}
	
	// Generate perspective projection matrix
	public perspectiveMatrix(fov: number, w: number, h: number, n: number, f: number): Matrix
	{
		let ft = Math.tan(this.degToRad(fov)/2);
		return new Matrix([
			[1/((w/h)*ft), 0, 0, 0],
			[0, 1/ft, 0, 0],
			[0, 0, -(f+n)/(f-n), -1],
			[0, 0, -(2*f*n)/(f-n), 0]]);
	}
	
	// Generate "look at" view matrix
	public lookAtMatrix(eye: Vector3, at: Vector3, up: Vector3)
	{
		let z = eye.subtractVector(at).normalize();
		let x = up.cross(z).normalize();
		let	y = z.cross(x);
	
		return new Matrix([
			[x.v[0], x.v[1], x.v[2], 0],
			[y.v[0], y.v[1], y.v[2], 0],
			[z.v[0], z.v[1], z.v[2], 0],
			[-x.dot(eye), -y.dot(eye), -z.dot(eye), 1]
		]);
	}
	
	// Generate translation matrix
	public translateMatrix(x: number, y: number, z: number): Matrix
	{
		return new Matrix([
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[x, y, z, 1],
		]);
	}
	
	// Generate 2D translation matrix
	public translate2DMatrix(x: number, y: number)
	{
		return this.translateMatrix(x, y, 0);	
	}
	
	// Generate X rotation matrix
	public rotateXMatrix(angle: number): Matrix
	{
		let s = Math.sin(angle);
		let c = Math.cos(angle);
	
		return new Matrix([
			[1,  0,  0,  0],
			[0,  c,  s,  0],
			[0, -s,  c,  0],
			[0,  0,  0,  1],
		]);
	}
	
	// Generate Y rotation matrix
	public rotateYMatrix(angle: number): Matrix
	{
		let s = Math.sin(angle);
		let c = Math.cos(angle);
	
		return new Matrix([
			[c,  0, -s,  0],
			[0,  1,  0,  0],
			[s,  0,  c,  0],
			[0,  0,  0,  1],
		]);
	}
	
	// Generate Z rotation matrix
	public rotateZMatrix(angle: number): Matrix
	{
		let s = Math.sin(angle);
		let c = Math.cos(angle);
	
		return new Matrix([
			[ c,  s,  0,  0],
			[-s,  c,  0,  0],
			[ 0,  0,  1,  0],
			[ 0,  0,  0,  1],
		]);
	}
	
	// Generate rotation matrix
	public rotateMatrix(x: number, y: number, z: number): Matrix
	{
		return this.rotateZMatrix(z).multiply(this.rotateYMatrix(y).multiply(this.rotateXMatrix(x)));
	}
	
	// Generate 2D rotation matrix
	public rotate2DMatrix(angle: number)
	{
		return this.rotateZMatrix(angle);	
	}
	
	// Generate scale matrix
	public scaleMatrix(x: number, y: number, z: number)
	{
		return new Matrix([
			[x, 0, 0, 0],
			[0, y, 0, 0],
			[0, 0, z, 0],
			[0, 0, 0, 1],
		]);
	}
	
	// Generate X scale matrix
	public scaleXMatrix(x: number)
	{
		return this.scaleMatrix(x, 1, 1);
	}
	
	// Generate Y scale matrix
	public scaleYMatrix(y: number)
	{
		return this.scaleMatrix(1, y, 1);
	}
	
	// Generate Z scale matrix
	public scaleZMatrix(z: number)
	{
		return this.scaleMatrix(1, 1, z);
	}
	
	// Generate 2D scale matrix
	public scale2DMatrix(x: number, y: number)
	{
		return this.scaleMatrix(x, y, 1);	
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
	
	// Use shader
	public useShader(id: string)
	{
		(this.getResource("shaders", id) as Shader)?.use();
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
	public setShaderUniformMatrix3fv(id: string, name: string, val: Float32Array)
	{
		(this.getResource("shaders", id) as Shader)?.setUniformMatrix3fv(name, val);
	}
	
	// Set 4-component matrix uniform shader attribute
	public setShaderUniformMatrix4fv(id: string, name: string, val: Float32Array)
	{
		(this.getResource("shaders", id) as Shader)?.setUniformMatrix4fv(name, val);
	}
	
	// Get shader uniform attribute
	public getShaderUniform(id: string, name: string)
	{
		(this.getResource("shaders", id) as Shader)?.getUniform(name);
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
	
	/* -------------------- */
	/* VERTEX BUFFER OBJECT */
	/* -------------------- */
	
	// Create vertex buffer object
	public createVBO(id: string, vertexCount: number, attribLengths: number[], usage: VBOUsage)
	{
		let buffer = new VBO(this._gl, vertexCount, attribLengths, usage);
		this.addToResourcePool("vbos", id, buffer);
	}
	
	// Get vertex buffer object vertex count
	public getVBOVertexCount(id: string): number
	{
		return (this.getResource("vbos", id) as VBO)?.vertexCount;
	}
	
	// Get vertex buffer object attribute count
	public getVBOAttribCount(id: string): number
	{
		return (this.getResource("vbos", id) as VBO)?.attribCount;
	}
	
	// Get vertex buffer object attribute lengths
	public getVBOAttribLengths(id: string): ReadonlyArray<number>
	{
		return (this.getResource("vbos", id) as VBO)?.attribLengths;
	}
	
	// Get vertex buffer object attribute offsets
	public getVBOAttribOffsets(id: string): ReadonlyArray<number>
	{
		return (this.getResource("vbos", id) as VBO)?.attribOffsets;
	}
	
	// Get vertex buffer object stride
	public getVBOStride(id: string): number
	{
		return (this.getResource("vbos", id) as VBO)?.stride;
	}
	
	// Get vertex buffer object usage
	public getVBOUsage(id: string): VBOUsage
	{
		return (this.getResource("vbos", id) as VBO)?.usage;
	}
	
	// Get vertex buffer object data
	public getVBOData(id: string): Float32Array
	{
		return (this.getResource("vbos", id) as VBO)?.data;
	}
	
	// Set vertex buffer object data
	public setVBOData(id: string, data: Float32Array, offset: number)
	{
		(this.getResource("vbos", id) as VBO)?.setData(data, offset);
	}
	
	// Buffer vertex buffer object data
	public bufferVBOData(id: string)
	{
		(this.getResource("vbos", id) as VBO)?.bufferData();
	}
	
	// Draw with vertex buffer object
	public drawVBO(id: string)
	{
		(this.getResource("vbos", id) as VBO)?.draw();
	}
	
	// Delete vertex buffer object
	public deleteVBO(id: string)
	{
		this.deleteResource("vbos", id);
	}
	
	// Delete all vertex buffer objects
	public deleteAllVBOs()
	{
		this.deleteResourcePool("vbos");
	}
	
	/* --------------------- */
	/* ELEMENT BUFFER OBJECT */
	/* --------------------- */
	
	// Create element buffer object
	public createEBO(id: string, count: number, usage: EBOUsage)
	{
		let buffer = new EBO(this._gl, count, usage);
		this.addToResourcePool("ebos", id, buffer);
	}
	
	// Set element buffer object data
	public setEBOData(id: string, data: Uint16Array, offset: number)
	{
		(this.getResource("ebos", id) as EBO)?.setData(data, offset);
	}
	
	// Buffer element buffer object data
	public bufferEBOData(id: string)
	{
		(this.getResource("ebos", id) as EBO)?.bufferData();
	}
	
	// Draw with vertex buffer object and element buffer object
	public drawVBOWithEBO(vboID: string, eboID: string)
	{
		let vbo = this.getResource("vbos", vboID) as VBO;
		(this.getResource("ebos", eboID) as EBO)?.draw(vbo);
	}
	
	// Delete element buffer object
	public deleteEBO(id: string)
	{
		this.deleteResource("ebos", id);
	}
	
	// Delete all element buffer objects
	public deleteAllEBOs()
	{
		this.deleteResourcePool("ebos");
	}
	
	/* ------------------- */
	/* VERTEX ARRAY OBJECT */
	/* ------------------- */
	
	// Create vertex array object
	public createVAO(id: string)
	{
		let object = new VAO(this._gl);
		this.addToResourcePool("vaos", id, object);
	}
	
	// Set vertex array object's vertex buffer
	public setVBOForVAO(vaoID: string, vboID: string)
	{
		let vbo = this.getResource("vbos", vboID) as VBO;
		(this.getResource("vaos", vaoID) as VAO)?.setVBO(vbo);
	}
	
	// Set vertex array object's element buffer
	public setEBOForVAO(vaoID: string, eboID: string)
	{
		let ebo = this.getResource("ebos", eboID) as EBO;
		(this.getResource("vaos", vaoID) as VAO)?.setEBO(ebo);
	}
	
	// Set vertex array object's buffer objects
	public setVAOBuffers(vaoID: string, vboID: string, eboID: string)
	{
		let vbo = this.getResource("vbos", vboID) as VBO;
		let ebo = this.getResource("ebos", eboID) as EBO;
		(this.getResource("vaos", vaoID) as VAO)?.setBuffers(vbo, ebo);
	}
	
	// Draw with vertex array object
	public drawVAO(id: string)
	{
		(this.getResource("vaos", id) as VAO)?.draw();
	}
	
	// Delete vertex array object
	public deleteVAO(id: string)
	{
		this.deleteResource("vaos", id);
	}
	
	// Delete all vertex array objects
	public deleteAllVAOs()
	{
		this.deleteResourcePool("vaos");
	}
	
	/* ------------------ */
	/* FRAMEBUFFER OBJECT */
	/* ------------------ */
	
	// Create framebuffer object
	public createFBO(id: string, width: number, height: number)
	{
		let buffer = new FBO(this._gl, width, height);
		this.addToResourcePool("fbos", id, buffer);
	}
	
	// Bind framebuffer object
	public bindFBO(id: string)
	{
		(this.getResource("fbos", id) as FBO)?.bindFBO();
	}
	
	// Unbind framebuffer object
	public unbindFBO()
	{
		FBO.unbindFBO(this._gl);
	}
	
	// Resize framebuffer object texture
	public resizeFBO(id: string, width: number, height: number)
	{
		(this.getResource("fbos", id) as FBO)?.resize(width, height);
	}
	
	// Set framebuffer object filter
	public setFBOFilter(id: string, filter: TextureFilter)
	{
		(this.getResource("fbos", id) as FBO)?.setFilter(filter);
	}
	
	// Set framebuffer object horizontal wrap mode
	public setFBOWrapX(id: string, mode: TextureWrap)
	{
		(this.getResource("fbos", id) as FBO)?.setWrapX(mode);
	}
	
	// Set framebuffer object vertical wrap mode
	public setFBOWrapY(id: string, mode: TextureWrap)
	{
		(this.getResource("fbos", id) as FBO)?.setWrapY(mode);
	}
	
	// Set framebuffer object wrap mode
	public setFBOWrap(id: string, modeX: TextureWrap, modeY: TextureWrap)
	{
		(this.getResource("fbos", id) as FBO)?.setWrap(modeX, modeY);
	}
	
	// Set active texture from framebuffer object
	public setActiveTextureFBO(id: string, num: number)
	{
		(this.getResource("fbos", id) as FBO)?.setActive(num);
	}
	
	// Delete framebuffer object
	public deleteFBO(id: string)
	{
		this.deleteResource("fbos", id);
	}
	
	// Delete all framebuffer objects
	public deleteAllFBOs()
	{
		this.deleteResourcePool("fbos");
	}
}