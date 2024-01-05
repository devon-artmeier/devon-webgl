import { ResourceManager } from "./resource-manager"
import { Context } from "../public/context";

// Resource interface
export class Resource
{
	private _tempBind: boolean = false;
	
	// Constructor
	protected constructor(protected _context: Context, public readonly id: string,
		protected _manager: ResourceManager) { }
		
	// Temporary bind
	public tempBind()
	{
		if (!this._manager.checkBind(this)) {
			this.bind();
		}
		this._tempBind = true;
	}
	
	// Temporary unbind
	public tempUnbind()
	{
		if (this._tempBind) {
			this._tempBind = false;
			this._manager.rebind();
		}
	}
	
	// Bind
	bind?(): void;
	
	// Unbind
	unbind?(): void;
		
	// Delete
	delete?(): void;
}