import { Matrix4, Vector2, Vector3 } from "../private/tuples";

export class Matrix
{
	/********************/
	/* STATIC FUNCTIONS */
	/********************/

	// Generate orthographic projection matrix 
	public static ortho(left: number, right: number, top: number, bottom: number,
		near: number, far: number): Matrix4
	{
		return [
			2 / (right - left), 0, 0, 0,
			0, 2 / (top - bottom), 0, 0,
			0, 0, -2 / (far - near), 0,
			-(right + left) / (right - left), -(top + bottom) / (top - bottom), 0, 1
		];
	}

	// Generate perspective projection matrix
	public static perspective(fov: number, width: number, height: number,
		near: number, far: number): Matrix4
	{
		let fovTan = 1 / Math.tan((fov * (Math.PI / 180)) / 2);
		let farMNear = 1 / (far - near);

		return [
			(1 / (width / height)) * fovTan, 0, 0, 0,
			0, fovTan, 0, 0,
			0, 0, -(far + near) * farMNear, -1,
			0, 0, -(2 * far * near) * farMNear, 0
		];
	}

	// Multiply matrix
	private static multiply(a: Matrix4, b: Matrix4): Matrix4
	{
		return [
			(a[0] * b[0] ) + (a[4] * b[1] ) + (a[8]  * b[2] ) + (a[12] * b[3] ),
			(a[1] * b[0] ) + (a[5] * b[1] ) + (a[9]  * b[2] ) + (a[13] * b[3] ),
			(a[2] * b[0] ) + (a[6] * b[1] ) + (a[10] * b[2] ) + (a[14] * b[3] ),
			(a[3] * b[0] ) + (a[7] * b[1] ) + (a[11] * b[2] ) + (a[15] * b[3] ),
			(a[0] * b[4] ) + (a[4] * b[5] ) + (a[8]  * b[6] ) + (a[12] * b[7] ),
			(a[1] * b[4] ) + (a[5] * b[5] ) + (a[9]  * b[6] ) + (a[13] * b[7] ),
			(a[2] * b[4] ) + (a[6] * b[5] ) + (a[10] * b[6] ) + (a[14] * b[7] ),
			(a[3] * b[4] ) + (a[7] * b[5] ) + (a[11] * b[6] ) + (a[15] * b[7] ),
			(a[0] * b[8] ) + (a[4] * b[9] ) + (a[8]  * b[10]) + (a[12] * b[11]),
			(a[1] * b[8] ) + (a[5] * b[9] ) + (a[9]  * b[10]) + (a[13] * b[11]),
			(a[2] * b[8] ) + (a[6] * b[9] ) + (a[10] * b[10]) + (a[14] * b[11]),
			(a[3] * b[8] ) + (a[7] * b[9] ) + (a[11] * b[10]) + (a[15] * b[11]),
			(a[0] * b[12]) + (a[4] * b[13]) + (a[8]  * b[14]) + (a[12] * b[15]),
			(a[1] * b[12]) + (a[5] * b[13]) + (a[9]  * b[14]) + (a[13] * b[15]),
			(a[2] * b[12]) + (a[6] * b[13]) + (a[10] * b[14]) + (a[14] * b[15]),
			(a[3] * b[12]) + (a[7] * b[13]) + (a[11] * b[14]) + (a[15] * b[15])];
	}

	// Get dot product of vectors
	private static vectorDot(v1: Vector3, v2: Vector3): number
	{
		return (v1[0] * v2[0]) + (v1[1] * v2[1]) + (v1[2] * v2[2]);
	}

	// Get cross product of vectors
	private static vectorCross(v1: Vector3, v2: Vector3): Vector3
	{
		return [
			(v1[1] * v2[2]) - (v1[2] * v2[1]),
			(v1[2] * v2[0]) - (v1[0] * v2[2]),
			(v1[0] * v2[1]) - (v1[1] * v2[0])
		];
	}

	// Normalize vector
	private static vectorNormalize(v: Vector3): Vector3
	{
		let length = Math.sqrt(this.vectorDot([v[0], v[1], v[2]], [v[0], v[1], v[2]]));
		return [v[0] / length, v[1] / length, v[2] / length];
	}

	// Generate 3D view matrix
	public static view3D(eye: Vector3, at: Vector3, up: Vector3): Matrix4
	{
		let z = this.vectorNormalize([eye[0] - at[0], eye[1] - at[1], eye[2] - at[2]]);
		let crossZ = this.vectorCross([up[0], up[1], up[2]], [z[0], z[1], z[2]]);
		let x = this.vectorNormalize([crossZ[0], crossZ[1], crossZ[2]]);
		let y = this.vectorCross([z[0], z[1], z[2]], [x[0], x[1], x[2]]);

		let xDotEye = -this.vectorDot([x[0], x[1], x[2]], [eye[0], eye[1], eye[2]]);
		let yDotEye = -this.vectorDot([y[0], y[1], y[2]], [eye[0], eye[1], eye[2]]);
		let zDotEye = -this.vectorDot([z[0], z[1], z[2]], [eye[0], eye[1], eye[2]]);

		return [
			x[0], x[1], x[2], 0,
			y[0], y[1], y[2], 0,
			z[0], z[1], z[2], 0,
			xDotEye, yDotEye, zDotEye, 1
		];
	}

	// Generate 2D view matrix
	public static view2D(view: Vector2): Matrix4
	{
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			view[0], view[1], 0, 1
		];
	}

	// Generate 3D model matrix
	public static model3D(translate: Vector3, rotate: Vector3, scale: Vector3): Matrix4
	{
		let sinX = Math.sin(rotate[0]);
		let cosX = Math.cos(rotate[0]);
		let sinY = Math.sin(rotate[1]);
		let cosY = Math.cos(rotate[1]);
		let sinZ = Math.sin(rotate[2]);
		let cosZ = Math.cos(rotate[2]);

		// Translate
		let matrix = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			translate[0], translate[1], translate[2], 1,
		] as Matrix4;

		// Rotate X
		matrix = this.multiply(matrix, [
			1, 0, 0, 0,
			0, cosX, sinX, 0,
			0, -sinX, cosX, 0,
			0, 0, 0, 1,
		]);

		// Rotate Y
		matrix = this.multiply(matrix, [
			cosY, 0, -sinY, 0,
			0, 1, 0, 0,
			sinY, 0, cosY, 0,
			0, 0, 0, 1,
		]);

		// Rotate Z
		matrix = this.multiply(matrix, [
			cosZ, sinZ, 0, 0,
			-sinZ, cosZ, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
		]);

		// Scale
		matrix = this.multiply(matrix, [
			scale[0], 0, 0, 0,
			0, scale[1], 0, 0,
			0, 0, scale[2], 0,
			0, 0, 0, 1,
		]);

		return matrix;
	}

	// Generate 2D model matrix
	public static model2D(translate: Vector2, rotate: number, scale: Vector2): Matrix4
	{
		let sin = Math.sin(rotate);
		let cos = Math.cos(rotate);

		// Translate
		let matrix = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			translate[0], translate[1], 0, 1,
		] as Matrix4;

		// Rotate
		matrix = this.multiply(matrix, [
			cos, sin, 0, 0,
			-sin, cos, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
		]);

		// Scale
		matrix = this.multiply(matrix, [
			scale[0], 0, 0, 0,
			0, scale[1], 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
		]);

		return matrix;
	}
}