import { Resource } from "../private/resource";
import { Context } from "./context";
import { ContextPool } from "../private/context-pool";
import { Vertex } from "./vertex";

export class Mesh<T extends Vertex> extends Resource
{
	private _vertices = new Array<T>()
	private _elements = new Array<number>()
	private _vao: WebGLVertexArrayObject;
	private _vbo: WebGLBuffer;
	private _ebo: WebGLBuffer;
	private _prevVBOLen: number;
	private _prevEBOLen: number;

	// Return clone of data if static
	get vertices(): Array<T> {
		if (!this._dynamic) return this._vertices.map(x => Object.assign({}, x));
		return this._vertices;
	}
	get elements(): number[] {
		if (!this._dynamic) return this._elements.map(x => Object.assign({}, x));
		return this._elements;
	}
	
	/**************************/
	/* CLASS OBJECT FUNCTIONS */
	/**************************/

	// Constructor
	private constructor(context: Context, id: string, private _dynamic: boolean)
	{
		super(context, id);
		let gl = this._context.gl;

		this._vao = gl.createVertexArray();
	}

	// Create vertex buffer object
	private createVBO()
	{
		if (this._vertices.length > 0) {
			let gl = this._context.gl;

			this._vbo = gl.createBuffer();
			this._context.bindVertexArray(this._vao);

			this._context.bindVertexBuffer(this._vbo);
			gl.bufferData(gl.ARRAY_BUFFER, this.getRawVertexData(),
				this._dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);

			let offset = 0;
			let vertex = this._vertices[0];
			let stride = vertex.getLength();

			for (let i = 0; i < vertex.getAttributeCount(); i++) {
				let attribLen = vertex.getAttributeLength(i);
				gl.enableVertexAttribArray(i);
				gl.vertexAttribPointer(i, attribLen, gl.FLOAT, false, stride * 4, offset * 4);
				offset += attribLen;
			}

			this._context.bindVertexArray(null);
			this._context.bindVertexBuffer(null);
		}
			
		this._prevVBOLen = this._vertices.length;
	}

	// Create element buffer object
	public createEBO()
	{
		if (this._elements.length > 0) {
			let gl = this._context.gl;

			this._ebo = gl.createBuffer();
			this._context.bindVertexArray(this._vao);

			this._context.bindElementBuffer(this._ebo);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.getRawElementData(),
				this._dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);	

			this._context.bindVertexArray(null);
			this._context.bindElementBuffer(null);
		}

		this._prevEBOLen = this._elements.length;
	}

	// Get raw vertex data
	private getRawVertexData(): Float32Array
	{
		if (this._vertices.length == 0) return new Float32Array(0);

		let stride = this._vertices[0].getLength();
		let data = new Float32Array(this._vertices.length * stride);

		for (let i = 0; i < this._vertices.length; i++) {
			data.set(this._vertices[i].getData().flat(), i * stride);
		}
		return data;
	}

	// Get raw element data
	private getRawElementData(): Uint16Array
	{
		return Uint16Array.from(this._elements);
	}

	// Set array of data
	private setData(srcData: any, destData: any, offset: number, init: boolean)
	{
		if (init || this._dynamic) {
			let overwriteLen = srcData.length - Math.max(0,
				(offset + srcData.length) - destData.length);
			let i = 0;
			while (i < overwriteLen) {
				destData[i + offset] = srcData[i];
				i++;
			}
			for (let j = 0; j < srcData.length - overwriteLen; j++) {
				destData.push(srcData[i++]);
			}
		}
	}

	// Set array of vertices
	public setVertexArray(newVertices: T[], offset: number, init: boolean)
	{
		this.setData(newVertices, this._vertices, offset, init);
	}

	// Set array of elements
	public setElementArray(newElements: number[], offset: number, init: boolean)
	{
		this.setData(newElements, this._elements, offset, init);
	}

	// Clear vertices
	public clearVertices(count: number)
	{
		if (this._dynamic) {
			this._vertices = new Array<T>(count);
		}
	}

	// Clear elements
	public clearElements(count: number)
	{
		if (this._dynamic) {
			this._elements = new Array<number>(count);
		}
	}

	// Flush vertices
	private flushVertices()
	{
		if (this._dynamic && this._vbo != null) {
			let gl = this._context.gl;
				
			if (this._elements.length > 0) {
				this._context.bindVertexBuffer(this._vbo);
				let data = this.getRawVertexData();

				if (this._prevVBOLen == this._vertices.length) {
					gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
				} else {
					gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
				}
				
				this._context.bindVertexBuffer(null);
			} else {
				this._context.deleteVertexBuffer(this._vbo);
				this._vbo = null;
			}
		} else {
			this.createVBO();
		}
		
		this._prevVBOLen = this._vertices.length;
	}

	// Flush elements
	public flushElements()
	{
		if (this._dynamic && this._ebo != null) {
			let gl = this._context.gl;

			if (this._elements.length > 0) {
				this._context.bindElementBuffer(this._ebo);
				let data = this.getRawElementData();

				if (this._prevEBOLen == this._elements.length) {
					gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, data);
				} else {
					gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
				}
				
				this._context.bindElementBuffer(null);
			} else {
				this._context.deleteElementBuffer(this._ebo);
				this._ebo = null;
			}
		} else {
			this.createEBO();
		}

		this._prevEBOLen = this._elements.length;
	}

	// Draw
	public draw()
	{
		this.partialDraw(0, this._ebo != null ? this._elements.length : this._vertices.length);
	}

	// Partial draw
	public partialDraw(offset: number, length: number)
	{
		if (this._vbo != null) {
			let gl = this._context.gl;
			this._context.bindVertexArray(this._vao);

			if (this._ebo != null) {
				gl.drawElements(gl.TRIANGLES,  Math.min(length, this._elements.length), gl.UNSIGNED_SHORT, offset);
			} else  {
				gl.drawArrays(gl.TRIANGLES, offset, Math.min(length, this._vertices.length));
			}
			
			this._context.bindVertexArray(null);
		}
	}
	
	// Delete
	public delete()
	{
		this._context.deleteVertexArray(this._vao);
		this._context.deleteVertexBuffer(this._vbo);
		this._context.deleteElementBuffer(this._ebo);
	}
	
	/********************/
	/* STATIC FUNCTIONS */
	/********************/
	
	// Get mesh
	private static getMesh(meshID: string): Mesh<Vertex>
	{
		return ContextPool.bind?.meshes.get(meshID) as Mesh<Vertex>;
	}

	// Create static mesh
	public static createStatic<T extends Vertex>(meshID: string, vertices: Array<T>, elements?: number[])
	{
		let context = ContextPool.bind;
		if (context != null) {
			let mesh = new Mesh<T>(context, meshID, false);
			context.meshes.add(meshID, mesh);

			mesh.setVertexArray(vertices, 0, true);
			if (elements != null) {
				mesh.setElementArray(elements, 0, true);
			}
			mesh.createVBO();
			mesh.createEBO();
		}
	}
	
	// Create dynamic mesh
	public static createDynamic<T extends Vertex>(meshID: string)
	{
		let context = ContextPool.bind;
		if (context != null) {
			let mesh = new Mesh<T>(context, meshID, true);
			context.meshes.add(meshID, mesh);
		}
	}

	// Get vertex data
	public static getVertices<T extends Vertex>(meshID: string): Array<T>
	{
		return this.getMesh(meshID)?.vertices as Array<T>;
	}

	// Get element data
	public static getElements(meshID: string): number[]
	{
		return this.getMesh(meshID)?.elements;
	}

	// Set array of vertices (for dynamic meshes)
	public static setVertexArray(meshID: string, newVertices: Vertex[], offset: number)
	{
		this.getMesh(meshID)?.setVertexArray(newVertices, offset, false);
	}

	// Set array of elements (for dynamic meshes)
	public static setElementArray(meshID: string, newElements: number[], offset: number)
	{
		this.getMesh(meshID)?.setElementArray(newElements, offset, false);
	}

	// Clear vertex data (for dynamic meshes)
	public static clearVertices(meshID: string, count?: number)
	{
		this.getMesh(meshID)?.clearVertices(count);
	}

	// Clear element data (for dynamic meshes)
	public static clearElements(meshID: string, count?: number)
	{
		this.getMesh(meshID)?.clearElements(count);
	}

	// Flush vertex data
	public static flushVertices(meshID: string)
	{
		this.getMesh(meshID)?.flushVertices();
	}

	// Flush element data
	public static flushElements(meshID: string)
	{
		this.getMesh(meshID)?.flushElements();
	}

	// Flush data
	public static flushData(meshID: string)
	{
		let mesh = this.getMesh(meshID);
		if (mesh != null) {
			mesh.flushVertices();
			mesh.flushElements();
		}
	}

	// Draw
	public static draw(meshID: string)
	{
		this.getMesh(meshID)?.draw();
	}

	// Partial draw
	public static partialDraw(meshID: string, offset: number, length: number)
	{
		this.getMesh(meshID)?.partialDraw(offset, length);
	}
	
	// Delete
	public static delete(meshID: string)
	{
		ContextPool.bind?.meshes.delete(meshID);
	}
	
	// Delete all vertex buffers
	public static clear()
	{
		ContextPool.bind?.meshes.clear();
	}
}