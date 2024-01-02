import { Resource } from "./resource";
import { Shader } from "./shader";

// Vertex buffer usage
export enum VertexBufferUsage
{
	Static,
	Dynamic,
	Stream
}

// Vertex buffer class
export class VertexBuffer extends Resource
{
	private static _curBuffer: WebGLBuffer;
	
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
	get usage(): VertexBufferUsage { return this._usage; }
	
	// Constructor
	constructor(gl: WebGL2RenderingContext, private _vertexCount: number,
		private _attribLengths: number[], private _usage: VertexBufferUsage)
	{
		super(gl);
		this._buffer = this._gl.createBuffer();
		this.bind();
					
		this._stride = 0;
		for (const length of this._attribLengths) {
			this._attribOffsets.push(this._stride);
			this._stride += length;
		}
		
		for (let i = 0; i < this._attribLengths.length; i++) {
			this._gl.enableVertexAttribArray(i);
			this._gl.vertexAttribPointer(i, this._attribLengths[i], this._gl.FLOAT, false,
				this._stride * 4, this._attribOffsets[i] * 4);
		}
		
		this._data = new Float32Array(this._vertexCount * this._stride);
	}
	
	// Bind
	public bind()
	{
		if (this._buffer != null && VertexBuffer._curBuffer != this._buffer) {
			this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffer);
			VertexBuffer._curBuffer = this._buffer;
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
		if (this._buffer != null) {
			this.bind();
			if (!this._created) {
				// Create buffer data
				this._gl.bufferData(this._gl.ARRAY_BUFFER, this._data,
					[this._gl.STATIC_DRAW, this._gl.DYNAMIC_DRAW, this._gl.STREAM_DRAW][this._usage]);	
				this._created = true;
			} else {
				// Modify buffer data
				this._gl.bufferSubData(this._gl.ARRAY_BUFFER, 0, this._data);
			}
		}
	}
	
	// Draw
	public draw()
	{
		if (this._buffer != null) {
			this.bind();
			this._gl.drawArrays(this._gl.TRIANGLES, 0, this._vertexCount);
		}
	}
	
	// Delete
	public delete()
	{
		if (VertexBuffer._curBuffer == this._buffer) {
			VertexBuffer._curBuffer = null;
			this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
		}
		if (this._buffer != null) {
			this._gl.deleteBuffer(this._buffer);
		}
		this._buffer = null;
	}
}