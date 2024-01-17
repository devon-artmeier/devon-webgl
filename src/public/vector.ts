import { Matrix4, Vector2, Vector3, Vector4 } from "./tuples";
import { Matrix } from "./matrix"

export class Vector
{
	// Convert 2D vector to 3D vector
	public static convert2To3(v: Vector2<number>, val: number): Vector3<number>
	{
		return [v[0], v[1], val];
	}
	
	// Convert 2D vector to 4D vector
	public static convert2To4(v: Vector2<number>, val1: number, val2: number): Vector4<number>
	{
		return [v[0], v[1], val1, val2];
	}
	
	// Convert 3D vector to 4D vector
	public static convert3To4(v: Vector3<number>, val: number): Vector4<number>
	{
		return [v[0], v[1], v[2], val];
	}
	
	// Get 2D vector length
	public static length2(v: Vector2<number>): number
	{
		return Math.sqrt(Vector.dot2(v, v));
	}
	
	// Get 2D vector length
	public static length3(v: Vector3<number>): number
	{
		return Math.sqrt(Vector.dot3(v, v));
	}
	
	// Get 2D vector length
	public static length4(v: Vector4<number>): number
	{
		return Math.sqrt(Vector.dot4(v, v));
	}
	
	// Normalize 2D vector
	public static normalize2(v: Vector2<number>): Vector2<number>
	{
		let length = this.length2(v);
		return [v[0] / length, v[1] / length];
	}
	
	// Normalize 3D vector
	public static normalize3(v: Vector3<number>): Vector3<number>
	{
		let length = this.length3(v);
		return [v[0] / length, v[1] / length, v[2] / length];
	}
	
	// Normalize 4D vector
	public static normalize4(v: Vector4<number>): Vector4<number>
	{
		let length = this.length4(v);
		return [v[0] / length, v[1] / length, v[2] / length, v[3] / length];
	}
	
	// Get dot product of 2D vectors
	public static dot2(v1: Vector2<number>, v2: Vector2<number>): number
	{
		return (v1[0] * v2[0]) + (v1[1] * v2[1]);
	}
	
	// Get dot product of 3D vectors
	public static dot3(v1: Vector3<number>, v2: Vector3<number>): number
	{
		return (v1[0] * v2[0]) + (v1[1] * v2[1]) + (v1[2] * v2[2]);
	}
	
	// Get dot product of 4D vectors
	public static dot4(v1: Vector4<number>, v2: Vector4<number>): number
	{
		return (v1[0] * v2[0]) + (v1[1] * v2[1]) + (v1[2] * v2[2]) + (v1[3] * v2[3]);
	}
	
	
	// Get cross product of 3D vectors
	public static cross(v1: Vector3<number>, v2: Vector3<number>): Vector3<number>
	{
		return [
			(v1[1] * v2[2]) - (v1[2] * v2[1]),
			(v1[2] * v2[0]) - (v1[0] * v2[2]),
			(v1[0] * v2[1]) - (v1[1] * v2[0])
		];
	}
	
	// Multiply 4D vector with matrix
	public static multiply4Matrix(v: Vector4<number>, m: Matrix4<number>): Vector4<number>
	{
		return [
			(m[0] * v[0]) + (m[4] * v[1]) + (m[8]  * v[2]) + (m[12] * v[3]),
			(m[1] * v[0]) + (m[5] * v[1]) + (m[9]  * v[2]) + (m[13] * v[3]),
			(m[2] * v[0]) + (m[6] * v[1]) + (m[10] * v[2]) + (m[14] * v[3]),
			(m[3] * v[0]) + (m[7] * v[1]) + (m[11] * v[2]) + (m[15] * v[3])
		];
	}
}