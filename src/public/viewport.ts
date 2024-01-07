import { Vector2 } from "./tuples";
import { ContextCollection } from "../private/context-collection";

export class Viewport
{
	// Set viewport
	public static set(pos: Vector2<number>, res: Vector2<number>)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.viewport(... pos, ... res);
		}
	}

	// Get viewport
	public static get(): readonly number[]
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			return gl.getParameter(gl.VIEWPORT);
		}
		return [0, 0, 0, 0];
	}
}