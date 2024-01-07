import { Condition } from "./enums";
import { ContextCollection } from "../private/context-collection";

export enum StencilOption
{
	Keep,
	Zero,
	Replace,
	Increase,
	IncreaseWrap,
	Decrease,
	DecreaseWrap,
	Invert
}

export class Stencil
{

	// Enable stencil testing
	public static enable()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.enable(gl.STENCIL_TEST);
		}
	}
	
	// Disable stencil testing
	public static disable()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.disable(gl.STENCIL_TEST);
		}
	}

	// Set stencil function
	public static setFunction(func: Condition, ref: number, mask: number)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.stencilFunc([
				gl.ALWAYS, gl.NEVER, gl.EQUAL, gl.NOTEQUAL,
				gl.LESS, gl.LEQUAL, gl.GREATER, gl.GEQUAL
			][func], ref, mask);
		}
	}

	// Set stencil options
	public static setOptions(sfail: StencilOption, dpfail: StencilOption, dppass: StencilOption)
	{
		let context = ContextCollection.getBind();
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
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.stencilMask(mask); 
		}
	}
}