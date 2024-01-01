import { Texture } from "./texture";

// WebGL instance
export class WebGLInstance
{
	private _gl: WebGL2RenderingContext;
	
	// Constructor
	constructor(private _canvas: HTMLCanvasElement)
	{
		this._gl = this._canvas.getContext("webgl2");
		
		// Set up alpha blending
		this._gl.enable(this._gl.BLEND);
		this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA);
		
		// Initialize texture manager
		Texture.initialize(this._gl);
	}
}