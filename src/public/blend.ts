import { ContextPool } from "../private/context-pool";

export class Blend
{
	// Functions
	public static readonly Zero = 0;
	public static readonly One = 1;
	public static readonly SrcColor = 2;
	public static readonly OneMinusSrcColor = 3;
	public static readonly DestColor = 4;
	public static readonly OneMinusDestColor = 5;
	public static readonly SrcAlpha = 6;
	public static readonly OneMinusSrcAlpha = 7;
	public static readonly DestAlpha = 8;
	public static readonly OneMinusDestAlpha = 9;
	public static readonly ConstantColor = 10;
	public static readonly OneMinusConstantColor = 11;
	public static readonly ConstantAlpha = 12;
	public static readonly OneMinusConstantAlpha = 13;

	// Enable blending
	public static enable()
	{
		let context = ContextPool.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.enable(gl.BLEND);
		}
	}

	// Disable blending
	public static disable()
	{
		let context = ContextPool.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.disable(gl.BLEND);
		}
	}

	// Get blend function
	private static getFunction(func: number): number
	{
		let context = ContextPool.getBind();
		if (context != null) {
			let gl = context.gl;
			return [
				gl.ZERO, gl.ONE, gl.SRC_COLOR, gl.ONE_MINUS_SRC_COLOR,
				gl.DST_COLOR, gl.ONE_MINUS_DST_COLOR, gl.SRC_ALPHA,
				gl.ONE_MINUS_SRC_ALPHA, gl.DST_ALPHA, gl.ONE_MINUS_DST_ALPHA,
				gl.CONSTANT_COLOR, gl.ONE_MINUS_CONSTANT_COLOR,
				gl.CONSTANT_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA
			][func];
		}
		return 0;
	}
	
	// Set blend function
	public static setFunction(sfunc: number, dfunc: number)
	{
		let context = ContextPool.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.blendFunc(this.getFunction(sfunc), this.getFunction(dfunc));
		}
	}
	
	// Set separate blend functions
	public static setFunctionSeparate(srgb: number, drgb: number, salpha: number, dalpha: number)
	{
		let context = ContextPool.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.blendFuncSeparate(this.getFunction(srgb), this.getFunction(drgb),
				this.getFunction(salpha), this.getFunction(dalpha));
		}
	}
}