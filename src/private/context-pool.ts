import { ResourceManager } from "./resource-manager";
import { Context } from "../public/context";

export class ContextPool
{
	public static readonly contexts = new ResourceManager();
	private static _bind: Context = null;

	// Get context
	public static get(id: string): Context
	{
		return this.contexts.get(id) as Context;
	}

	// Get bound context
	public static getBind()
	{
		return this._bind;
	}

	// Bind context
	public static bind(id: string)
	{
		this._bind = this.get(id);
	}

	// Unbind context
	public static unbind()
	{
		this._bind = null;
	}

	// Delete context
	public static delete(id: string)
	{
		if (this._bind?.id == id) {
			this.unbind();
		}
		this.contexts.delete(id);
	}
}