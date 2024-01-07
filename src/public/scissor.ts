import { Vector2 } from "./tuples";
import { ContextPool } from "../private/context-pool";
import { Viewport } from "./viewport";

export class Scissor
{
	// Enable scissor test
	public static enable()
	{
		let context = ContextPool.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.enable(gl.SCISSOR_TEST);
		}
	}

	// Disable scissor test
	public static disable()
	{
		let context = ContextPool.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.disable(gl.SCISSOR_TEST);
		}
	}

	// Set scissor test region
	public static setRegion(pos: Vector2<number>, res: Vector2<number>)
	{
		let context = ContextPool.getBind();
		if (context != null) {
			let gl = context.gl;
			let viewport = Viewport.get();
			gl.scissor(pos[0], viewport[3] - pos[1] - pos[0], ... res);
		}
	}
}