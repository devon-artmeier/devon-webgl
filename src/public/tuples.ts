// 2x2 matrix
export type Matrix2<T> = [
	m00: T, m01: T,
	m10: T, m11: T];

// 3x3 matrix
export type Matrix3<T> = [
	m00: T, m01: T, m02: T,
	m10: T, m11: T, m12: T,
	m20: T, m21: T, m22: T];

// 4x4 matrix
export type Matrix4<T> = [
	m00: T, m01: T, m02: T, m03: T,
	m10: T, m11: T, m12: T, m13: T,
	m20: T, m21: T, m22: T, m23: T,
	m30: T, m31: T, m32: T, m33: T];

// 2 element vector
export type Vector2<T> = [
	v0: T, v1: T
]

// 3 element vector
export type Vector3<T> = [
	v0: T, v1: T, v2: T
]

// 4 element vector
export type Vector4<T> = [
	v0: T, v1: T, v2: T, v3: T
]