import { Matrix } from "./matrix";

export class Vector2
{
	// Constructor
	constructor(readonly v: [number, number]) { }
	
	// Get dot product with vector
	public dot(b: Vector2): number
	{
		return (this.v[0]*b.v[0])+(this.v[1]*b.v[1]);
	}
	
	// Get length
	public length(): number
	{
		return Math.sqrt(this.dot(this));
	}
	
	// Normalize
	public normalize(): Vector2
	{
		return this.divideNumber(this.length());
	}
	
	// Negate
	public negate(): Vector2
	{
		return new Vector2([-this.v[0], -this.v[1]]);
	}
	
	// Add vector
	public addVector(b: Vector2): Vector2
	{
		return new Vector2([this.v[0]+b.v[0], this.v[1]+b.v[1]]);
	}
	
	// Subtract vector
	public subtractVector(b: Vector2): Vector2
	{
		return new Vector2([this.v[0]-b.v[0], this.v[1]-b.v[1]]);
	}
	
	// Multiply vector
	public multiplyVector(b: Vector2): Vector2
	{
		return new Vector2([this.v[0]*b.v[0], this.v[1]*b.v[1]]);
	}
	
	// Divide vector
	public divideVector(b: Vector2): Vector2
	{
		return new Vector2([this.v[0]/b.v[0], this.v[1]/b.v[1]]);
	}
	
	// Add number
	public addNumber(b: number): Vector2
	{
		return new Vector2([this.v[0]+b, this.v[1]+b]);
	}
	
	// Subtract number
	public subtractNumber(b: number): Vector2
	{
		return new Vector2([this.v[0]-b, this.v[1]-b]);
	}
	
	// Multiply number
	public multiplyNumber(b: number): Vector2
	{
		return new Vector2([this.v[0]*b, this.v[1]*b]);
	}
	
	// Divide number
	public divideNumber(b: number): Vector2
	{
		return new Vector2([this.v[0]/b, this.v[1]/b]);
	}
}

export class Vector3
{
	// Constructor
	constructor(readonly v: [number, number, number]) { }
	
	// Get dot product with vector
	public dot(b: Vector3): number
	{
		return (this.v[0]*b.v[0])+(this.v[1]*b.v[1])+(this.v[2]*b.v[2]);
	}
	
	// Get cross product with vector
	public cross(b: Vector3): Vector3
	{
		return new Vector3([
			(this.v[1]*b.v[2])-(this.v[2]*b.v[1]),
			(this.v[2]*b.v[0])-(this.v[0]*b.v[2]),
			(this.v[0]*b.v[1])-(this.v[1]*b.v[0])
		]);
	}
	
	// Get length
	public length(): number
	{
		return Math.sqrt(this.dot(this));
	}
	
	// Normalize
	public normalize(): Vector3
	{
		return this.divideNumber(this.length());
	}
	
	// Negate
	public negate(): Vector3
	{
		return new Vector3([-this.v[0], -this.v[1], -this.v[2]]);
	}
	
	// Add vector
	public addVector(b: Vector3): Vector3
	{
		return new Vector3([this.v[0]+b.v[0], this.v[1]+b.v[1], this.v[2]+b.v[2]]);
	}
	
	// Subtract vector
	public subtractVector(b: Vector3): Vector3
	{
		return new Vector3([this.v[0]-b.v[0], this.v[1]-b.v[1], this.v[2]-b.v[2]]);
	}
	
	// Multiply vector
	public multiplyVector(b: Vector3): Vector3
	{
		return new Vector3([this.v[0]*b.v[0], this.v[1]*b.v[1], this.v[2]*b.v[2]]);
	}
	
	// Divide vector
	public divideVector(b: Vector3): Vector3
	{
		return new Vector3([this.v[0]/b.v[0], this.v[1]/b.v[1], this.v[2]/b.v[2]]);
	}
	
	// Add number
	public addNumber(b: number): Vector3
	{
		return new Vector3([this.v[0]+b, this.v[1]+b, this.v[2]+b]);
	}
	
	// Subtract number
	public subtractNumber(b: number): Vector3
	{
		return new Vector3([this.v[0]-b, this.v[1]-b, this.v[2]-b]);
	}
	
	// Multiply number
	public multiplyNumber(b: number): Vector3
	{
		return new Vector3([this.v[0]*b, this.v[1]*b, this.v[2]*b]);
	}
	
	// Divide number
	public divideNumber(b: number): Vector3
	{
		return new Vector3([this.v[0]/b, this.v[1]/b, this.v[2]/b]);
	}
}

export class Vector4
{
	// Constructor
	constructor(readonly v: [number, number, number, number]) { }
	
	// Get dot product with vector
	public dot(b: Vector4): number
	{
		return (this.v[0]*b.v[0])+(this.v[1]*b.v[1])+(this.v[2]*b.v[2])+(this.v[3]*b.v[3]);
	}
	
	// Get length
	public length(): number
	{
		return Math.sqrt(this.dot(this));
	}
	
	// Normalize
	public normalize(): Vector4
	{
		return this.divideNumber(this.length());
	}
	
	// Negate
	public negate(): Vector4
	{
		return new Vector4([-this.v[0], -this.v[1], -this.v[2], -this.v[3]]);
	}
	
	// Add vector
	public addVector(b: Vector4): Vector4
	{
		return new Vector4([this.v[0]+b.v[0], this.v[1]+b.v[1], this.v[2]+b.v[2], this.v[3]+b.v[3]]);
	}
	
	// Subtract vector
	public subtractVector(b: Vector4): Vector4
	{
		return new Vector4([this.v[0]-b.v[0], this.v[1]-b.v[1], this.v[2]-b.v[2], this.v[3]-b.v[3]]);
	}
	
	// Multiply vector
	public multiplyVector(b: Vector4): Vector4
	{
		return new Vector4([this.v[0]*b.v[0], this.v[1]*b.v[1], this.v[2]*b.v[2], this.v[3]*b.v[3]]);
	}
	
	// Divide vector
	public divideVector(b: Vector4): Vector4
	{
		return new Vector4([this.v[0]/b.v[0], this.v[1]/b.v[1], this.v[2]/b.v[2], this.v[3]/b.v[3]]);
	}
	
	// Add number
	public addNumber(b: number): Vector4
	{
		return new Vector4([this.v[0]+b, this.v[1]+b, this.v[2]+b, this.v[3]+b]);
	}
	
	// Subtract number
	public subtractNumber(b: number): Vector4
	{
		return new Vector4([this.v[0]-b, this.v[1]-b, this.v[2]-b, this.v[3]-b]);
	}
	
	// Multiply number
	public multiplyNumber(b: number): Vector4
	{
		return new Vector4([this.v[0]*b, this.v[1]*b, this.v[2]*b, this.v[3]*b]);
	}
	
	// Divide number
	public divideNumber(b: number): Vector4
	{
		return new Vector4([this.v[0]/b, this.v[1]/b, this.v[2]/b, this.v[3]/b]);
	}
	
	// Multiply with maxtrix
	public multiplyMatrix(b: Matrix): Vector4
	{
		return new Vector4([
			(this.v[0]*b.m[0][0])+(this.v[1]*b.m[1][0])+(this.v[2]*b.m[2][0])+(this.v[3]*b.m[3][0]),
			(this.v[0]*b.m[0][1])+(this.v[1]*b.m[1][1])+(this.v[2]*b.m[2][1])+(this.v[3]*b.m[3][1]),
			(this.v[0]*b.m[0][2])+(this.v[1]*b.m[1][2])+(this.v[2]*b.m[2][2])+(this.v[3]*b.m[3][2]),
			(this.v[0]*b.m[0][3])+(this.v[1]*b.m[1][3])+(this.v[2]*b.m[2][3])+(this.v[3]*b.m[3][3])
		]);
	}
}