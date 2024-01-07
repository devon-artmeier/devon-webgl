import { ContextPool } from "../private/context-pool";

export class Stencil
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

	// Options
	public static readonly Keep = 0;
	public static readonly Zero = 1;
	public static readonly Replace = 2;
	public static readonly Increase = 3;
	public static readonly IncreaseWrap = 4;
	public static readonly Decrease = 5;
	public static readonly DecreaseWrap = 6;
	public static readonly Invert = 7;

	// Enable stencil testing
	public static enable()
	{
		let context = ContextPool.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.enable(gl.STENCIL_TEST);
		}
	}
	
	// Disable stencil testing
	public static disable()
	{
		let context = ContextPool.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.disable(gl.STENCIL_TEST);
		}
	}

	// Clear stencil buffer
	public static clear()
	{
		let context = ContextPool.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.clear(gl.STENCIL_BUFFER_BIT);
		}
	}

	// Set stencil function
	public static setFunction(func: number, ref: number, mask: number)
	{
		let context = ContextPool.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.stencilFunc([
				gl.ALWAYS, gl.NEVER, gl.EQUAL, gl.NOTEQUAL,
				gl.LESS, gl.LEQUAL, gl.GREATER, gl.GEQUAL
			][func], ref, mask);
		}
	}

	// Set stencil options
	public static setOptions(sfail: number, dpfail: number, dppass: number)
	{
		let context = ContextPool.getBind();
		if (context != null) {
			let gl = context.gl;
			let ops = [
				gl.KEEP, gl.ZERO, gl.REPLACE, gl.INCR,
				gl.INCR_WRAP, gl.DECR, gl.DECR_WRAP, gl.INVERT
			];
			gl.stencilOp(ops[sfail], ops[dpfail], ops[dppass]);
		}
	}
	
	// Set stencil mask
	public static setMask(mask: number)
	{
		let context = ContextPool.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.stencilMask(mask); 
		}
	}
}