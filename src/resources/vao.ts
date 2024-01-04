import { Resource } from "./resource";
import { VBO } from "./vbo";
import { EBO } from "./ebo";

// Vertex array object class
export class VAO implements Resource
{
	private _gl: WebGL2RenderingContext;
	private _object: WebGLVertexArrayObject;
	private _vbo: VBO;
	private _ebo: EBO;
	
	// Constructor
	constructor(gl: WebGL2RenderingContext)
	{
		this._gl = gl;
		this._object = this._gl.createVertexArray();
	}
	
	// Bind
	public bind()
	{
		this._gl.bindVertexArray(this._object);
	}
	
	// Unbind
	public unbind()
	{
		this._gl.bindVertexArray(null);
	}
	
	// Set vertex buffer object
	public setVBO(vbo: VBO)
	{
		this.bind();
		vbo?.bind();
		vbo?.setupAttributes();
		this.unbind();
		vbo?.unbind();
		this._vbo = vbo;
	}
	
	// Set element buffer object
	public setEBO(ebo: EBO)
	{
		this.bind();
		ebo?.bind();
		this.unbind();
		this._ebo = ebo;
	}
	
	// Set buffer objects
	public setBuffers(vbo: VBO, ebo: EBO)
	{
		this.bind();
		vbo?.bind();
		vbo?.setupAttributes();
		ebo?.bind();
		
		this.unbind();
		
		this._vbo = vbo;
		this._ebo = ebo;
	}
	
	// Draw
	public draw()
	{
		this.bind();
		if (this._ebo != null) {
			this._gl.drawElements(this._gl.TRIANGLES, this._ebo.count, this._gl.UNSIGNED_SHORT, 0);
		} else {
			this._gl.drawArrays(this._gl.TRIANGLES, 0, this._vbo.vertexCount);
		}
		this.unbind();
	}
	
	// Delete
	public delete()
	{
		this.unbind();
		this._gl.deleteVertexArray(this._object);
	}
}