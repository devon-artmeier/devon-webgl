import { Condition } from "./enums";
import { ContextCollection } from "../private/context-collection";

export class Depth
{
	// Enable depth
	public static enable()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.enable(gl.DEPTH_TEST);
		}
	}

	// Disable depth
	public static disable()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.disable(gl.DEPTH_TEST);
		}
	}

	// Set depth function
	public static setFunction(func: Condition)
	{
		let context = ContextCollection.getBind();
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
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.depthMask(enable);
		}
	}
}