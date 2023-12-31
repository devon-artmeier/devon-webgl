import { ContextPool } from "../private/context-pool";

export class Depth
{
	// Conditions
	public static readonly Always = 0;
	public static readonly Never = 1;
	public static readonly Equal = 2;
	public static readonly NotEqual = 3;
	public static readonly Less = 4;
	public static readonly LessEqual = 5;
	public static readonly Greater = 6;
	public static readonly GreaterEqual = 7;

	// Enable depth
	public static enable()
	{
		let context = ContextPool.bind;
		if (context != null) {
			let gl = context.gl;
			gl.enable(gl.DEPTH_TEST);
		}
	}

	// Disable depth
	public static disable()
	{
		let context = ContextPool.bind;
		if (context != null) {
			let gl = context.gl;
			gl.disable(gl.DEPTH_TEST);
		}
	}

	// Clear depth buffer
	public static clear()
	{
		let context = ContextPool.bind;
		if (context != null) {
			let gl = context.gl;
			gl.clear(gl.DEPTH_BUFFER_BIT);
		}
	}

	// Set depth function
	public static setFunction(func: number)
	{
		let context = ContextPool.bind;
		if (context != null) {
			let gl = context.gl;
			gl.depthFunc([
				gl.ALWAYS, gl.NEVER, gl.EQUAL, gl.NOTEQUAL,
				gl.LESS, gl.LEQUAL, gl.GREATER, gl.GEQUAL
			][func]);
		}
	}

	// Set depth mask
	public static setMask(enable: boolean)
	{
		let context = ContextPool.bind;
		if (context != null) {
			let gl = context.gl;
			gl.depthMask(enable);
		}
	}
}