import { Matrix4, Vector2, Vector3, Vector4 } from "./tuples";
import { Vector } from "./vector"

export class Matrix
{
	// Generate orthographic projection matrix 
	public static ortho(pos: Vector2<number>, res: Vector2<number>, z: Vector2<number>): Matrix4<number>
	{
		let l = pos[0];
		let r = pos[0] + res[0];
		let t = pos[1];
		let b = pos[1] + res[1];

		return [
			2 / (r - l), 0, 0, 0,
			0, 2 / (t - b), 0, 0,
			0, 0, -2 / (z[1] - z[0]), 0,
			-(r + l) / (r - l), -(t + b) / (t - b), 0, 1
		];
	}

	// Generate perspective projection matrix
	public static perspective(fov: number, res: Vector2<number>, z: Vector2<number>): Matrix4<number>
	{
		let fovTan = 1 / Math.tan((fov * (Math.PI / 180)) / 2);
		let farMNear = 1 / (z[1] - z[0]);

		return [
			(1 / (res[0] / res[1])) * fovTan, 0, 0, 0,
			0, fovTan, 0, 0,
			0, 0, -(z[1] + z[0]) * farMNear, -1,
			0, 0, -(2 * z[1] * z[0]) * farMNear, 0
		];
	}
	
	// Multiply matrix with 4D vector
	public static multiplyVector(m: Matrix4<number>, v: Vector4<number>): Vector4<number>
	{
		return [
			(m[0] * v[0]) + (m[4] * v[1]) + (m[8]  * v[2]) + (m[12] * v[3]),
			(m[1] * v[0]) + (m[5] * v[1]) + (m[9]  * v[2]) + (m[13] * v[3]),
			(m[2] * v[0]) + (m[6] * v[1]) + (m[10] * v[2]) + (m[14] * v[3]),
			(m[3] * v[0]) + (m[7] * v[1]) + (m[11] * v[2]) + (m[15] * v[3])
		];
	}

	// Multiply matrix with matrix
	public static multiply(a: Matrix4<number>, b: Matrix4<number>): Matrix4<number>
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
			(a[3] * b[12]) + (a[7] * b[13]) + (a[11] * b[14]) + (a[15] * b[15])
		];
	}

	// Generate 3D view matrix
	public static view3D(eye: Vector3<number>, at: Vector3<number>, up: Vector3<number>): Matrix4<number>
	{
		let z = Vector.normalize3([eye[0] - at[0], eye[1] - at[1], eye[2] - at[2]]);
		let crossZ = Vector.cross([up[0], up[1], up[2]], [z[0], z[1], z[2]]);
		let x = Vector.normalize3([crossZ[0], crossZ[1], crossZ[2]]);
		let y = Vector.cross([z[0], z[1], z[2]], [x[0], x[1], x[2]]);

		let xDotEye = -Vector.dot3([x[0], x[1], x[2]], [eye[0], eye[1], eye[2]]);
		let yDotEye = -Vector.dot3([y[0], y[1], y[2]], [eye[0], eye[1], eye[2]]);
		let zDotEye = -Vector.dot3([z[0], z[1], z[2]], [eye[0], eye[1], eye[2]]);

		return [
			x[0], x[1], x[2], 0,
			y[0], y[1], y[2], 0,
			z[0], z[1], z[2], 0,
			xDotEye, yDotEye, zDotEye, 1
		];
	}

	// Generate 2D view matrix
	public static view2D(view: Vector2<number>): Matrix4<number>
	{
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			view[0], view[1], 0, 1
		];
	}

	// Generate 3D translation matrix
	public static translate(translate: Vector3<number>): Matrix4<number>
	{
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			translate[0], translate[1], translate[2], 1,
		];
	}

	// Generate 2D translation matrix
	public static translate2D(translate: Vector2<number>): Matrix4<number>
	{
		return this.translate([translate[0], translate[1], 0]);
	}

	// Generate X translation matrix
	public static translateX(translate: number): Matrix4<number>
	{
		return this.translate([translate, 0, 0]);
	}

	// Generate Y translation matrix
	public static translateY(translate: number): Matrix4<number>
	{
		return this.translate([0, translate, 0]);
	}

	// Generate Z translation matrix
	public static translateZ(translate: number): Matrix4<number>
	{
		return this.translate([0, 0, translate]);
	}

	// Generate 3D rotation matrix
	public static rotate(angles: Vector3<number>): Matrix4<number>
	{
		let matrix = this.rotateX(angles[0]);
		matrix = this.multiply(matrix, this.rotateY(angles[1]));
		matrix = this.multiply(matrix, this.rotateZ(angles[2]));
		return matrix;
	}

	// Generate 2D rotation matrix
	public static rotate2D(angle: number): Matrix4<number>
	{
		return this.rotateZ(angle);
	}

	// Generate 3D X rotation matrix
	public static rotateX(angle: number): Matrix4<number>
	{
		let sin = Math.sin(angle);
		let cos = Math.cos(angle);

		return [
			1, 0, 0, 0,
			0, cos, sin, 0,
			0, -sin, cos, 0,
			0, 0, 0, 1,
		];
	}

	// Generate 3D Y rotation matrix
	public static rotateY(angle: number): Matrix4<number>
	{
		let sin = Math.sin(angle);
		let cos = Math.cos(angle);

		return [
			cos, 0, -sin, 0,
			0, 1, 0, 0,
			sin, 0, cos, 0,
			0, 0, 0, 1,
		];
	}

	// Generate 3D Z rotation matrix
	public static rotateZ(angle: number): Matrix4<number>
	{
		let sin = Math.sin(angle);
		let cos = Math.cos(angle);

		return [
			cos, sin, 0, 0,
			-sin, cos, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
		];
	}

	// Generate 3D scale matrix
	public static scale(scale: Vector3<number>): Matrix4<number>
	{
		return [
			scale[0], 0, 0, 0,
			0, scale[1], 0, 0,
			0, 0, scale[2], 0,
			0, 0, 0, 1,
		];
	}

	// Generate 2D scale matrix
	public static scale2D(scale: Vector2<number>): Matrix4<number>
	{
		return this.scale([scale[0], scale[1], 1]);
	}

	// Generate X scale matrix
	public static scaleX(scale: number): Matrix4<number>
	{
		return this.scale([scale, 1, 1]);
	}

	// Generate Y scale matrix
	public static scaleY(scale: number): Matrix4<number>
	{
		return this.scale([1, scale, 1]);
	}

	// Generate Z scale matrix
	public static scaleZ(scale: number): Matrix4<number>
	{
		return this.scale([1, 1, scale]);
	}

	// Generate 3D transformation matrix
	public static transform3D(translate: Vector3<number>, rotate: Vector3<number>, scale: Vector3<number>): Matrix4<number>
	{
		let matrix = this.translate(translate);
		matrix = this.multiply(matrix, this.rotate(rotate));
		matrix = this.multiply(matrix, this.scale(scale));
		return matrix;
	}

	// Generate 2D transformation matrix
	public static transform2D(translate: Vector2<number>, rotate: number, scale: Vector2<number>): Matrix4<number>
	{
		let matrix = this.translate2D(translate);
		matrix = this.multiply(matrix, this.rotate2D(rotate));
		matrix = this.multiply(matrix, this.scale2D(scale));
		return matrix;
	}
}