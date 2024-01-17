import { ResourceManager } from "./resource-manager";
import { Context } from "../public/context";

export class ContextPool
{
	public static readonly contexts: ResourceManager = new ResourceManager();
	public static bind: Context = null;

	// Get context
	public static get(id: string): Context
	{
		return this.contexts.get(id) as Context;
	}

	// Delete context
	public static delete(id: string)
	{
		if (this.bind?.id == id) {
			this.bind = null;
		}
		this.contexts.delete(id);
	}
}