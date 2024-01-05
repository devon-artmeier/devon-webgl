import { BufferUsage } from "./enums";
import { Resource } from "../private/resource";
import { ResourceManager } from "../private/resource-manager"
import { Context } from "./context";
import { ContextCollection } from "../private/context-collection";
import { VertexBuffer } from "./vertex-buffer";

export class ElementBuffer extends Resource
{
	private _data: Uint16Array;
	private _buffer: WebGLBuffer;
	private _created: boolean = false;
	
	get data(): Uint16Array { return this._data; }
	get count(): number { return this._count; }
	get usage(): BufferUsage { return this._usage; }
	
	/**************************/
	/* CLASS OBJECT FUNCTIONS */
	/**************************/
	
	// Constructor
	constructor(context: Context, id: string, manager: ResourceManager,
		private _count: number, private _usage: BufferUsage)
	{
		super(context, id, manager);
		let gl = this._context.gl;
		
		this._buffer = gl.createBuffer();
		this._data = new Uint16Array(this._count);
	}
	
	// Bind
	public bind()
	{
		let gl = this._context.gl;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer);
	}
	
	// Unbind
	public unbind()
	{
		let gl = this._context.gl;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	}
	
	// Set data
	public setData(data: Uint16Array, offset: number)
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
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._data,
				[gl.STATIC_DRAW, gl.DYNAMIC_DRAW, gl.STREAM_DRAW][this._usage]);	
			this._created = true;
		} else {
			// Modify buffer data
			gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, this._data);
		}
		
		this.tempUnbind();
	}
	
	// Draw
	public draw(vbo: VertexBuffer)
	{
		if (vbo != null) {
			let gl = this._context.gl;
			vbo.tempBind();
			vbo.setupAttributes();
			this.tempBind();
			gl.drawElements(gl.TRIANGLES, this._count, gl.UNSIGNED_SHORT, 0);
			vbo.tempUnbind();
			this.tempUnbind();
		}
	}
	
	// Delete
	public delete()
	{
		let gl = this._context.gl;
		this._manager.unbind(this);
		gl.deleteBuffer(this._buffer);
	}
	
	/********************/
	/* STATIC FUNCTIONS */
	/********************/
	
	// Get element buffer
	private static getEBO(contextID: string, eboID: string): ElementBuffer
	{
		return ContextCollection.get(contextID)?.ebos.get(eboID) as ElementBuffer;
	}
	
	// Create
	public static create(contextID: string, eboID: string, count: number, usage: BufferUsage)
	{
		let context = ContextCollection.get(contextID);
		if (context != null) {
			let manager = context.ebos;
			let ebo = new ElementBuffer(context, eboID, manager, count, usage);
			manager.add(eboID, ebo);
		}
	}

	// Bind
	public static bind(contextID: string, eboID: string)
	{
		let context = ContextCollection.get(contextID);
		if (context != null) {
			let manager = context.ebos;
			manager.bind(manager.get(eboID));
		}
	}
	
	// Unbind
	public static unbind(contextID: string)
	{
		let context = ContextCollection.get(contextID);
		if (context != null) {
			context.ebos.unbindCurrent();
		}
	}
	
	// Get element count
	public static getCount(contextID: string, eboID: string): number
	{
		return this.getEBO(contextID, eboID)?.count;
	}
	
	// Get usage
	public static getUsage(contextID: string, eboID: string): BufferUsage
	{
		return this.getEBO(contextID, eboID)?.usage;
	}
	
	// Get data
	public static getData(contextID: string, eboID: string): Uint16Array
	{
		return this.getEBO(contextID, eboID)?.data;
	}
	
	// Set data
	public static setData(contextID: string, eboID: string, data: Uint16Array, offset: number)
	{
		this.getEBO(contextID, eboID)?.setData(data, offset);
	}
	
	// Buffer data
	public static bufferData(contextID: string, eboID: string)
	{
		this.getEBO(contextID, eboID)?.bufferData();
	}
	
	// Draw with vertex buffer
	public static draw(contextID: string, eboID: string, vboID: string)
	{
		let context = ContextCollection.get(contextID);
		if (context != null) {
			let vbo = context.vbos.get(vboID) as VertexBuffer;
			this.getEBO(contextID, eboID)?.draw(vbo);
		}
	}
	
	// Delete
	public static delete(contextID: string, eboID: string)
	{
		ContextCollection.get(contextID)?.ebos.delete(eboID);
	}
	
	// Delete all vertex buffers
	public static clear(contextID: string)
	{
		ContextCollection.get(contextID)?.ebos.clear();
	}
}