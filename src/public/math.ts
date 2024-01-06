import { Matrix } from "../private/matrix";
import { Vector3 } from "../private/vector";

export class WebGLMath
{
	// Convert degrees to radians
	public static degToRad(angle: number): number
	{
		return angle * (Math.PI / 180);
	}

	// Convert radians to degrees
	public static radToDeg(angle: number): number
	{
		return angle * (180 / Math.PI);
	}
	
	// Generate orthographic projection matrix 
	public static ortho(left: number, right: number, top: number, bottom: number,
		near: number, far: number): Float32Array
	{
		return new Float32Array([
			2 / (right - left), 0, 0, 0,
			0, 2 / (top - bottom), 0, 0,
			0, 0, -2 / (far - near), 0,
			-(right + left) / (right - left), -(top + bottom) / (top - bottom), 0, 1
		]);
	}

	// Generate perspective projection matrix
	public static perspective(fov: number, width: number, height: number,
		near: number, far: number): Float32Array
	{
		let fovTan = Math.tan(this.degToRad(fov)/2);
		return new Float32Array([
			1 / ((width / height) * fovTan), 0, 0, 0,
			0, 1 / fovTan, 0, 0,
			0, 0, -(far + near) / (far - near), -1,
			0, 0, -(2 * far * near) / (far - near), 0
		]);
	}

	// Generate 3D view matrix
	public static view3D(eyeX: number, eyeY: number, eyeZ: number,
		atX: number, atY: number, atZ: number, upX: number, upY: number, upZ: number): Float32Array
	{
		let eye = new Vector3([eyeX, eyeY, eyeZ]);
		let at = new Vector3([atX, atY, atZ]);
		let up = new Vector3([upX, upY, upZ]);

		let z = eye.subtractVector(at).normalize();
		let x = up.cross(z).normalize();
		let	y = z.cross(x);

		return new Float32Array([
			x.v[0], x.v[1], x.v[2], 0,
			y.v[0], y.v[1], y.v[2], 0,
			z.v[0], z.v[1], z.v[2], 0,
			-x.dot(eye), -y.dot(eye), -z.dot(eye), 1
		]);
	}

	// Generate 2D view matrix
	public static view2D(x: number, y: number): Float32Array
	{
		return new Float32Array([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			x, y, 0, 1
		]);
	}

	// Generate 3D model matrix
	public static model3D(transX: number, transY: number, transZ: number,
		rotateX: number, rotateY: number, rotateZ: number,
		scaleX: number, scaleY: number, scaleZ: number): Float32Array
	{
		let sinX = Math.sin(rotateX);
		let cosX = Math.cos(rotateX);
		let sinY = Math.sin(rotateY);
		let cosY = Math.cos(rotateY);
		let sinZ = Math.sin(rotateZ);
		let cosZ = Math.cos(rotateZ);

		// Translate
		let matrix = new Matrix([
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[transX, transY, transZ, 1],
		]);

		// Rotate X
		matrix = matrix.multiply(new Matrix([
			[1, 0, 0, 0],
			[0, cosX, sinX, 0],
			[0, -sinX, cosX, 0],
			[0, 0, 0, 1],
		]));

		// Rotate Y
		matrix = matrix.multiply(new Matrix([
			[cosY, 0, -sinY, 0],
			[0, 1, 0, 0],
			[sinY, 0, cosY, 0],
			[0, 0, 0, 1],
		]));

		// Rotate Z
		matrix = matrix.multiply(new Matrix([
			[cosZ, sinZ, 0, 0],
			[-sinZ, cosZ, 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1],
		]));

		// Scale
		matrix = matrix.multiply(new Matrix([
			[scaleX, 0, 0, 0],
			[0, scaleY, 0, 0],
			[0, 0, scaleZ, 0],
			[0, 0, 0, 1],
		]));

		return matrix.flat();
	}

	// Generate 2D model matrix
	public static model2D(transX: number, transY: number, rotate: number,
		scaleX: number, scaleY: number): Float32Array
	{
		let sin = Math.sin(rotate);
		let cos = Math.cos(rotate);

		// Translate
		let matrix = new Matrix([
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[transX, transY, 0, 1],
		]);

		// Rotate
		matrix = matrix.multiply(new Matrix([
			[cos, sin, 0, 0],
			[-sin, cos, 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1],
		]));

		// Scale
		matrix = matrix.multiply(new Matrix([
			[scaleX, 0, 0, 0],
			[0, scaleY, 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1],
		]));

		return matrix.flat();
	}
}