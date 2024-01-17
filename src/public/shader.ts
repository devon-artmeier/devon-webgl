import { Matrix2, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from "./tuples";
import { Resource } from "../private/resource";
import { Context } from "./context";
import { ContextPool } from "../private/context-pool";

export class Shader extends Resource
{
	private _program: WebGLProgram;
	
	/**************************/
	/* CLASS OBJECT FUNCTIONS */
	/**************************/
	
	// Constructor
	private constructor(context: Context, id: string, vertexCode: string, fragCode: string)
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
	
	// Delete
	public delete()
	{
		this._context.deleteShader(this._program);
	}
	
	/********************/
	/* STATIC FUNCTIONS */
	/********************/
	
	// Create
	public static create(shaderID: string, vertexCode: string, fragCode: string)
	{
		let context = ContextPool.bind;
		if (context != null) {
			let shader = new Shader(context, shaderID, vertexCode, fragCode);
			context.shaders.add(shaderID, shader);
		}
	}

	// Bind
	public static bind(shaderID: string)
	{
		let context = ContextPool.bind;
		if (context != null) {
			context.bindShader((context.shaders.get(shaderID) as Shader)._program);
		}
	}
	
	// Unbind
	public static unbind()
	{
		ContextPool.bind?.bindShader(null);
	}
	
	// Get uniform attribute
	public static getUniform(name: string): any
	{
		ContextPool.bind?.gl.getUniform(ContextPool.bind?.currentShader, name);
	}
	
	// Get uniform attribute location
	private static getUniformLocation(name: string): WebGLUniformLocation
	{
		return ContextPool.bind?.gl.getUniformLocation(ContextPool.bind?.currentShader, name);
	}
	
	// Set 1D float value uniform attribute
	public static setFloat(name: string, v0: number)
	{
		ContextPool.bind?.gl.uniform1f(this.getUniformLocation(name), v0);
	}
	
	// Set 1D integer value uniform attribute
	public static setInt(name: string, v0: number)
	{
		ContextPool.bind?.gl.uniform1i(this.getUniformLocation(name), v0);
	}
	
	// Set 2D float array uniform attribute
	public static setVec2(name: string, val: Vector2<number>)
	{
		ContextPool.bind?.gl.uniform2fv(this.getUniformLocation(name), val);
	}

	// Set 2D integer array uniform attribute
	public static setIVec2(name: string, val: Vector2<number>)
	{
		ContextPool.bind?.gl.uniform2iv(this.getUniformLocation(name), val);
	}
	
	// Set 3D float array uniform attribute
	public static setVec3(name: string, val: Vector3<number>)
	{
		ContextPool.bind?.gl.uniform3fv(this.getUniformLocation(name), val);
	}
	
	// Set 3D integer array uniform attribute
	public static setIVec3(name: string, val: Vector3<number>)
	{
		ContextPool.bind?.gl.uniform3iv(this.getUniformLocation(name), val);
	}
	
	// Set 4D float array uniform attribute
	public static setVec4(name: string, val: Vector4<number>)
	{
		ContextPool.bind?.gl.uniform4fv(this.getUniformLocation(name), val);
	}
	
	// Set 4D integer array uniform attribute
	public static setIVec4(name: string, val: Vector4<number>)
	{
		ContextPool.bind?.gl.uniform4iv(this.getUniformLocation(name), val);
	}
	
	// Set 2-component matrix uniform attribute
	public static setMatrix2(name: string, val: Matrix2<number>)
	{
		ContextPool.bind?.gl.uniformMatrix2fv(this.getUniformLocation(name), false, val);
	}
	
	// Set 3-component matrix uniform attribute
	public static setMatrix3(name: string, val: Matrix3<number>)
	{
		ContextPool.bind?.gl.uniformMatrix3fv(this.getUniformLocation(name), false, val);
	}
	
	// Set 4-component matrix uniform attribute
	public static setMatrix4(name: string, val: Matrix4<number>)
	{
		ContextPool.bind?.gl.uniformMatrix4fv(this.getUniformLocation(name), false, val);
	}
	
	// Set texture value uniform attribute
	public static setTexture(name: string, num: number)
	{
		this.setInt(name, num + 1);
	}

	// Delete
	public static delete(shaderID: string)
	{
		ContextPool.bind?.shaders.delete(shaderID);
	}
	
	// Delete all shaders
	public static clear()
	{
		ContextPool.bind?.shaders.clear();
	}
}