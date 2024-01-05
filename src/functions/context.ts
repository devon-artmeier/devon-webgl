import { Color } from "../types/color";
import { Condition, StencilOption } from "../types/enums";
import { ContextCollection } from "../resources/context-collection";
import { Resource } from "../resources/resource";
import { ResourceManager } from "../resources/resource-manager";

export class Context extends Resource
{
	private readonly _gl: WebGL2RenderingContext;
	
	public readonly textures = new ResourceManager();
	public readonly shaders = new ResourceManager();
	public readonly vbos = new ResourceManager();
	public readonly ebos = new ResourceManager();
	public readonly vaos = new ResourceManager();
	public readonly fbos = new ResourceManager();
	
	get gl(): WebGL2RenderingContext { return this._gl; }
	get canvas(): HTMLCanvasElement { return this._canvas; }
	
	/**************************/
	/* CLASS OBJECT FUNCTIONS */
	/**************************/
	
	// Constructor
	constructor(private _canvas: HTMLCanvasElement, id: string)
	{
		super(null, id);
		this._gl = this._canvas.getContext("webgl2",
			{ alpha: true, stencil: true });
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
		ContextCollection._contexts.add(id, new Context(canvas, id));
	}
	
	// Clear
	public static clear(id: string, color: Color)
	{
		let gl = ContextCollection.get(id)?.gl;
		gl.clearColor(color.r, color.g, color.b, color.a);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
	}

	// Set viewport
	public static setViewport(id: string, x: number, y: number, width: number, height: number)
	{
		let gl = ContextCollection.get(id)?.gl;
		gl.viewport(x, y, width, height);
	}

	// Get viewport
	public static getViewport(id: string): number[]
	{
		let gl = ContextCollection.get(id)?.gl;
		return gl.getParameter(gl.VIEWPORT);
	}
	
	// Enable blending
	public static enableBlend(id: string)
	{
		let gl = ContextCollection.get(id)?.gl;
		gl.enable(gl.BLEND);
	}
	
	// Disable blending
	public static disableBlend(id: string)
	{
		let gl = ContextCollection.get(id)?.gl;
		gl.disable(gl.BLEND);
	}

	// Enable
	public static enableDepth(id: string)
	{
		let gl = ContextCollection.get(id)?.gl;
		gl.enable(gl.DEPTH_TEST); 
	}

	// Disable
	public static disableDepth(id: string)
	{
		let gl = ContextCollection.get(id)?.gl;
		gl.disable(gl.DEPTH_TEST); 
	}

	// Set depth function
	public static setDepthFunction(id: string, func: Condition)
	{
		let gl = ContextCollection.get(id)?.gl;
		gl.depthFunc([
			gl.ALWAYS, gl.NEVER, gl.EQUAL, gl.NOTEQUAL,
			gl.LESS, gl.LEQUAL, gl.GREATER, gl.GEQUAL
		][func]);
	}

	// Set depth mask
	public static setDepthMask(id: string, enable: boolean)
	{
		let gl = ContextCollection.get(id)?.gl;
		gl.depthMask(enable); 
	}

	// Enable stencil testing
	public static enableStencil(id: string)
	{
		let gl = ContextCollection.get(id)?.gl;
		gl.enable(gl.STENCIL_TEST); 
	}
	
	// Disable stencil testing
	public static disableStencil(id: string)
	{
		let gl = ContextCollection.get(id)?.gl;
		gl.disable(gl.STENCIL_TEST); 
	}

	// Set stencil function
	public static setStencilFunction(id: string, func: Condition, ref: number, mask: number)
	{
		let gl = ContextCollection.get(id)?.gl;
		gl.stencilFunc([
			gl.ALWAYS, gl.NEVER, gl.EQUAL, gl.NOTEQUAL,
			gl.LESS, gl.LEQUAL, gl.GREATER, gl.GEQUAL
		][func], ref, mask);
	}

	// Set stencil options
	public static setStencilOptions(id: string, sfail: StencilOption, dpfail: StencilOption, dppass: StencilOption)
	{
		let gl = ContextCollection.get(id)?.gl;
		let ops = [
			gl.KEEP, gl.ZERO, gl.REPLACE, gl.INCR,
			gl.INCR_WRAP, gl.DECR, gl.DECR_WRAP, gl.INVERT
		];
		gl.stencilOp(ops[sfail], ops[dpfail], ops[dppass]);
	}
	
	// Set stencil mask
	public static setStencilMask(id: string, mask: number)
	{
		let gl = ContextCollection.get(id)?.gl;
		gl.stencilMask(mask); 
	}
	
	// Delete context
	public static delete(id: string)
	{
		ContextCollection._contexts.delete(id);
	}
}