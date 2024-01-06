import { Resource } from "../private/resource";
import { ResourceManager } from "../private/resource-manager"
import { Context } from "./context";
import { ContextCollection } from "../private/context-collection";
import { VertexBuffer } from "./vertex-buffer";
import { ElementBuffer } from "./element-buffer";

export class VertexArray extends Resource
{
	private _object: WebGLVertexArrayObject;
	private _vbo: VertexBuffer;
	private _ebo: ElementBuffer;
	
	/**************************/
	/* CLASS OBJECT FUNCTIONS */
	/**************************/
	
	// Constructor
	constructor(context: Context, id: string, manager: ResourceManager)
	{
		super(context, id, manager);
		let gl = this._context.gl;
		
		this._object = gl.createVertexArray();
	}
	
	// Bind
	public bind()
	{
		let gl = this._context.gl;
		gl.bindVertexArray(this._object);
	}
	
	// Unbind
	public unbind()
	{
		let gl = this._context.gl;
		gl.bindVertexArray(null);
	}
	
	// Set vertex buffer object
	public setVertexBuffer(vbo: VertexBuffer)
	{
		if (vbo != null) {
			this.tempBind();
			vbo.tempBind();
			vbo.setupAttributes();
			this.tempUnbind();
			vbo.tempUnbind();
			this._vbo = vbo;
		}
	}
	
	// Set element buffer object
	public setElementBuffer(ebo: ElementBuffer)
	{
		if (ebo != null) {
			this.tempBind();
			ebo.tempBind();
			this.tempUnbind();
			ebo.tempUnbind();
			this._ebo = ebo;
		}
	}
	
	// Set buffer objects
	public setBuffers(vbo: VertexBuffer, ebo: ElementBuffer)
	{
		this.tempBind();
		vbo?.tempBind();
		vbo?.setupAttributes();
		ebo?.tempBind();
		this.tempUnbind();
		vbo?.tempUnbind();
		ebo?.tempUnbind();
		
		this._vbo = vbo;
		this._ebo = ebo;
	}
	
	// Draw
	public draw()
	{
		let gl = this._context.gl;
		if (this._vbo != null) {
			this.tempBind();
			if (this._ebo != null) {
				gl.drawElements(gl.TRIANGLES, this._ebo.count, gl.UNSIGNED_SHORT, 0);
			} else  {
				gl.drawArrays(gl.TRIANGLES, 0, this._vbo.vertexCount);
			}
			this.tempUnbind();
		}
	}
	
	// Delete
	public delete()
	{
		let gl = this._context.gl;
		this._manager.unbind(this.id);
		gl.deleteVertexArray(this._object);
	}
	
	/********************/
	/* STATIC FUNCTIONS */
	/********************/
	
	// Get vertex array
	private static getVAO(vaoID: string): VertexArray
	{
		return ContextCollection.getBind()?.vaos.get(vaoID) as VertexArray;
	}
	
	// Create
	public static create(vaoID: string)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let manager = context.vaos;
			let vao = new VertexArray(context, vaoID, manager);
			manager.add(vaoID, vao);
		}
	}

	// Bind
	public static bind(vaoID: string)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let manager = context.vaos;
			manager.bind(vaoID);
		}
	}
	
	// Unbind
	public static unbind()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			context.vaos.unbindCurrent();
		}
	}

	// Set vertex buffer
	public static setVertexBuffer(vaoID: string, vboID: string)
	{
		let vbo = ContextCollection.getBind()?.vbos.get(vboID) as VertexBuffer;
		this.getVAO(vaoID)?.setVertexBuffer(vbo);
	}
	
	// Set element buffer
	public static setElementBuffer(vaoID: string, eboID: string)
	{
		let ebo = ContextCollection.getBind()?.ebos.get(eboID) as ElementBuffer;
		this.getVAO(vaoID)?.setElementBuffer(ebo);
	}
	
	// Set buffer objects
	public static setBuffers(vaoID: string, vboID: string, eboID: string)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let vbo = context.vbos.get(vboID) as VertexBuffer;
			let ebo = context.ebos.get(eboID) as ElementBuffer;
			this.getVAO(vaoID)?.setBuffers(vbo, ebo);
		}
	}
	
	// Draw with vertex buffer
	public static draw(vaoID: string)
	{
		this.getVAO(vaoID)?.draw();
	}
	
	// Delete
	public static delete(vaoID: string)
	{
		ContextCollection.getBind()?.vaos.delete(vaoID);
	}
	
	// Delete all vertex buffers
	public static clear()
	{
		ContextCollection.getBind()?.vaos.clear();
	}
}