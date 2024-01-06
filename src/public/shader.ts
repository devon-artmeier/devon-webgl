import { Resource } from "../private/resource";
import { ResourceManager } from "../private/resource-manager"
import { Context } from "./context";
import { ContextCollection } from "../private/context-collection";

export class Shader extends Resource
{
	private _program: WebGLProgram;
	
	/**************************/
	/* CLASS OBJECT FUNCTIONS */
	/**************************/
	
	// Constructor
	constructor(context: Context, id: string, manager: ResourceManager,
		vertexCode: string, fragCode: string)
	{
		super(context, id, manager);
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
		let gl = this._context.gl;
		gl.useProgram(this._program);
	}
	
	// Unbind
	public unbind()
	{
		let gl = this._context.gl;
		gl.useProgram(null);
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
	
	// Set 1D float array uniform attribute
	public setUniform1fv(name: string, val: number[])
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform1fv(this.getUniformLocation(name), val);
		this.tempUnbind();
	}
	
	// Set 1D integer values uniform attribute
	public setUniform1i(name: string, v0: number)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform1i(this.getUniformLocation(name), v0);
		this.tempUnbind();
	}
	
	// Set 1D integer array uniform attribute
	public setUniform1iv(name: string, val: number[])
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform1iv(this.getUniformLocation(name), val);
		this.tempUnbind();
	}
	
	// Set 2D float values uniform attribute
	public setUniform2f(name: string, v0: number, v1: number)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform2f(this.getUniformLocation(name), v0, v1);
		this.tempUnbind();
	}
	
	// Set 2D float array uniform attribute
	public setUniform2fv(name: string, val: number[])
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform2fv(this.getUniformLocation(name), val);
		this.tempUnbind();
	}
	
	// Set 2D integer values uniform attribute
	public setUniform2i(name: string, v0: number, v1: number)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform2i(this.getUniformLocation(name), v0, v1);
		this.tempUnbind();
	}
	
	// Set 2D integer array uniform attribute
	public setUniform2iv(name: string, val: number[])
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform2iv(this.getUniformLocation(name), val);
		this.tempUnbind();
	}
	
	// Set 3D float values uniform attribute
	public setUniform3f(name: string, v0: number, v1: number, v2: number)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform3f(this.getUniformLocation(name), v0, v1, v2);
		this.tempUnbind();
	}
	
	// Set 3D float array uniform attribute
	public setUniform3fv(name: string, val: number[])
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform3fv(this.getUniformLocation(name), val);
		this.tempUnbind();
	}
	
	// Set 3D integer values uniform attribute
	public setUniform3i(name: string, v0: number, v1: number, v2: number)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform3i(this.getUniformLocation(name), v0, v1, v2);
		this.tempUnbind();
	}
	
	// Set 3D integer array uniform attribute
	public setUniform3iv(name: string, val: number[])
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform3iv(this.getUniformLocation(name), val);
		this.tempUnbind();
	}
	
	// Set 4D float values uniform attribute
	public setUniform4f(name: string, v0: number, v1: number, v2: number, v3: number)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform4f(this.getUniformLocation(name), v0, v1, v2, v3);
		this.tempUnbind();
	}
	
	// Set 4D float array uniform attribute
	public setUniform4fv(name: string, val: number[])
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform4fv(this.getUniformLocation(name), val);
		this.tempUnbind();
	}
	
	// Set 4D integer values uniform attribute
	public setUniform4i(name: string, v0: number, v1: number, v2: number, v3: number)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform4i(this.getUniformLocation(name), v0, v1, v2, v3);
		this.tempUnbind();
	}
	
	// Set 4D integer array uniform attribute
	public setUniform4iv(name: string, val: number[])
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform4iv(this.getUniformLocation(name), val);
		this.tempUnbind();
	}
	
	// Set 2-component matrix uniform attribute
	public setUniformMatrix2fv(name: string, val: number[])
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniformMatrix2fv(this.getUniformLocation(name), false, val);
		this.tempUnbind();
	}
	
	// Set 3-component matrix uniform attribute
	public setUniformMatrix3fv(name: string, val: number[])
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniformMatrix3fv(this.getUniformLocation(name), false, val);
		this.tempUnbind();
	}
	
	// Set 4-component matrix uniform attribute
	public setUniformMatrix4fv(name: string, val: number[])
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
		this._manager.unbind(this.id);
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
			let manager = context.shaders;
			let shader = new Shader(context, shaderID, manager, vertexCode, fragCode);
			manager.add(shaderID, shader);
		}
	}

	// Bind
	public static bind(shaderID: string)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let manager = context.shaders;
			manager.bind(shaderID);
		}
	}
	
	// Unbind
	public static unbind()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			context.shaders.unbindCurrent();
		}
	}
	
	// Set 1D float value uniform attribute
	public static setUniform1f(shaderID: string, name: string, v0: number)
	{
		this.getShader(shaderID)?.setUniform1f(name, v0);
	}
	
	// Set 1D float array uniform attribute
	public static setUniform1fv(shaderID: string, name: string, val: number[])
	{
		this.getShader(shaderID)?.setUniform1fv(name, val);
	}
	
	// Set 1D integer values uniform attribute
	public static setUniform1i(shaderID: string, name: string, v0: number)
	{
		this.getShader(shaderID)?.setUniform1i(name, v0);
	}
	
	// Set 1D integer array uniform attribute
	public static setUniform1iv(shaderID: string, name: string, val: number[])
	{
		this.getShader(shaderID)?.setUniform1iv(name, val);
	}
	
	// Set 2D float values uniform attribute
	public static setUniform2f(shaderID: string, name: string, v0: number, v1: number)
	{
		this.getShader(shaderID)?.setUniform2f(name, v0, v1);
	}
	
	// Set 2D float array uniform attribute
	public static setUniform2fv(shaderID: string, name: string, val: number[])
	{
		this.getShader(shaderID)?.setUniform2fv(name, val);
	}
	
	// Set 2D integer values uniform attribute
	public static setUniform2i(shaderID: string, name: string, v0: number, v1: number)
	{
		this.getShader(shaderID)?.setUniform2i(name, v0, v1);
	}
	
	// Set 2D integer array uniform attribute
	public static setUniform2iv(shaderID: string, name: string, val: number[])
	{
		this.getShader(shaderID)?.setUniform2iv(name, val);
	}
	
	// Set 3D float values uniform attribute
	public static setUniform3f(shaderID: string, name: string,
		v0: number, v1: number, v2: number)
	{
		this.getShader(shaderID)?.setUniform3f(name, v0, v1, v2);
	}
	
	// Set 3D float array uniform attribute
	public static setUniform3fv(shaderID: string, name: string, val: number[])
	{
		this.getShader(shaderID)?.setUniform3fv(name, val);
	}
	
	// Set 3D integer values uniform attribute
	public static setUniform3i(shaderID: string, name: string,
		v0: number, v1: number, v2: number)
	{
		this.getShader(shaderID)?.setUniform3i(name, v0, v1, v2);
	}
	
	// Set 3D integer array uniform attribute
	public static setUniform3iv(shaderID: string, name: string, val: number[])
	{
		this.getShader(shaderID)?.setUniform3iv(name, val);
	}
	
	// Set 4D float values uniform attribute
	public static setUniform4f(shaderID: string, name: string,
		v0: number, v1: number, v2: number, v3: number)
	{
		this.getShader(shaderID)?.setUniform4f(name, v0, v1, v2, v3);
	}
	
	// Set 4D float array uniform attribute
	public static setUniform4fv(shaderID: string, name: string, val: number[])
	{
		this.getShader(shaderID)?.setUniform4fv(name, val);
	}
	
	// Set 4D integer values uniform attribute
	public static setUniform4i(shaderID: string, name: string,
		v0: number, v1: number, v2: number, v3: number)
	{
		this.getShader(shaderID)?.setUniform4i(name, v0, v1, v2, v3);
	}
	
	// Set 4D integer array uniform attribute
	public static setUniform4iv(shaderID: string, name: string, val: number[])
	{
		this.getShader(shaderID)?.setUniform4iv(name, val);
	}
	
	// Set 2-component matrix uniform attribute
	public static setUniformMatrix2fv(shaderID: string, name: string, val: number[])
	{
		this.getShader(shaderID)?.setUniformMatrix2fv(name, val);
	}
	
	// Set 3-component matrix uniform attribute
	public static setUniformMatrix3fv(shaderID: string, name: string, val: number[])
	{
		this.getShader(shaderID)?.setUniformMatrix3fv(name, val);
	}
	
	// Set 4-component matrix uniform attribute
	public static setUniformMatrix4fv(shaderID: string, name: string, val: number[])
	{
		this.getShader(shaderID)?.setUniformMatrix4fv(name, val);
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