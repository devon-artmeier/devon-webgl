import { Color } from "./color";
import { Condition, StencilOption } from "./enums";
import { Resource } from "../private/resource";
import { ResourceManager } from "../private/resource-manager";
import { ContextCollection } from "../private/context-collection";

export class Context extends Resource
{
	public readonly gl: WebGL2RenderingContext;
	public readonly textures = new ResourceManager();
	public readonly shaders = new ResourceManager();
	public readonly vbos = new ResourceManager();
	public readonly ebos = new ResourceManager();
	public readonly vaos = new ResourceManager();
	public readonly fbos = new ResourceManager();
	
	get canvas(): HTMLCanvasElement { return this._canvas; }
	
	/**************************/
	/* CLASS OBJECT FUNCTIONS */
	/**************************/
	
	// Constructor
	constructor(private _canvas: HTMLCanvasElement, id: string, manager: ResourceManager)
	{
		super(null, id, manager);

		this.gl = this._canvas?.getContext("webgl2",
			{ alpha: true, stencil: true, preserveDrawingBuffer: true });
	}

	// Delete
	public delete()
	{
		this.textures.clear();
		this.shaders.clear();
		this.vbos.clear();
		this.ebos.clear();
		this.vaos.clear();
		this.fbos.clear();
	}
	
	/********************/
	/* STATIC FUNCTIONS */
	/********************/

	// Create context
	public static create(id: string, canvas: HTMLCanvasElement)
	{
		let manager = ContextCollection.contexts;
		let context = new Context(canvas, id, manager);
		if (context.gl != null) {
			manager.add(id, new Context(canvas, id, manager));
		}
	}

	// Bind
	public static bind(id: string)
	{
		ContextCollection.bind(id);
	}
	
	// Clear
	public static clear(color: Color)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.clearColor(color.r, color.g, color.b, color.a);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
		}
	}

	// Set viewport
	public static setViewport(x: number, y: number, width: number, height: number)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.viewport(x, y, width, height);
		}
	}

	// Get viewport
	public static getViewport(): number[]
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			return gl.getParameter(gl.VIEWPORT);
		}
		return [0, 0, 0, 0];
	}
	
	// Enable blending
	public static enableBlend()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		}
	}
	
	// Disable blending
	public static disableBlend()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.disable(gl.BLEND);
		}
	}

	// Enable depth
	public static enableDepth()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.enable(gl.DEPTH_TEST);
		}
	}

	// Disable depth
	public static disableDepth()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.disable(gl.DEPTH_TEST);
		}
	}

	// Set depth function
	public static setDepthFunction(func: Condition)
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
	public static setDepthMask(enable: boolean)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.depthMask(enable);
		}
	}

	// Enable stencil testing
	public static enableStencil()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.enable(gl.STENCIL_TEST);
		}
	}
	
	// Disable stencil testing
	public static disableStencil()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.disable(gl.STENCIL_TEST);
		}
	}

	// Set stencil function
	public static setStencilFunction(func: Condition, ref: number, mask: number)
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
	public static setStencilOptions(sfail: StencilOption, dpfail: StencilOption, dppass: StencilOption)
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
	public static setStencilMask(mask: number)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.stencilMask(mask); 
		}
	}
	
	// Enable scissor test
	public static enableScissor()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.enable(gl.SCISSOR_TEST);
		}
	}

	// Disable scissor test
	public static disableScissor()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.disable(gl.SCISSOR_TEST);
		}
	}

	// Set scissor test region
	public static setScissor(x: number, y: number, width: number, height: number)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			let viewport = this.getViewport();
			gl.scissor(x, viewport[3] - height - y, width, height);
		}
	}
	
	// Delete context
	public static delete(id: string)
	{
		ContextCollection.delete(id);
	}
}