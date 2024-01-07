import { Matrix2, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from "./tuples";
import { Resource } from "../private/resource";
import { Context } from "./context";
import { ContextCollection } from "../private/context-collection";

export class Shader extends Resource
{
	private _program: WebGLProgram;
	
	/**************************/
	/* CLASS OBJECT FUNCTIONS */
	/**************************/
	
	// Constructor
	constructor(context: Context, id: string, vertexCode: string, fragCode: string)
	{
		super(context, id);
		let gl = this._context.gl;
		
		let vertexShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertexShader, vertexCode);
		gl.compileShader(vertexShader);
		
		let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragShader, fragCode);
		gl.compileShader(fragShader);
		
		this._program = gl.createProgram();
		gl.attachShader(this._program, vertexShader); 
		gl.attachShader(this._program, fragShader);
		gl.linkProgram(this._program);
		
		gl.deleteShader(vertexShader);
		gl.deleteShader(fragShader);
	}
	
	// Bind
	public bind()
	{
		if (this._context.shaders.currentBind != this) {
			let gl = this._context.gl;
			gl.useProgram(this._program);
			this._context.shaders.currentBind = this;
		}
	}

	// Temporary bind
	public tempBind()
	{
		if (this._context.shaders.currentBind != this) {
			let gl = this._context.gl;
			gl.useProgram(this._program);
		}
	}

	// Temporary unbind
	public tempUnbind()
	{
		this._context.shaders.currentBind?.bind();
	}
	
	// Get uniform attribute location
	private getUniformLocation(name: string): WebGLUniformLocation
	{
		return this._context.gl.getUniformLocation(this._program, name);
	}
	
	// Set 1D float value uniform attribute
	public setUniform1f(name: string, v0: number)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform1f(this.getUniformLocation(name), v0);
		this.tempUnbind();
	}
	
	// Set 1D integer value uniform attribute
	public setUniform1i(name: string, v0: number)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform1i(this.getUniformLocation(name), v0);
		this.tempUnbind();
	}
	
	// Set 2D float array uniform attribute
	public setUniform2f(name: string, val: Vector2<number>)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform2fv(this.getUniformLocation(name), val);
		this.tempUnbind();
	}

	// Set 2D integer array uniform attribute
	public setUniform2i(name: string, val: Vector2<number>)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform2iv(this.getUniformLocation(name), val);
		this.tempUnbind();
	}
	
	// Set 3D float array uniform attribute
	public setUniform3f(name: string, val: Vector3<number>)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform3fv(this.getUniformLocation(name), val);
		this.tempUnbind();
	}
	
	// Set 3D integer array uniform attribute
	public setUniform3i(name: string, val: Vector3<number>)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform3iv(this.getUniformLocation(name), val);
		this.tempUnbind();
	}
	
	// Set 4D float array uniform attribute
	public setUniform4f(name: string, val: Vector4<number>)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform4fv(this.getUniformLocation(name), val);
		this.tempUnbind();
	}
	
	// Set 4D integer array uniform attribute
	public setUniform4i(name: string, val: Vector4<number>)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform4iv(this.getUniformLocation(name), val);
		this.tempUnbind();
	}
	
	// Set 2-component matrix uniform attribute
	public setUniformMatrix2(name: string, val: Matrix2<number>)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniformMatrix2fv(this.getUniformLocation(name), false, val);
		this.tempUnbind();
	}
	
	// Set 3-component matrix uniform attribute
	public setUniformMatrix3(name: string, val: Matrix3<number>)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniformMatrix3fv(this.getUniformLocation(name), false, val);
		this.tempUnbind();
	}
	
	// Set 4-component matrix uniform attribute
	public setUniformMatrix4fv(name: string, val: Matrix4<number>)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniformMatrix4fv(this.getUniformLocation(name), false, val);
		this.tempUnbind();
	}
	
	// Get uniform attribute
	public getUniform(name: string): any
	{
		let gl = this._context.gl;
		return gl.getUniform(this._program, name);
	}
	
	// Delete
	public delete()
	{
		let gl = this._context.gl;
		gl.deleteProgram(this._program);
	}
	
	/********************/
	/* STATIC FUNCTIONS */
	/********************/
	
	// Get shader
	private static getShader(shaderID: string): Shader
	{
		return ContextCollection.getBind()?.shaders.get(shaderID) as Shader;
	}
	
	// Create
	public static create(shaderID: string, vertexCode: string, fragCode: string)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let shader = new Shader(context, shaderID, vertexCode, fragCode);
			context.shaders.add(shaderID, shader);
		}
	}

	// Bind
	public static bind(shaderID: string)
	{
		return this.getShader(shaderID)?.bind();
	}
	
	// Unbind
	public static unbind()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.useProgram(null);
			context.shaders.currentBind = null;
		}
	}
	
	// Set 1D float value uniform attribute
	public static setUniform1f(shaderID: string, name: string, v0: number)
	{
		this.getShader(shaderID)?.setUniform1f(name, v0);
	}
	
	// Set 1D integer value uniform attribute
	public static setUniform1i(shaderID: string, name: string, v0: number)
	{
		this.getShader(shaderID)?.setUniform1i(name, v0);
	}
	
	// Set 2D float array uniform attribute
	public static setUniform2f(shaderID: string, name: string,
		val: Vector2<number>)
	{
		this.getShader(shaderID)?.setUniform2f(name, val);
	}

	// Set 2D integer array uniform attribute
	public static setUniform2iv(shaderID: string, name: string,
		val: Vector2<number>)
	{
		this.getShader(shaderID)?.setUniform2i(name, val);
	}
	
	// Set 3D float array uniform attribute
	public static setUniform3fv(shaderID: string, name: string,
		val: Vector3<number>)
	{
		this.getShader(shaderID)?.setUniform3f(name, val);
	}
	
	// Set 3D integer array uniform attribute
	public static setUniform3iv(shaderID: string, name: string,
		val: Vector3<number>)
	{
		this.getShader(shaderID)?.setUniform3i(name, val);
	}
	
	// Set 4D float array uniform attribute
	public static setUniform4f(shaderID: string, name: string,
		val: Vector4<number>)
	{
		this.getShader(shaderID)?.setUniform4f(name, val);
	}
	
	// Set 4D integer array uniform attribute
	public static setUniform4i(shaderID: string, name: string,
		val: Vector4<number>)
	{
		this.getShader(shaderID)?.setUniform4i(name, val);
	}
	
	// Set 2-component matrix uniform attribute
	public static setUniformMatrix2(shaderID: string, name: string, val: Matrix2<number>)
	{
		this.getShader(shaderID)?.setUniformMatrix2(name, val);
	}
	
	// Set 3-component matrix uniform attribute
	public static setUniformMatrix3fv(shaderID: string, name: string, val: Matrix3<number>)
	{
		this.getShader(shaderID)?.setUniformMatrix3(name, val);
	}
	
	// Set 4-component matrix uniform attribute
	public static setUniformMatrix4fv(shaderID: string, name: string, val: Matrix4<number>)
	{
		this.getShader(shaderID)?.setUniformMatrix4fv(name, val);
	}

	// Set texture uniform attribute
	public static setUniformTexture(shaderID: string, name: string, num: number)
	{
		this.getShader(shaderID)?.setUniform1i(name, num + 1);
	}
	
	// Get uniform attribute
	public static getShaderUniform(shaderID: string, name: string)
	{
		this.getShader(shaderID)?.getUniform(name);
	}
	
	// Delete
	public static delete(shaderID: string)
	{
		ContextCollection.getBind()?.shaders.delete(shaderID);
	}
	
	// Delete all shaders
	public static clear()
	{
		ContextCollection.getBind()?.shaders.clear();
	}
}