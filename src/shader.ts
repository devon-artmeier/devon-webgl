import { Resource } from "./resource";

// Shader class
export class Shader extends Resource
{
	private static _curProgram: WebGLProgram;
	
	private _program: WebGLProgram;
	
	// Constructor
	constructor(gl: WebGL2RenderingContext, vertexCode: string, fragCode: string)
	{
		super(gl);
		
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
	
	// Use shader
	public use()
	{
		if (Shader._curProgram != this._program) {
			Shader._curProgram = this._program;
			this._gl.useProgram(this._program);
		}
	}
	
	// Get uniform attribute location
	private getUniformLocation(name: string): WebGLUniformLocation
	{
		return this._gl.getUniformLocation(this._program, name);
	}
	
	// Set 1D float value uniform attribute
	public setUniform1f(name: string, v0: number)
	{
		this.use();
		this._gl.uniform1f(this.getUniformLocation(name), v0);
	}
	
	// Set 1D float array uniform attribute
	public setUniform1fv(name: string, val: Float32Array)
	{
		this.use();
		this._gl.uniform1fv(this.getUniformLocation(name), val);
	}
	
	// Set 1D integer values uniform attribute
	public setUniform1i(name: string, v0: number)
	{
		this.use();
		this._gl.uniform1i(this.getUniformLocation(name), v0);
	}
	
	// Set 1D integer array uniform attribute
	public setUniform1iv(name: string, val: Int32Array)
	{
		this.use();
		this._gl.uniform1iv(this.getUniformLocation(name), val);
	}
	
	// Set 2D float values uniform attribute
	public setUniform2f(name: string, v0: number, v1: number)
	{
		this.use();
		this._gl.uniform2f(this.getUniformLocation(name), v0, v1);
	}
	
	// Set 2D float array uniform attribute
	public setUniform2fv(name: string, val: Float32Array)
	{
		this.use();
		this._gl.uniform2fv(this.getUniformLocation(name), val);
	}
	
	// Set 2D integer values uniform attribute
	public setUniform2i(name: string, v0: number, v1: number)
	{
		this.use();
		this._gl.uniform2i(this.getUniformLocation(name), v0, v1);
	}
	
	// Set 2D integer array uniform attribute
	public setUniform2iv(name: string, val: Int32Array)
	{
		this.use();
		this._gl.uniform2iv(this.getUniformLocation(name), val);
	}
	
	// Set 3D float values uniform attribute
	public setUniform3f(name: string, v0: number, v1: number, v2: number)
	{
		this.use();
		this._gl.uniform3f(this.getUniformLocation(name), v0, v1, v2);
	}
	
	// Set 3D float array uniform attribute
	public setUniform3fv(name: string, val: Float32Array)
	{
		this.use();
		this._gl.uniform3fv(this.getUniformLocation(name), val);
	}
	
	// Set 3D integer values uniform attribute
	public setUniform3i(name: string, v0: number, v1: number, v2: number)
	{
		this.use();
		this._gl.uniform3i(this.getUniformLocation(name), v0, v1, v2);
	}
	
	// Set 3D integer array uniform attribute
	public setUniform3iv(name: string, val: Int32Array)
	{
		this.use();
		this._gl.uniform3iv(this.getUniformLocation(name), val);
	}
	
	// Set 4D float values uniform attribute
	public setUniform4f(name: string, v0: number, v1: number, v2: number, v3: number)
	{
		this.use();
		this._gl.uniform4f(this.getUniformLocation(name), v0, v1, v2, v3);
	}
	
	// Set 4D float array uniform attribute
	public setUniform4fv(name: string, val: Float32Array)
	{
		this.use();
		this._gl.uniform4fv(this.getUniformLocation(name), val);
	}
	
	// Set 4D integer values uniform attribute
	public setUniform4i(name: string, v0: number, v1: number, v2: number, v3: number)
	{
		this.use();
		this._gl.uniform4i(this.getUniformLocation(name), v0, v1, v2, v3);
	}
	
	// Set 4D integer array uniform attribute
	public setUniform4iv(name: string, val: Int32Array)
	{
		this.use();
		this._gl.uniform4iv(this.getUniformLocation(name), val);
	}
	
	// Set 2-component matrix uniform attribute
	public setUniformMatrix2fv(name: string, val: Float32Array)
	{
		this.use();
		this._gl.uniformMatrix2fv(this.getUniformLocation(name), false, val);
	}
	
	// Set 3-component matrix uniform attribute
	public setUniformMatrix3fv(name: string, val: Float32Array)
	{
		this.use();
		this._gl.uniformMatrix3fv(this.getUniformLocation(name), false, val);
	}
	
	// Set 4-component matrix uniform attribute
	public setUniformMatrix4fv(name: string, val: Float32Array)
	{
		this.use();
		this._gl.uniformMatrix4fv(this.getUniformLocation(name), false, val);
	}
	
	// Get uniform attribute
	public getUniform(name: string): any
	{
		this.use();
		return this._gl.getUniform(this._program, name);
	}
	
	// Delete
	public delete()
	{
		if (Shader._curProgram == this._program) {
			Shader._curProgram = null;
			this._gl.useProgram(null);
		}
		this._gl.deleteProgram(this._program);
		this._program = null;
	}
}