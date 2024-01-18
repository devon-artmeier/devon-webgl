/**
 * A class that represents a vertex.
 */
export abstract class Vertex
{
	/**
	 * Get raw vertex data.
	 * 
	 * @returns Raw vertex data.
	 */
	public getData?(): readonly number[][];

	/**
	 * Get raw vertex data length.
	 * 
	 * @returns Raw vertex data length.
	 */
	public getLength()
	{
		return this.getData().flat().length;
	}

	/**
	 * Get vertex attribute length.
	 * 
	 * @param index Vertex attribute index.
	 * @returns Vertex attribute length.
	 */
	public getAttributeLength(index: number): number
	{
		return this.getData()[index].length;
	}

	/**
	 * Get number of vertex attributes.
	 * 
	 * @returns Number of vertex attributes.
	 */
	public getAttributeCount(): number
	{
		return this.getData().length;
	}
}