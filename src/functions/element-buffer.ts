import { Resource } from "../resources/resource";
import { ResourceManager } from "../resources/resource-manager";
import { ContextObject } from "../resources/context";
import { VertexBuffer } from "./vertex-buffer";
import { BufferUsage } from "../types/buffer-enums";

export class ElementBuffer extends Resource
{
	private _data: Uint16Array;
	private _buffer: WebGLBuffer;
	private _created: boolean = false;
	private _tempBind: boolean = false;
	
	get data(): Uint16Array { return this._data; }
	get count(): number { return this._count; }
	get usage(): BufferUsage { return this._usage; }
	
	/**************************/
	/* CLASS OBJECT FUNCTIONS */
	/**************************/
	
	// Constructor
	constructor(context: ContextObject, id: string, private _count: number, private _usage: BufferUsage)
	{
		super(context, id);
		let gl = context.gl;
		
		this._buffer = gl.createBuffer();
		this._data = new Uint16Array(this._count);
	}
	
	// Temporary bind
	private tempBind()
	{
		if (this._context.ebos.bind.id != this.id) {
			let gl = this._context.gl;
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer);
			this._tempBind = true;
		}
	}
	
	// Unbind temporary bind
	private tempUnbind()
	{
		if (this._tempBind) {
			ElementBuffer.rebind(this._context.id);
			this._tempBind = false;
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
		if (this._context.ebos.bind == this) {
			ElementBuffer.unbind(this._context.id);
		}
		gl.deleteBuffer(this._buffer);
		this._buffer = null;
		this._count = 0;
	}
	
	/********************/
	/* STATIC FUNCTIONS */
	/********************/
	
	// Get ElementBuffer
	private static getEBO(contextID: string, eboID: string): ElementBuffer
	{
		return ContextObject.get(contextID).ebos.get(eboID) as ElementBuffer;
	}
	
	// Create
	public static create(contextID: string, eboID: string, count: number, usage: BufferUsage)
	{
		let context = ContextObject.get(contextID);
		if (context != null) {
			let ebo = new ElementBuffer(context, eboID, count, usage);
			ContextObject.get(contextID).ebos.add(eboID, ebo);
		}
	}

	// Bind
	public static bind(contextID: string, eboID: string)
	{
		let gl = ContextObject.get(contextID)?.gl;
		let ebo = this.getEBO(contextID, eboID);
		if (gl != null && ebo != null) {
			if (ContextObject.get(contextID).ebos.bind != ebo) {
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo._buffer);
				ContextObject.get(contextID).ebos.bind = ebo;
			}
		}
	}
	
	// Unbind
	public static unbind(contextID: string)
	{
		let gl = ContextObject.get(contextID)?.gl;
		if (gl != null) {
			gl.useProgram(null);
			ContextObject.get(contextID).ebos.bind = null;
		}
	}
	
	// Rebind
	private static rebind(contextID: string)
	{
		let gl = ContextObject.get(contextID).gl;
		let ebo = ContextObject.get(contextID)?.ebos.bind as ElementBuffer;
		if (gl != null && ebo != null) {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo._buffer);
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
		this.getEBO(contextID, eboID)?.bufferData();
	}
	
	// Delete
	public static delete(contextID: string, eboID: string)
	{
		ContextObject.get(contextID).ebos.delete(eboID);
	}
	
	// Delete all vertex buffers
	public static clear(contextID: string)
	{
		ContextObject.get(contextID).ebos.clear();
	}
}