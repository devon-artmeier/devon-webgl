export abstract class Vertex
{
	// Get raw data
	public getData?(): readonly number[][];

	// Get raw data length
	public getLength()
	{
		return this.getData().flat().length;
	}

	// Get attribute length
	public getAttributeLength(index: number): number
	{
		return this.getData()[index].length;
	}

	// Get number of attributes
	public getAttributeCount(): number
	{
		return this.getData().length;
	}
}