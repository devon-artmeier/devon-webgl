// Resource interface
export abstract class Resource
{
	public poolID: string;
	public resourceID: string;
	
	constructor(protected _gl: WebGL2RenderingContext) { }
	
	public delete?(): void;
}