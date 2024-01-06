import { Resource } from "./resource";

// Resource manager class
export class ResourceManager
{
	private _pool = new Map<string, Resource>();
	private _bind: Resource;
	
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
	
	// Bind
	public bind(resourceID: string)
	{
		let resource = this._pool.get(resourceID);
		if (resource != null && this._bind != resource) {
			this._bind = resource;
			resource.bind();
		}
	}
	
	// Unbind resource
	public unbind(resourceID: string)
	{
		let resource = this._pool.get(resourceID);
		if (resource != null && this._bind == resource) {
			this._bind = null;
			resource.unbind();
		}
	}
	
	// Unbind
	public unbindCurrent()
	{
		if (this._bind != null) {
			this._bind.unbind();
			this._bind = null;
		}
	}
	
	// Check bind
	public checkBind(resource: Resource)
	{
		return this._bind == resource;
	}

	// Rebind
	public rebind()
	{
		this._bind?.bind();
	}
}