import { Vector4 } from "./vector";

export class Matrix
{
	// Constructor
	constructor(readonly m:
		[[number, number, number, number],
		 [number, number, number, number],
		 [number, number, number, number],
		 [number, number, number, number]]) { }
	
	// Flaten
	public flat(): Float32Array
	{
		return new Float32Array([
			this.m[0][0], this.m[0][1], this.m[0][2], this.m[0][3],
			this.m[1][0], this.m[1][1], this.m[1][2], this.m[1][3],
			this.m[2][0], this.m[2][1], this.m[2][2], this.m[2][3],
			this.m[3][0], this.m[3][1], this.m[3][2], this.m[3][3]
		]);
	}
	
	// Negate
	public negate(): Matrix
	{
		return new Matrix([
			[-this.m[0][0], -this.m[0][1], -this.m[0][2], -this.m[0][3]],
			[-this.m[1][0], -this.m[1][1], -this.m[1][2], -this.m[1][3]],
			[-this.m[2][0], -this.m[2][1], -this.m[2][2], -this.m[2][3]],
			[-this.m[3][0], -this.m[3][1], -this.m[3][2], -this.m[3][3]]]);
	}
	
	// Add matrix
	public add(b: Matrix): Matrix
	{
		return new Matrix([
			[this.m[0][0]+b.m[0][0], this.m[0][1]+b.m[0][1], this.m[0][2]+b.m[0][2], this.m[0][3]+b.m[0][3]],
			[this.m[1][0]+b.m[1][0], this.m[1][1]+b.m[1][1], this.m[1][2]+b.m[1][2], this.m[1][3]+b.m[1][3]],
			[this.m[2][0]+b.m[2][0], this.m[2][1]+b.m[2][1], this.m[2][2]+b.m[2][2], this.m[2][3]+b.m[2][3]],
			[this.m[3][0]+b.m[3][0], this.m[3][1]+b.m[3][1], this.m[3][2]+b.m[3][2], this.m[3][3]+b.m[3][3]]]);
	}
	
	// Subtract matrix
	public subtract(b: Matrix): Matrix
	{
		return new Matrix([
			[this.m[0][0]-b.m[0][0], this.m[0][1]-b.m[0][1], this.m[0][2]-b.m[0][2], this.m[0][3]-b.m[0][3]],
			[this.m[1][0]-b.m[1][0], this.m[1][1]-b.m[1][1], this.m[1][2]-b.m[1][2], this.m[1][3]-b.m[1][3]],
			[this.m[2][0]-b.m[2][0], this.m[2][1]-b.m[2][1], this.m[2][2]-b.m[2][2], this.m[2][3]-b.m[2][3]],
			[this.m[3][0]-b.m[3][0], this.m[3][1]-b.m[3][1], this.m[3][2]-b.m[3][2], this.m[3][3]-b.m[3][3]]]);
	}
	
	// Multiply matrix
	public multiply(b: Matrix): Matrix
	{
		return new Matrix([
			[(b.m[0][0]*this.m[0][0])+(b.m[0][1]*this.m[1][0])+(b.m[0][2]*this.m[2][0])+(b.m[0][3]*this.m[3][0]),
			 (b.m[0][0]*this.m[0][1])+(b.m[0][1]*this.m[1][1])+(b.m[0][2]*this.m[2][1])+(b.m[0][3]*this.m[3][1]),
			 (b.m[0][0]*this.m[0][2])+(b.m[0][1]*this.m[1][2])+(b.m[0][2]*this.m[2][2])+(b.m[0][3]*this.m[3][2]),
			 (b.m[0][0]*this.m[0][3])+(b.m[0][1]*this.m[1][3])+(b.m[0][2]*this.m[2][3])+(b.m[0][3]*this.m[3][3])],
			[(b.m[1][0]*this.m[0][0])+(b.m[1][1]*this.m[1][0])+(b.m[1][2]*this.m[2][0])+(b.m[1][3]*this.m[3][0]),
			 (b.m[1][0]*this.m[0][1])+(b.m[1][1]*this.m[1][1])+(b.m[1][2]*this.m[2][1])+(b.m[1][3]*this.m[3][1]),
			 (b.m[1][0]*this.m[0][2])+(b.m[1][1]*this.m[1][2])+(b.m[1][2]*this.m[2][2])+(b.m[1][3]*this.m[3][2]),
			 (b.m[1][0]*this.m[0][3])+(b.m[1][1]*this.m[1][3])+(b.m[1][2]*this.m[2][3])+(b.m[1][3]*this.m[3][3])],
			[(b.m[2][0]*this.m[0][0])+(b.m[2][1]*this.m[1][0])+(b.m[2][2]*this.m[2][0])+(b.m[2][3]*this.m[3][0]),
			 (b.m[2][0]*this.m[0][1])+(b.m[2][1]*this.m[1][1])+(b.m[2][2]*this.m[2][1])+(b.m[2][3]*this.m[3][1]),
			 (b.m[2][0]*this.m[0][2])+(b.m[2][1]*this.m[1][2])+(b.m[2][2]*this.m[2][2])+(b.m[2][3]*this.m[3][2]),
			 (b.m[2][0]*this.m[0][3])+(b.m[2][1]*this.m[1][3])+(b.m[2][2]*this.m[2][3])+(b.m[2][3]*this.m[3][3])],
			[(b.m[3][0]*this.m[0][0])+(b.m[3][1]*this.m[1][0])+(b.m[3][2]*this.m[2][0])+(b.m[3][3]*this.m[3][0]),
			 (b.m[3][0]*this.m[0][1])+(b.m[3][1]*this.m[1][1])+(b.m[3][2]*this.m[2][1])+(b.m[3][3]*this.m[3][1]),
			 (b.m[3][0]*this.m[0][2])+(b.m[3][1]*this.m[1][2])+(b.m[3][2]*this.m[2][2])+(b.m[3][3]*this.m[3][2]),
			 (b.m[3][0]*this.m[0][3])+(b.m[3][1]*this.m[1][3])+(b.m[3][2]*this.m[2][3])+(b.m[3][3]*this.m[3][3])]]);
	}
}