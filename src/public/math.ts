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
	
	// Generate blank matrix
	public static blankMatrix()
	{
		return new Matrix([
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]
		]);
	}
	
	// Generate orthographic projection matrix 
	public static orthoMatrix(l: number, r: number, t: number, b: number, n: number, f: number): Matrix
	{
		return new Matrix([
			[2/(r-l), 0, 0, 0],
			[0, 2/(t-b), 0, 0],
			[0, 0, -2/(f-n), 0],
			[-(r+l)/(r-l), -(t+b)/(t-b), 0, 1]]);
	}

	// Generate perspective projection matrix
	public static perspectiveMatrix(fov: number, w: number, h: number, n: number, f: number): Matrix
	{
		let ft = Math.tan(this.degToRad(fov)/2);
		return new Matrix([
			[1/((w/h)*ft), 0, 0, 0],
			[0, 1/ft, 0, 0],
			[0, 0, -(f+n)/(f-n), -1],
			[0, 0, -(2*f*n)/(f-n), 0]]);
	}

	// Generate "look at" view matrix
	public static lookAtMatrix(eyeX: number, eyeY: number, eyeZ: number,
		atX: number, atY: number, atZ: number, upX: number, upY: number, upZ: number)
	{
		let eye = new Vector3([eyeX, eyeY, eyeZ]);
		let at = new Vector3([atX, atY, atZ]);
		let up = new Vector3([upX, upY, upZ]);

		let z = eye.subtractVector(at).normalize();
		let x = up.cross(z).normalize();
		let	y = z.cross(x);

		return new Matrix([
			[x.v[0], x.v[1], x.v[2], 0],
			[y.v[0], y.v[1], y.v[2], 0],
			[z.v[0], z.v[1], z.v[2], 0],
			[-x.dot(eye), -y.dot(eye), -z.dot(eye), 1]
		]);
	}

	// Generate translation matrix
	public static translateMatrix(x: number, y: number, z: number): Matrix
	{
		return new Matrix([
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[x, y, z, 1],
		]);
	}

	// Generate 2D translation matrix
	public static translate2DMatrix(x: number, y: number)
	{
		return this.translateMatrix(x, y, 0);	
	}

	// Generate X rotation matrix
	public static rotateXMatrix(angle: number): Matrix
	{
		let s = Math.sin(angle);
		let c = Math.cos(angle);

		return new Matrix([
			[1,  0,  0,  0],
			[0,  c,  s,  0],
			[0, -s,  c,  0],
			[0,  0,  0,  1],
		]);
	}

	// Generate Y rotation matrix
	public static rotateYMatrix(angle: number): Matrix
	{
		let s = Math.sin(angle);
		let c = Math.cos(angle);

		return new Matrix([
			[c,  0, -s,  0],
			[0,  1,  0,  0],
			[s,  0,  c,  0],
			[0,  0,  0,  1],
		]);
	}

	// Generate Z rotation matrix
	public static rotateZMatrix(angle: number): Matrix
	{
		let s = Math.sin(angle);
		let c = Math.cos(angle);

		return new Matrix([
			[ c,  s,  0,  0],
			[-s,  c,  0,  0],
			[ 0,  0,  1,  0],
			[ 0,  0,  0,  1],
		]);
	}

	// Generate rotation matrix
	public static rotateMatrix(x: number, y: number, z: number): Matrix
	{
		return this.rotateZMatrix(z).multiply(this.rotateYMatrix(y).multiply(this.rotateXMatrix(x)));
	}

	// Generate 2D rotation matrix
	public static rotate2DMatrix(angle: number)
	{
		return this.rotateZMatrix(angle);	
	}

	// Generate scale matrix
	public static scaleMatrix(x: number, y: number, z: number)
	{
		return new Matrix([
			[x, 0, 0, 0],
			[0, y, 0, 0],
			[0, 0, z, 0],
			[0, 0, 0, 1],
		]);
	}

	// Generate X scale matrix
	public static scaleXMatrix(x: number)
	{
		return this.scaleMatrix(x, 1, 1);
	}

	// Generate Y scale matrix
	public static scaleYMatrix(y: number)
	{
		return this.scaleMatrix(1, y, 1);
	}

	// Generate Z scale matrix
	public static scaleZMatrix(z: number)
	{
		return this.scaleMatrix(1, 1, z);
	}

	// Generate 2D scale matrix
	public static scale2DMatrix(x: number, y: number)
	{
		return this.scaleMatrix(x, y, 1);	
	}
}