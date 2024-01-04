import { ContextObject } from "./context";

// Resource interface
export class Resource
{
	// Constructor
	protected constructor(protected _context: ContextObject, public readonly id: string) { }
	
	// Delete
	delete?(): void;
}