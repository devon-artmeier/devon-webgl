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
	
	// Get uniform attribute location
	private getUniformLocation(name: string): WebGLUniformLocation
	{
		return this._context.gl.getUniformLocation(this._program, name);
	}
	
	// Set 1D float value uniform attribute
	public setFloat(name: string, v0: number)
	{
		let gl = this._context.gl;
		gl.uniform1f(this.getUniformLocation(name), v0);
	}
	
	// Set 1D integer value uniform attribute
	public setInt(name: string, v0: number)
	{
		let gl = this._context.gl;
		gl.uniform1i(this.getUniformLocation(name), v0);
	}
	
	// Set 2D float array uniform attribute
	public setVec2(name: string, val: Vector2<number>)
	{
		let gl = this._context.gl;
		gl.uniform2fv(this.getUniformLocation(name), val);
	}

	// Set 2D integer array uniform attribute
	public setIVec2(name: string, val: Vector2<number>)
	{
		let gl = this._context.gl;
		gl.uniform2iv(this.getUniformLocation(name), val);
	}
	
	// Set 3D float array uniform attribute
	public setVec3(name: string, val: Vector3<number>)
	{
		let gl = this._context.gl;
		gl.uniform3fv(this.getUniformLocation(name), val);
	}
	
	// Set 3D integer array uniform attribute
	public setIVec3(name: string, val: Vector3<number>)
	{
		let gl = this._context.gl;
		gl.uniform3iv(this.getUniformLocation(name), val);
	}
	
	// Set 4D float array uniform attribute
	public setVec4(name: string, val: Vector4<number>)
	{
		let gl = this._context.gl;
		gl.uniform4fv(this.getUniformLocation(name), val);
	}
	
	// Set 4D integer array uniform attribute
	public setIVec4(name: string, val: Vector4<number>)
	{
		let gl = this._context.gl;
		gl.uniform4iv(this.getUniformLocation(name), val);
	}
	
	// Set 2-component matrix uniform attribute
	public setMatrix2(name: string, val: Matrix2<number>)
	{
		let gl = this._context.gl;
		gl.uniformMatrix2fv(this.getUniformLocation(name), false, val);
	}
	
	// Set 3-component matrix uniform attribute
	public setMatrix3(name: string, val: Matrix3<number>)
	{
		let gl = this._context.gl;
		gl.uniformMatrix3fv(this.getUniformLocation(name), false, val);
	}
	
	// Set 4-component matrix uniform attribute
	public setMatrix4(name: string, val: Matrix4<number>)
	{
		let gl = this._context.gl;
		gl.uniformMatrix4fv(this.getUniformLocation(name), false, val);
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
	private static getShader(): Shader
	{
		return ContextCollection.getBind()?.shaders.currentBind as Shader;
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
		return ContextCollection.getBind()?.shaders.get(shaderID)?.bind();
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
	public static setFloat(name: string, v0: number)
	{
		this.getShader()?.setFloat(name, v0);
	}
	
	// Set 1D integer value uniform attribute
	public static setInt(name: string, v0: number)
	{
		this.getShader()?.setInt(name, v0);
	}
	
	// Set 2D float array uniform attribute
	public static setVec2(name: string,
		val: Vector2<number>)
	{
		this.getShader()?.setVec2(name, val);
	}

	// Set 2D integer array uniform attribute
	public static setIVec2v(name: string, val: Vector2<number>)
	{
		this.getShader()?.setIVec2(name, val);
	}
	
	// Set 3D float array uniform attribute
	public static setVec3v(name: string, val: Vector3<number>)
	{
		this.getShader()?.setVec3(name, val);
	}
	
	// Set 3D integer array uniform attribute
	public static setIVec3v(name: string,
		val: Vector3<number>)
	{
		this.getShader()?.setIVec3(name, val);
	}
	
	// Set 4D float array uniform attribute
	public static setVec4(name: string,
		val: Vector4<number>)
	{
		this.getShader()?.setVec4(name, val);
	}
	
	// Set 4D integer array uniform attribute
	public static setIVec4(name: string,
		val: Vector4<number>)
	{
		this.getShader()?.setIVec4(name, val);
	}
	
	// Set 2-component matrix uniform attribute
	public static setMatrix2(name: string, val: Matrix2<number>)
	{
		this.getShader()?.setMatrix2(name, val);
	}
	
	// Set 3-component matrix uniform attribute
	public static setMatrix3(name: string, val: Matrix3<number>)
	{
		this.getShader()?.setMatrix3(name, val);
	}
	
	// Set 4-component matrix uniform attribute
	public static setMatrix4(name: string, val: Matrix4<number>)
	{
		this.getShader()?.setMatrix4(name, val);
	}

	// Set texture uniform attribute
	public static setTexture(name: string, num: number)
	{
		this.getShader()?.setInt(name, num + 1);
	}
	
	// Get uniform attribute
	public static getUniform(name: string)
	{
		this.getShader()?.getUniform(name);
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