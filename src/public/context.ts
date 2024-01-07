import { Vector4 } from "./tuples";
import { Resource } from "../private/resource";
import { ResourceManager } from "../private/resource-manager";
import { ContextPool } from "../private/context-pool";

export class Context extends Resource
{
	public readonly gl: WebGL2RenderingContext;
	public readonly textures = new ResourceManager();
	public readonly shaders = new ResourceManager();
	public readonly meshes = new ResourceManager();
	public readonly binds = new Map<string, Resource>();
	
	/**************************/
	/* CLASS OBJECT FUNCTIONS */
	/**************************/
	
	// Constructor
	constructor(public readonly canvas: HTMLCanvasElement, id: string)
	{
		super(null, id);

		this.gl = this.canvas?.getContext("webgl2",
			{ alpha: true, stencil: true, preserveDrawingBuffer: true });

		this.binds.set("texture", null);
		this.binds.set("shader", null);
		this.binds.set("framebuffer", null);
	}

	// Delete
	public delete()
	{
		this.textures.clear();
		this.shaders.clear();
		this.meshes.clear();
	}
	
	/********************/
	/* STATIC FUNCTIONS */
	/********************/

	// Create context
	public static create(id: string, canvas: HTMLCanvasElement)
	{
		let manager = ContextPool.contexts;
		let context = new Context(canvas, id);
		if (context.gl != null) {
			manager.add(id, new Context(canvas, id));
		}
	}

	// Bind
	public static bind(id: string)
	{
		ContextPool.bind(id);
	}
	
	// Clear
	public static clear(color: Vector4<number>)
	{
		let context = ContextPool.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.clearColor(... color);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
		}
	}
	
	// Delete context
	public static delete(id: string)
	{
		ContextPool.delete(id);
	}
}