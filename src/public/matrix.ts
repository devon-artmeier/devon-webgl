export class Matrix
{
	/********************/
	/* STATIC FUNCTIONS */
	/********************/

	// Generate orthographic projection matrix 
	public static ortho(left: number, right: number, top: number, bottom: number,
		near: number, far: number): readonly number[]
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
		near: number, far: number): readonly number[]
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
	private static multiply(a: readonly number[], b: readonly number[]): number[]
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
	private static vectorDot(x1: number, y1: number, z1: number,
		x2: number, y2: number, z2: number): number
	{
		return (x1 * x2) + (y1 * y2) + (z1 * z2);
	}

	// Get cross product of vectors
	private static vectorCross(x1: number, y1: number, z1: number,
		x2: number, y2: number, z2: number): readonly number[]
	{
		return [
			(y1 * z2) - (z1 * y2),
			(z1 * x2) - (x1 * z2),
			(x1 * y2) - (y1 * x2)
		];
	}

	// Normalize vector
	private static vectorNormalize(x: number, y: number, z: number): readonly number[]
	{
		let length = Math.sqrt(this.vectorDot(x, y, z, x, y, z));
		return [x / length, y / length, z / length];
	}

	// Generate 3D view matrix
	public static view3D(eyeX: number, eyeY: number, eyeZ: number,
		atX: number, atY: number, atZ: number,
		upX: number, upY: number, upZ: number): readonly number[]
	{
		let z = this.vectorNormalize(eyeX - atX, eyeY - atY, eyeZ - atZ);
		let crossZ = this.vectorCross(upX, upY, upZ, z[0], z[1], z[2]);
		let x = this.vectorNormalize(crossZ[0], crossZ[1], crossZ[2]);
		let y = this.vectorCross(z[0], z[1], z[2], x[0], x[1], x[2]);

		let xDotEye = -this.vectorDot(x[0], x[1], x[2], eyeX, eyeY, eyeZ);
		let yDotEye = -this.vectorDot(y[0], y[1], y[2], eyeX, eyeY, eyeZ);
		let zDotEye = -this.vectorDot(z[0], z[1], z[2], eyeX, eyeY, eyeZ);

		return [
			x[0], x[1], x[2], 0,
			y[0], y[1], y[2], 0,
			z[0], z[1], z[2], 0,
			xDotEye, yDotEye, zDotEye, 1
		];
	}

	// Generate 2D view matrix
	public static view2D(x: number, y: number): readonly number[]
	{
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			x, y, 0, 1
		];
	}

	// Generate 3D model matrix
	public static model3D(transX: number, transY: number, transZ: number,
		rotateX: number, rotateY: number, rotateZ: number,
		scaleX: number, scaleY: number, scaleZ: number): readonly number[]
	{
		let sinX = Math.sin(rotateX);
		let cosX = Math.cos(rotateX);
		let sinY = Math.sin(rotateY);
		let cosY = Math.cos(rotateY);
		let sinZ = Math.sin(rotateZ);
		let cosZ = Math.cos(rotateZ);

		// Translate
		let matrix = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			transX, transY, transZ, 1,
		];

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
			scaleX, 0, 0, 0,
			0, scaleY, 0, 0,
			0, 0, scaleZ, 0,
			0, 0, 0, 1,
		]);

		return matrix;
	}

	// Generate 2D model matrix
	public static model2D(transX: number, transY: number, rotate: number,
		scaleX: number, scaleY: number): readonly number[]
	{
		let sin = Math.sin(rotate);
		let cos = Math.cos(rotate);

		// Translate
		let matrix = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			transX, transY, 0, 1,
		];

		// Rotate
		matrix = this.multiply(matrix, [
			cos, sin, 0, 0,
			-sin, cos, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
		]);

		// Scale
		matrix = this.multiply(matrix, [
			scaleX, 0, 0, 0,
			0, scaleY, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
		]);

		return matrix;
	}
}