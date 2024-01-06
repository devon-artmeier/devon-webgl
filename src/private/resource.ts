import { Context } from "../public/context";

// Resource interface
export class Resource
{
	// Constructor
	protected constructor(protected _context: Context, public readonly id: string) { }
	
	// Bind
	public bind?(): void;
	
	// Unbind
	public unbind?(): void;
		
	// Delete
	public delete?(): void;
}