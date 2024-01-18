import { Context } from "./context";
import { Texture } from "./texture";

/**
 * A class that represents a shader.
 */
export class Shader
{
	/** The WebGL shader object. */
	private readonly _glShader: WebGLProgram;

	/**
	 * The constructor of the `Shader` class.
	 * 
	 * @param id The ID of the shader.
	 * @param _context The WebGL context.
	 * @param vertexCode: The vertex shader code.
	 * @param fragCode: The gragment shader code.
	 */
	constructor(public readonly id: string, protected readonly _context: Context,
		vertexCode: string, fragCode: string)
	{
		if (this._context != null) {
			let gl = this._context.gl;
	
			this._context.shaders.get(this.id)?.delete();
			this._context.shaders.set(this.id, this);

			let vertexShader = gl.createShader(gl.VERTEX_SHADER);
			gl.shaderSource(vertexShader, vertexCode);
			gl.compileShader(vertexShader);
		
			let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(fragShader, fragCode);
			gl.compileShader(fragShader);
		
			this._glShader = gl.createProgram();
			gl.attachShader(this._glShader, vertexShader); 
			gl.attachShader(this._glShader, fragShader);
			gl.linkProgram(this._glShader);
		
			gl.deleteShader(vertexShader);
			gl.deleteShader(fragShader);
		}
	}

	/**
	 * Bind shader.
	 */
	public bind()
	{
		this._context.bindGLShader(this._glShader);
	}
	
	/**
	 * Get uniform attribute location.
	 * 
	 * @param name Name of attribute.
	 * @returns Uniform attribute location.
	 */
	private getUniformLocation(name: string): WebGLUniformLocation
	{
		this.bind();
		return this._context.gl.getUniformLocation(this._glShader, name);
	}

	/**
	 * Set float value uniform attribute for shader.
	 * 
	 * @param name Name of attribute.
	 * @param val Value to set.
	 */
	public setFloat(name: string, val: number)
	{
		this._context.gl.uniform1f(this.getUniformLocation(name), val);
	}

	/**
	 * Set integer value uniform attribute for shader.
	 * 
	 * @param name Name of attribute.
	 * @param val Value to set.
	 */
	public setInt(name: string, val: number)
	{
		this._context.gl.uniform1i(this.getUniformLocation(name), val);
	}
	
	
	/**
	 * Set 2-component float array uniform attribute for shader.
	 * 
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setVec2(name: string, val: [number, number])
	{
		this._context.gl.uniform2fv(this.getUniformLocation(name), val);
	}

	/**
	 * Set 2-component integer array uniform attribute for shader.
	 * 
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setIVec2(name: string, val: [number, number])
	{
		this._context.gl.uniform2iv(this.getUniformLocation(name), val);
	}
	
	/**
	 * Set 3-component float array uniform attribute for shader.
	 * 
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setVec3(name: string, val: [number, number, number])
	{
		this._context.gl.uniform3fv(this.getUniformLocation(name), val);
	}
	
	/**
	 * Set 3-component integer array uniform attribute for shader.
	 * 
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setIVec3(name: string, val: [number, number, number])
	{
		this._context.gl.uniform3iv(this.getUniformLocation(name), val);
	}
	
	/**
	 * Set 4-component float array uniform attribute for shader.
	 * 
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setVec4(name: string, val: [number, number, number, number])
	{
		this._context.gl.uniform4fv(this.getUniformLocation(name), val);
	}
	
	/**
	 * Set 4-component integer array uniform attribute for shader.
	 * 
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setIVec4(name: string, val: [number, number, number, number])
	{
		this._context.gl.uniform4iv(this.getUniformLocation(name), val);
	}
	
	/**
	 * Set 2-component matrix uniform attribute for shader.
	 * 
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setMatrix2(name: string, val: [number, number, number, number])
	{
		this._context.gl.uniformMatrix2fv(this.getUniformLocation(name), false, val);
	}
	
	/**
	 * Set 3-component matrix uniform attribute for shader.
	 * 
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setMatrix3(name: string, val:
		[number, number, number, number, number, number, number, number, number])
	{
		this._context.gl.uniformMatrix3fv(this.getUniformLocation(name), false, val);
	}
	
	/**
	 * Set 4-component matrix uniform attribute for shader.
	 * 
	 * @param name Name of attribute.
	 * @param val Values to set.
	 */
	public setMatrix4(name: string, val:
		[number, number, number, number, number, number, number, number,
		 number, number, number, number, number, number, number, number])
	{
		this._context.gl.uniformMatrix4fv(this.getUniformLocation(name), false, val);
	}

	/**
	 * Set texture value uniform attribute
	 * 
	 * @param name Name of attribute.
	 * @param texture Texture to set.
	 * @param num Texture number to set.
	 */
	public setTexture(name: string, texture: Texture, num: number)
	{
		this.setInt(name, num);
		this._context.gl.activeTexture(this._context.gl.TEXTURE0 + num);
		texture.bind();
	}

	/**
	 * Delete shader
	 */
	public delete()
	{
		this._context.deleteGLShader(this._glShader);
		this._context.shaders.delete(this.id);
	}
}