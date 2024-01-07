import { ContextCollection } from "../private/context-collection";

export enum BlendFunc
{
	Zero,
	One,
	SrcColor,
	OneMinusSrcColor,
	DestColor,
	OneMinusDestColor,
	SrcAlpha,
	OneMinusSrcAlpha,
	DestAlpha,
	OneMinusDestAlpha,
	ConstantColor,
	OneMinusConstantColor,
	ConstantAlpha,
	OneMinusConstantAlpha
}

export class Blend
{
	// Enable blending
	public static enable()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.enable(gl.BLEND);
		}
	}

	// Disable blending
	public static disable()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.disable(gl.BLEND);
		}
	}

	// Get blend function
	private static getFunction(func: BlendFunc): number
	{
		let context = ContextCollection.getBind();
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
	public static setFunction(sfunc: BlendFunc, dfunc: BlendFunc)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.blendFunc(this.getFunction(sfunc), this.getFunction(dfunc));
		}
	}
	
	// Set separate blend functions
	public static setFunctionSeparate(srgb: BlendFunc, drgb: BlendFunc, salpha: BlendFunc, dalpha: BlendFunc)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.blendFuncSeparate(this.getFunction(srgb), this.getFunction(drgb),
				this.getFunction(salpha), this.getFunction(dalpha));
		}
	}
}