import { Resource } from "../private/resource";
import { Context } from "./context";
import { ContextCollection } from "../private/context-collection";

export class Shader extends Resource
{
	private _program: WebGLProgram;
	private _tempBind: boolean = false;
	
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
	
	// Temporary bind
	public tempBind()
	{
		if (this._context.shaders.bind?.id != this.id) {
			let gl = this._context.gl;
			gl.useProgram(this._program);
			this._tempBind = true;
		}
	}
	
	// Unbind temporary bind
	public tempUnbind()
	{
		if (this._tempBind) {
			Shader.rebind(this._context.id);
			this._tempBind = false;
		}
	}
	
	// Get uniform attribute location
	private getUniformLocation(name: string): WebGLUniformLocation
	{
		let gl = this._context.gl;
		return gl.getUniformLocation(this._program, name);
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
	public setUniform1fv(name: string, val: Float32Array)
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
	public setUniform1iv(name: string, val: Int32Array)
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
	public setUniform2fv(name: string, val: Float32Array)
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
	public setUniform2iv(name: string, val: Int32Array)
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
	public setUniform3fv(name: string, val: Float32Array)
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
	public setUniform3iv(name: string, val: Int32Array)
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
	public setUniform4fv(name: string, val: Float32Array)
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
	public setUniform4iv(name: string, val: Int32Array)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniform4iv(this.getUniformLocation(name), val);
		this.tempUnbind();
	}
	
	// Set 2-component matrix uniform attribute
	public setUniformMatrix2fv(name: string, val: Float32Array)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniformMatrix2fv(this.getUniformLocation(name), false, val);
		this.tempUnbind();
	}
	
	// Set 3-component matrix uniform attribute
	public setUniformMatrix3fv(name: string, val: Float32Array)
	{
		let gl = this._context.gl;
		this.tempBind();
		gl.uniformMatrix3fv(this.getUniformLocation(name), false, val);
		this.tempUnbind();
	}
	
	// Set 4-component matrix uniform attribute
	public setUniformMatrix4fv(name: string, val: Float32Array)
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
		if (this._context.shaders.bind?.id == this.id) {
			Shader.unbind(this._context.id);
		}
		gl.deleteProgram(this._program);
	}
	
	/********************/
	/* STATIC FUNCTIONS */
	/********************/
	
	// Get shader
	private static getShader(contextID: string, shaderID: string): Shader
	{
		return ContextCollection.get(contextID).shaders.get(shaderID) as Shader;
	}
	
	// Create
	public static create(contextID: string, shaderID: string, vertexCode: string, fragCode: string)
	{
		let context = ContextCollection.get(contextID);
		if (context != null) {
			let shader = new Shader(context, shaderID, vertexCode, fragCode);
			ContextCollection.get(contextID).shaders.add(shaderID, shader);
		}
	}

	// Bind
	public static bind(contextID: string, shaderID: string)
	{
		let gl = ContextCollection.get(contextID)?.gl;
		let shader = this.getShader(contextID, shaderID);
		if (gl != null) {
			if (ContextCollection.get(contextID).shaders.bind = shader) {
				gl.useProgram(shader._program);
				ContextCollection.get(contextID).shaders.bind = shader;
			}
		}
	}
	
	// Unbind
	public static unbind(contextID: string)
	{
		let gl = ContextCollection.get(contextID)?.gl;
		if (gl != null && ContextCollection.get(contextID).shaders.bind != null) {
			gl.useProgram(null);
			ContextCollection.get(contextID).shaders.bind = null;
		}
	}
	
	// Rebind
	private static rebind(contextID: string)
	{
		let gl = ContextCollection.get(contextID).gl;
		let shader = this.getShader(contextID, ContextCollection.get(contextID).textures.bind?.id);
		if (gl != null && shader != null) {
			gl.useProgram(shader._program);
		}
	}
	
	// Set 1D float value uniform attribute
	public static setUniform1f(contextID: string, shaderID: string, name: string, v0: number)
	{
		this.getShader(contextID, shaderID)?.setUniform1f(name, v0);
	}
	
	// Set 1D float array uniform attribute
	public static setUniform1fv(contextID: string, shaderID: string, name: string, val: Float32Array)
	{
		this.getShader(contextID, shaderID)?.setUniform1fv(name, val);
	}
	
	// Set 1D integer values uniform attribute
	public static setUniform1i(contextID: string, shaderID: string, name: string, v0: number)
	{
		this.getShader(contextID, shaderID)?.setUniform1i(name, v0);
	}
	
	// Set 1D integer array uniform attribute
	public static setUniform1iv(contextID: string, shaderID: string, name: string, val: Int32Array)
	{
		this.getShader(contextID, shaderID)?.setUniform1iv(name, val);
	}
	
	// Set 2D float values uniform attribute
	public static setUniform2f(contextID: string, shaderID: string, name: string, v0: number, v1: number)
	{
		this.getShader(contextID, shaderID)?.setUniform2f(name, v0, v1);
	}
	
	// Set 2D float array uniform attribute
	public static setUniform2fv(contextID: string, shaderID: string, name: string, val: Float32Array)
	{
		this.getShader(contextID, shaderID)?.setUniform2fv(name, val);
	}
	
	// Set 2D integer values uniform attribute
	public static setUniform2i(contextID: string, shaderID: string, name: string, v0: number, v1: number)
	{
		this.getShader(contextID, shaderID)?.setUniform2i(name, v0, v1);
	}
	
	// Set 2D integer array uniform attribute
	public static setUniform2iv(contextID: string, shaderID: string, name: string, val: Int32Array)
	{
		this.getShader(contextID, shaderID)?.setUniform2iv(name, val);
	}
	
	// Set 3D float values uniform attribute
	public static setUniform3f(contextID: string, shaderID: string, name: string,
		v0: number, v1: number, v2: number)
	{
		this.getShader(contextID, shaderID)?.setUniform3f(name, v0, v1, v2);
	}
	
	// Set 3D float array uniform attribute
	public static setUniform3fv(contextID: string, shaderID: string, name: string, val: Float32Array)
	{
		this.getShader(contextID, shaderID)?.setUniform3fv(name, val);
	}
	
	// Set 3D integer values uniform attribute
	public static setUniform3i(contextID: string, shaderID: string, name: string,
		v0: number, v1: number, v2: number)
	{
		this.getShader(contextID, shaderID)?.setUniform3i(name, v0, v1, v2);
	}
	
	// Set 3D integer array uniform attribute
	public static setUniform3iv(contextID: string, shaderID: string, name: string, val: Int32Array)
	{
		this.getShader(contextID, shaderID)?.setUniform3iv(name, val);
	}
	
	// Set 4D float values uniform attribute
	public static setUniform4f(contextID: string, shaderID: string, name: string,
		v0: number, v1: number, v2: number, v3: number)
	{
		this.getShader(contextID, shaderID)?.setUniform4f(name, v0, v1, v2, v3);
	}
	
	// Set 4D float array uniform attribute
	public static setUniform4fv(contextID: string, shaderID: string, name: string, val: Float32Array)
	{
		this.getShader(contextID, shaderID)?.setUniform4fv(name, val);
	}
	
	// Set 4D integer values uniform attribute
	public static setUniform4i(contextID: string, shaderID: string, name: string,
		v0: number, v1: number, v2: number, v3: number)
	{
		this.getShader(contextID, shaderID)?.setUniform4i(name, v0, v1, v2, v3);
	}
	
	// Set 4D integer array uniform attribute
	public static setUniform4iv(contextID: string, shaderID: string, name: string, val: Int32Array)
	{
		this.getShader(contextID, shaderID)?.setUniform4iv(name, val);
	}
	
	// Set 2-component matrix uniform attribute
	public static setUniformMatrix2fv(contextID: string, shaderID: string, name: string, val: Float32Array)
	{
		this.getShader(contextID, shaderID)?.setUniformMatrix2fv(name, val);
	}
	
	// Set 3-component matrix uniform attribute
	public static setUniformMatrix3fv(contextID: string, shaderID: string, name: string, val: Float32Array)
	{
		this.getShader(contextID, shaderID)?.setUniformMatrix3fv(name, val);
	}
	
	// Set 4-component matrix uniform attribute
	public static setUniformMatrix4fv(contextID: string, shaderID: string, name: string, val: Float32Array)
	{
		this.getShader(contextID, shaderID)?.setUniformMatrix4fv(name, val);
	}
	
	// Get uniform attribute
	public static getShaderUniform(contextID: string, shaderID: string, name: string)
	{
		this.getShader(contextID, shaderID)?.getUniform(name);
	}
	
	// Delete
	public static delete(contextID: string, shaderID: string)
	{
		ContextCollection.get(contextID).shaders.delete(shaderID);
	}
	
	// Delete all shaders
	public static clear(contextID: string)
	{
		ContextCollection.get(contextID).shaders.clear();
	}
}