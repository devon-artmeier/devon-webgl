import { Resource } from "../private/resource";
import { Context } from "./context";
import { ContextCollection } from "../private/context-collection";
import { VertexBuffer } from "./vertex-buffer";
import { ElementBuffer } from "./element-buffer";

export class VertexArray extends Resource
{
	private _object: WebGLVertexArrayObject;
	private _vbo: VertexBuffer;
	private _ebo: ElementBuffer;
	private _tempBind: boolean = false;
	
	/**************************/
	/* CLASS OBJECT FUNCTIONS */
	/**************************/
	
	// Constructor
	constructor(context: Context, id: string)
	{
		super(context, id);
		let gl = this._context.gl;

		this._object = gl.createVertexArray();
	}
	
	// Temporary bind
	private tempBind()
	{
		if (this._context.vaos.bind?.id != this.id) {
			let gl = this._context.gl;
			gl.bindVertexArray(this._object);
			this._tempBind = true;
		}
	}
	
	// Unbind temporary bind
	private tempUnbind()
	{
		if (this._tempBind) {
			VertexArray.rebind(this._context.id);
			this._tempBind = false;
		}
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
		this.tempBind();
		if (this._ebo != null) {
			gl.drawElements(gl.TRIANGLES, this._ebo.count, gl.UNSIGNED_SHORT, 0);
		} else {
			gl.drawArrays(gl.TRIANGLES, 0, this._vbo.vertexCount);
		}
		this.tempUnbind();
	}
	
	// Delete
	public delete()
	{
		let gl = this._context.gl;
		if (this._context.vaos.bind == this) {
			VertexArray.unbind(this._context.id);
		}
		gl.deleteVertexArray(this._object);
	}
	
	/********************/
	/* STATIC FUNCTIONS */
	/********************/
	
	// Get vertex array
	private static getVAO(contextID: string, vaoID: string): VertexArray
	{
		return ContextCollection.get(contextID).vaos.get(vaoID) as VertexArray;
	}
	
	// Create
	public static create(contextID: string, vaoID: string)
	{
		let context = ContextCollection.get(contextID);
		if (context != null) {
			let vao = new VertexArray(context, vaoID);
			ContextCollection.get(contextID).vaos.add(vaoID, vao);
		}
	}

	// Bind
	public static bind(contextID: string, vaoID: string)
	{
		let gl = ContextCollection.get(contextID)?.gl;
		let vao = this.getVAO(contextID, vaoID);
		if (gl != null && vao != null) {
			if (ContextCollection.get(contextID).vaos.bind != vao) {
				gl.bindVertexArray(vao._object);
				ContextCollection.get(contextID).vaos.bind = vao;
			}
		}
	}
	
	// Unbind
	public static unbind(contextID: string)
	{
		let gl = ContextCollection.get(contextID)?.gl;
		if (gl != null && ContextCollection.get(contextID).vaos.bind != null) {
			gl.useProgram(null);
			ContextCollection.get(contextID).vaos.bind = null;
		}
	}
	
	// Rebind
	private static rebind(contextID: string)
	{
		let gl = ContextCollection.get(contextID).gl;
		let vao = ContextCollection.get(contextID)?.vaos.bind as VertexArray;
		if (gl != null && vao != null) {
			gl.bindVertexArray(vao._object);
		}
	}

	// Set vertex buffer
	public static setVertexBuffer(contextID: string, vaoID: string, vboID: string)
	{
		let vbo = ContextCollection.get(contextID).vbos.get(vboID) as VertexBuffer;
		this.getVAO(contextID, vaoID)?.setVertexBuffer(vbo);
	}
	
	// Set element buffer
	public static setElementBuffer(contextID: string, vaoID: string, eboID: string)
	{
		let ebo = ContextCollection.get(contextID).ebos.get(eboID) as ElementBuffer;
		this.getVAO(contextID, vaoID)?.setElementBuffer(ebo);
	}
	
	// Set buffer objects
	public static setBuffers(contextID: string, vaoID: string, vboID: string, eboID: string)
	{
		let vbo = ContextCollection.get(contextID).vbos.get(vboID) as VertexBuffer;
		let ebo = ContextCollection.get(contextID).ebos.get(eboID) as ElementBuffer;
		this.getVAO(contextID, vaoID)?.setBuffers(vbo, ebo);
	}
	
	// Draw with vertex buffer
	public static draw(contextID: string, vaoID: string)
	{
		this.getVAO(contextID, vaoID)?.draw();
	}
	
	// Delete
	public static delete(contextID: string, vaoID: string)
	{
		ContextCollection.get(contextID).vaos.delete(vaoID);
	}
	
	// Delete all vertex buffers
	public static clear(contextID: string)
	{
		ContextCollection.get(contextID).vaos.clear();
	}
}