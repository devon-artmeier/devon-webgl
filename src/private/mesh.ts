import { Context } from "./context";
import { Shader } from "./shader";
import { Vertex } from "../public/vertex";

/**
 * A class that represents a shader.
 * 
 * @typeParam T Type of vertex
 */
export class Mesh<T extends Vertex>
{
	/** The WebGL vertex array object. */
	private readonly _glVertexArray: WebGLVertexArrayObject;
	
	/** The WebGL vertex buffer object. */
	private _glVertexBuffer: WebGLBuffer;
	
	/** The WebGL element buffer object. */
	private _glElementBuffer: WebGLBuffer;
	
	/** The vertex data. */
	private _vertices = new Array<T>()
	
	/** The element data. */
	private _elements = new Array<number>()
	
	/** The previous vertex data length. */
	private _prevVBOLen: number;
	
	/** The previous element data length. */
	private _prevEBOLen: number;

	/**
	 * Get vertex data.
	 * 
	 * @returns Vertex data.
	 */
	get vertices(): Array<T> {
		if (!this.dynamic) return this._vertices.map(x => Object.assign({}, x));
		return this._vertices;
	}

	/**
	 * Get element data.
	 * 
	 * @returns element data.
	 */
	get elements(): number[] {
		if (!this.dynamic) return this._elements.map(x => Object.assign({}, x));
		return this._elements;
	}

	/**
	 * The constructor of the `Mesh` class.
	 * 
	 * @param id The ID of the shader.
	 * @param _context The WebGL context.
	 * @param dynamic: Dynamic mesh flag.
	 */
	constructor(public readonly id: string, protected readonly _context: Context,
		public readonly dynamic: boolean)
	{
		if (this._context != null) {
			this._context.meshes.get(this.id)?.delete();
			this._context.meshes.set(this.id, this);

			this._glVertexArray = this._context.gl.createVertexArray();
		}
	}

	/**
	 * Create vertex buffer object.
	 */
	public createVBO()
	{
		if (this._vertices.length > 0) {
			let gl = this._context.gl;

			this._glVertexBuffer = gl.createBuffer();
			this._context.bindGLVertexArray(this._glVertexArray);

			this._context.bindGLVertexBuffer(this._glVertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, this.getRawVertexData(),
				this.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);

			let offset = 0;
			let vertex = this._vertices[0];
			let stride = vertex.getLength();

			for (let i = 0; i < vertex.getAttributeCount(); i++) {
				let attribLen = vertex.getAttributeLength(i);
				gl.enableVertexAttribArray(i);
				gl.vertexAttribPointer(i, attribLen, gl.FLOAT, false, stride * 4, offset * 4);
				offset += attribLen;
			}

			this._context.bindGLVertexArray(null);
			this._context.bindGLVertexBuffer(null);
		}
			
		this._prevVBOLen = this._vertices.length;
	}

	/**
	 * Create element buffer object.
	 */
	public createEBO()
	{
		if (this._elements.length > 0) {
			let gl = this._context.gl;

			this._glElementBuffer = gl.createBuffer();
			this._context.bindGLVertexArray(this._glVertexArray);

			this._context.bindGLElementBuffer(this._glElementBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.getRawElementData(),
				this.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);	

			this._context.bindGLVertexArray(null);
			this._context.bindGLElementBuffer(null);
		}

		this._prevEBOLen = this._elements.length;
	}

	/**
	 * Get raw vertex data.
	 * 
	 * @returns Raw vertex data.
	 */
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

	/**
	 * Get raw element data.
	 * 
	 * @returns Raw element data.
	 */
	private getRawElementData(): Uint16Array
	{
		return Uint16Array.from(this._elements);
	}

	/**
	 * Set array of data.
	 * 
	 * @param srcData Source data array.
	 * @param destData Destination data array
	 * @param offset Offset in destination data array.
	 * @param init Initialize flag.
	 */
	private setData(srcData: any, destData: any, offset: number)
	{
		if (offset < 0) offset = 0;

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

	/**
	 * Set vertex data.
	 * 
	 * @param vertices Vertex data.
	 * @param offset Desination data offset.
	 * @param init Initialize flag.
	 */
	public setVertices(vertices: T[], offset: number)
	{
		this.setData(vertices, this._vertices, offset);
	}

	/**
	 * Set element data.
	 * 
	 * @param elements Element data.
	 * @param offset Desination data offset.
	 * @param init Initialize flag.
	 */
	public setElements(elements: number[], offset: number)
	{
		this.setData(elements, this._elements, offset);
	}

	/**
	 * Reset mesh vertex data.
	 * 
	 * @param count Number of vertices to reset to.
	 */
	public resetVertices(count: number)
	{
		this._vertices = new Array<T>(count);
	}

	/**
	 * Reset mesh element data.
	 * 
	 * @param count Number of elements to reset to.
	 */
	public resetElements(count: number)
	{
		this._elements = new Array<number>(count);
	}

	/**
	 * Flush mesh vertex data.
	 */
	public flushVertices()
	{
		if (this._glVertexBuffer != null) {
			let gl = this._context.gl;
				
			if (this._elements.length > 0) {
				this._context.bindGLVertexBuffer(this._glVertexBuffer);
				let data = this.getRawVertexData();

				if (this._prevVBOLen == this._vertices.length) {
					gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
				} else {
					gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
				}
				
				this._context.bindGLVertexBuffer(null);
			} else {
				this._context.deleteGLVertexBuffer(this._glVertexBuffer);
				this._glVertexBuffer = null;
			}
		} else {
			this.createVBO();
		}
		
		this._prevVBOLen = this._vertices.length;
	}

	/**
	 * Flush mesh element data.
	 */
	public flushElements()
	{
		if (this._glElementBuffer != null) {
			let gl = this._context.gl;

			if (this._elements.length > 0) {
				this._context.bindGLElementBuffer(this._glElementBuffer);
				let data = this.getRawElementData();

				if (this._prevEBOLen == this._elements.length) {
					gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, data);
				} else {
					gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
				}
				
				this._context.bindGLElementBuffer(null);
			} else {
				this._context.deleteGLElementBuffer(this._glElementBuffer);
				this._glElementBuffer = null;
			}
		} else {
			this.createEBO();
		}

		this._prevEBOLen = this._elements.length;
	}

	/**
	 * Draw mesh.
	 * 
	 * @param shader Shader to draw with.
	 */
	public draw(shader: Shader)
	{
		this.drawPartial(shader, 0, this._glElementBuffer != null ? this._elements.length : this._vertices.length);
	}

	/**
	 * Partially draw mesh
	 * 
	 * @param shader Shader to draw with.
	 * @param offset Mesh data offset.
	 * @param length Mesh data length.
	 */
	public drawPartial(shader: Shader, offset: number, length: number)
	{
		if (this._glVertexBuffer != null) {
			let gl = this._context.gl;

			shader.bind();
			this._context.bindGLVertexArray(this._glVertexArray);

			if (this._glElementBuffer != null) {
				gl.drawElements(gl.TRIANGLES,  Math.min(length, this._elements.length), gl.UNSIGNED_SHORT, offset);
			} else  {
				gl.drawArrays(gl.TRIANGLES, offset, Math.min(length, this._vertices.length));
			}
			
			this._context.bindGLVertexArray(null);
		}
	}

	/**
	 * Delete mesh.
	 */
	public delete()
	{
		this._context.deleteGLVertexArray(this._glVertexArray);
		this._context.deleteGLVertexBuffer(this._glVertexBuffer);
		this._context.deleteGLElementBuffer(this._glElementBuffer);
		this._context.meshes.delete(this.id);
	}
}