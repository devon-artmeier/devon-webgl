import { Resource } from "./resource";
import { ResourceManager } from "./resource-manager";

// WebGL context class
export class ContextObject extends Resource
{
	private static _contexts = new ResourceManager();
	
	private _gl: WebGL2RenderingContext;
	
	public readonly textures = new ResourceManager();
	public readonly shaders = new ResourceManager();
	public readonly vbos = new ResourceManager();
	public readonly ebos = new ResourceManager();
	public readonly vaos = new ResourceManager();
	public readonly fbos = new ResourceManager();
	
	get gl(): WebGL2RenderingContext { return this._gl; }
	get canvas(): HTMLCanvasElement { return this._canvas; }
	
	// Constructor
	constructor(private _canvas: HTMLCanvasElement, public readonly id: string)
	{
		super(null, id, id);
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
		this._gl = null;
		this._canvas = null;
	}
	
	// Create context
	public static create(id: string, canvas: HTMLCanvasElement)
	{
		this._contexts.add(id, new ContextObject(canvas, id));
	}
	
	// Get context
	public static get(id: string): ContextObject
	{
		return this._contexts.get(id) as ContextObject;
	}
	
	// Delete context
	public static delete(id: string)
	{
		this._contexts.delete(id);
	}
}