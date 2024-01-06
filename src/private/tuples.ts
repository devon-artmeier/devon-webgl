// 2x2 matrix
export type Matrix2 = [
	m00: number, m01: number,
	m10: number, m11: number];

// 3x3 matrix
export type Matrix3 = [
	m00: number, m01: number, m02: number,
	m10: number, m11: number, m12: number,
	m20: number, m21: number, m22: number];

// 4x4 matrix
export type Matrix4 = [
	m00: number, m01: number, m02: number, m03: number,
	m10: number, m11: number, m12: number, m13: number,
	m20: number, m21: number, m22: number, m23: number,
	m30: number, m31: number, m32: number, m33: number];

// 2 element vector
export type Vector2 = [
	v0: number, v1: number
]

// 3 element vector
export type Vector3 = [
	v0: number, v1: number, v2: number
]

// 4 element vector
export type Vector4 = [
	v0: number, v1: number, v2: number, v3: number
]