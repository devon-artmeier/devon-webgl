import { BufferUsage } from "./enums";
import { Resource } from "../private/resource";
import { ResourceManager } from "../private/resource-manager"
import { Context } from "./context";
import { ContextCollection } from "../private/context-collection";

export class VertexBuffer extends Resource
{
	private _data: Float32Array;
	private _buffer: WebGLBuffer;
	private _stride: number;
	private _attribOffsets: number[] = Array(0);
	private _created: boolean = false;
	
	get data(): Float32Array { return this._data; }
	get vertexCount(): number { return this._vertexCount; }
	get attribCount(): number { return this._attribLengths.length; }
	get attribLengths(): ReadonlyArray<number> { return this._attribLengths; }
	get attribOffsets(): ReadonlyArray<number> { return this._attribOffsets; }
	get stride(): number { return this._stride; }
	get usage(): BufferUsage { return this._usage; }
	
	/**************************/
	/* CLASS OBJECT FUNCTIONS */
	/**************************/
	
	// Constructor
	constructor(context: Context, id: string, manager: ResourceManager, private _vertexCount: number,
		private _attribLengths: number[], private _usage: BufferUsage)
	{
		super(context, id, manager);
		let gl = this._context.gl;

		this._buffer = gl.createBuffer();
		
		this._stride = 0;
		for (const length of this._attribLengths) {
			this._attribOffsets.push(this._stride);
			this._stride += length;
		}
		
		this._data = new Float32Array(this._vertexCount * this._stride);
	}
	
	// Bind
	public bind()
	{
		let gl = this._context.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
	}
	
	// Unbind
	public unbind()
	{
		let gl = this._context.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}
	
	// Set up attributes
	public setupAttributes()
	{
		let gl = this._context.gl;
		for (let i = 0; i < this._attribLengths.length; i++) {
			gl.enableVertexAttribArray(i);
			gl.vertexAttribPointer(i, this._attribLengths[i], gl.FLOAT, false,
				this._stride * 4, this._attribOffsets[i] * 4);
		}
	}
	
	// Set data
	public setData(data: Float32Array, offset: number)
	{
		this._data.set(data, offset);
	}
	
	// Buffer data
	public bufferData()
	{
		let gl = this._context.gl;
		this.tempBind();

		if (!this._created) {
			// Create buffer data
			gl.bufferData(gl.ARRAY_BUFFER, this._data,
				[gl.STATIC_DRAW, gl.DYNAMIC_DRAW, gl.STREAM_DRAW][this._usage]);	
			this._created = true;
		} else {
			// Modify buffer data
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._data);
		}

		this.tempUnbind();
	}
	
	// Draw
	public draw()
	{
		let gl = this._context.gl;
		this.tempBind();
		this.setupAttributes();
		gl.drawArrays(gl.TRIANGLES, 0, this._vertexCount);
		this.tempUnbind();
	}
	
	// Delete
	public delete()
	{
		let gl = this._context.gl;
		this._manager.unbind(this.id);
		gl.deleteBuffer(this._buffer);
	}
	
	/********************/
	/* STATIC FUNCTIONS */
	/********************/
	
	// Get vertex buffer
	private static getVBO(vboID: string): VertexBuffer
	{
		return ContextCollection.getBind()?.vbos.get(vboID) as VertexBuffer;
	}
	
	// Create
	public static create(vboID: string, vertexCount: number,
		attribLengths: number[], usage: BufferUsage)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let manager = context.vbos;
			let vbo = new VertexBuffer(context, vboID, manager, vertexCount, attribLengths, usage);
			manager.add(vboID, vbo);
		}
	}

	// Bind
	public static bind(vboID: string)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let manager = context.vbos;
			manager.bind(vboID);
		}
	}
	
	// Unbind
	public static unbind()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			context.vbos.unbindCurrent();
		}
	}
	
	// Get vertex count
	public static getVertexCount(vboID: string): number
	{
		return this.getVBO(vboID)?.vertexCount;
	}
	
	// Get attribute count
	public static getAttributeCount(vboID: string): number
	{
		return this.getVBO(vboID)?.attribCount;
	}
	
	// Get attribute lengths
	public static getAttributeLengths(vboID: string): ReadonlyArray<number>
	{
		return this.getVBO(vboID)?.attribLengths;
	}
	
	// Get attribute offsets
	public static getAttributeOffset(vboID: string): ReadonlyArray<number>
	{
		return this.getVBO(vboID)?.attribOffsets;
	}
	
	// Get stride
	public static getStride(vboID: string): number
	{
		return this.getVBO(vboID)?.stride;
	}
	
	// Get usage
	public static getUsage(vboID: string): BufferUsage
	{
		return this.getVBO(vboID)?.usage;
	}
	
	// Get data
	public static getData(vboID: string): Float32Array
	{
		return this.getVBO(vboID)?.data;
	}
	
	// Set data
	public static setData(vboID: string, data: Float32Array, offset: number)
	{
		this.getVBO(vboID)?.setData(data, offset);
	}
	
	// Buffer data
	public static bufferData(vboID: string)
	{
		this.getVBO(vboID)?.bufferData();
	}
	
	// Delete
	public static delete(vboID: string)
	{
		ContextCollection.getBind().vbos.delete(vboID);
	}
	
	// Delete all vertex buffers
	public static clear()
	{
		ContextCollection.getBind().vbos.clear();
	}
}