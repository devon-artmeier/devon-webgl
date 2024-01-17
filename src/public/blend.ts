import { ContextPool } from "../private/context-pool";

export class Blend
{
	// Functions
	public static readonly Zero: number = 0;
	public static readonly One: number = 1;
	public static readonly SrcColor: number = 2;
	public static readonly OneMinusSrcColor: number = 3;
	public static readonly DestColor: number = 4;
	public static readonly OneMinusDestColor: number = 5;
	public static readonly SrcAlpha: number = 6;
	public static readonly OneMinusSrcAlpha: number = 7;
	public static readonly DestAlpha: number = 8;
	public static readonly OneMinusDestAlpha: number = 9;
	public static readonly ConstantColor: number = 10;
	public static readonly OneMinusConstantColor: number = 11;
	public static readonly ConstantAlpha: number = 12;
	public static readonly OneMinusConstantAlpha: number = 13;

	// Enable blending
	public static enable()
	{
		let context = ContextPool.bind;
		if (context != null) {
			let gl = context.gl;
			gl.enable(gl.BLEND);
		}
	}

	// Disable blending
	public static disable()
	{
		let context = ContextPool.bind;
		if (context != null) {
			let gl = context.gl;
			gl.disable(gl.BLEND);
		}
	}

	// Get blend function
	private static getFunction(func: number): number
	{
		let context = ContextPool.bind;
		if (context != null) {
			let gl = context.gl;
			let funcs = [
				gl.ZERO, gl.ONE, gl.SRC_COLOR, gl.ONE_MINUS_SRC_COLOR,
				gl.DST_COLOR, gl.ONE_MINUS_DST_COLOR, gl.SRC_ALPHA,
				gl.ONE_MINUS_SRC_ALPHA, gl.DST_ALPHA, gl.ONE_MINUS_DST_ALPHA,
				gl.CONSTANT_COLOR, gl.ONE_MINUS_CONSTANT_COLOR,
				gl.CONSTANT_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA
			];

			if (func >= 0 && func < funcs.length) {
				return funcs[func];
			}
			return gl.ZERO;
		}
		return 0;
	}
	
	// Set blend function
	public static setFunction(sfunc: number, dfunc: number)
	{
		let context = ContextPool.bind;
		if (context != null) {
			let gl = context.gl;
			gl.blendFunc(this.getFunction(sfunc), this.getFunction(dfunc));
		}
	}
	
	// Set separate blend functions
	public static setFunctionSeparate(srgb: number, drgb: number, salpha: number, dalpha: number)
	{
		let context = ContextPool.bind;
		if (context != null) {
			let gl = context.gl;
			gl.blendFuncSeparate(this.getFunction(srgb), this.getFunction(drgb),
				this.getFunction(salpha), this.getFunction(dalpha));
		}
	}
}