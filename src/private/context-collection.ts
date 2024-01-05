import { ResourceManager } from "./resource-manager";
import { Context } from "../public/context";

export class ContextCollection
{
	public static _contexts = new ResourceManager();

	// Get context
	public static get(id: string): Context
	{
		return this._contexts.get(id) as Context;
	}
}