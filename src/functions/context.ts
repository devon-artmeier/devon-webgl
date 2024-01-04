import { ContextObject } from "../resources/context";

export class Context
{
	// Create context
	public static create(id: string, canvas: HTMLCanvasElement)
	{
		ContextObject.create(id, canvas);
	}
	
	// Delete context
	public static delete(id: string)
	{
		ContextObject.delete(id);
	}
}