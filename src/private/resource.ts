import { Context } from "../components/context";

// Resource interface
export class Resource
{
	// Constructor
	protected constructor(protected _context: Context, public readonly id: string) { }
	
	// Delete
	delete?(): void;
}