import { ContextPool } from "../private/context-pool";

export class Cull
{
	// Cull faces
	public static readonly Front = 0;
	public static readonly Back = 1;
	public static readonly FrontBack = 1;

	// Front faces
	public static readonly Clockwise = 0;
	public static readonly CounterClockwise = 1;

	// Enable culling
	public static enable()
	{
		let context = ContextPool.bind;
		if (context != null) {
			let gl = context.gl;
			gl.enable(gl.CULL_FACE);
		}
	}

	// Disable culling
	public static disable()
	{
		let context = ContextPool.bind;
		if (context != null) {
			let gl = context.gl;
			gl.disable(gl.CULL_FACE);
		}
	}

	// Set cull face
	public static setFace(face: number)
	{
		let context = ContextPool.bind;
		if (context != null) {
			let gl = context.gl;
			gl.cullFace([gl.FRONT, gl.BACK, gl.FRONT_AND_BACK][face]);
		}
	}

	// Set front face
	public static setFront(face: number)
	{
		let context = ContextPool.bind;
		if (context != null) {
			let gl = context.gl;
			gl.frontFace([gl.CW, gl.CCW][face]);
		}
	}
}