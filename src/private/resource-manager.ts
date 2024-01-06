import { Resource } from "./resource";

// Resource manager class
export class ResourceManager
{
	public currentBind: Resource;
	
	private _pool = new Map<string, Resource>();
	
	// Add resource to pool
	public add(resourceID: string, resource: Resource)
	{
		if (this._pool.has(resourceID)) {
			this._pool.get(resourceID).delete();
			this._pool.delete(resourceID);
		}
		this._pool.set(resourceID, resource);
	}
	
	// Check if resource pool has a resource
	public check(resourceID: string): boolean
	{
		return this._pool.has(resourceID);
	}
	
	// Get resource from pool
	public get(resourceID: string): Resource
	{
		return this._pool.get(resourceID);
	}

	// Delete resource
	public delete(resourceID: string)
	{
		if (this.check(resourceID)) {
			let resource = this._pool.get(resourceID);
			resource.delete();
			this._pool.delete(resourceID);
		}
	}
	
	// Delete all resources
	public clear()
	{
		for (const [id, resource] of this._pool.entries()) {
			resource.delete();
		}
		this._pool.clear();
	}
}