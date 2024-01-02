import { Resource } from "./resource";
import { VertexBuffer } from "./vertex-buffer";

// Vertex buffer usage
export enum EBOUsage
{
	Static,
	Dynamic,
	Stream
}

// Vertex buffer class
export class ElementBuffer extends Resource
{
	private static _curBuffer: WebGLBuffer;
	
	private _data: Uint16Array;
	private _buffer: WebGLBuffer;
	private _created: boolean = false;
	
	get data(): Uint16Array { return this._data; }
	get count(): number { return this._count; }
	get usage(): EBOUsage { return this._usage; }
	
	// Constructor
	constructor(gl: WebGL2RenderingContext, private _count: number, private _usage: EBOUsage)
	{
		super(gl);
		this._buffer = this._gl.createBuffer();
		this._data = new Uint16Array(this._count);
	}
	
	// Bind
	public bind()
	{
		if (this._buffer != null && ElementBuffer._curBuffer != this._buffer) {
			this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._buffer);
			ElementBuffer._curBuffer = this._buffer;
		}
	}
	
	// Set data
	public setData(data: Uint16Array, offset: number)
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
				this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, this._data,
					[this._gl.STATIC_DRAW, this._gl.DYNAMIC_DRAW, this._gl.STREAM_DRAW][this._usage]);	
				this._created = true;
			} else {
				// Modify buffer data
				this._gl.bufferSubData(this._gl.ELEMENT_ARRAY_BUFFER, 0, this._data);
			}
		}
	}
	
	// Draw
	public draw(vbo: VertexBuffer)
	{
		if (this._buffer != null && vbo != null) {
			vbo.bind();
			this.bind();
			this._gl.drawElements(this._gl.TRIANGLES, this._count, this._gl.UNSIGNED_SHORT, 0);
		}
	}
	
	// Delete
	public delete()
	{
		if (ElementBuffer._curBuffer == this._buffer) {
			ElementBuffer._curBuffer = null;
			this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, null);
		}
		if (this._buffer != null) {
			this._gl.deleteBuffer(this._buffer);
		}
		this._buffer = null;
	}
}