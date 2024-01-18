/**
 * Blend functions.
 * @enum
 */
export enum BlendFunc
{
	Zero,
	One,
	SrcColor,
	OneMinusSrcColor,
	DestColor,
	OneMinusDestColor,
	SrcAlpha,
	OneMinusSrcAlpha,
	DestAlpha,
	OneMinusDestAlpha,
	ConstantColor,
	OneMinusConstantColor,
	ConstantAlpha,
	OneMinusConstantAlpha
}

/**
 * Cull faces.
 * @enum
 */
export enum CullFace
{
	Front,
	Bank,
	FrontBack
}

/**
 * Front face directions.
 * @enum
 */
export enum FrontFace
{
	Clockwise,
	CounterClockwise
}

/**
 * Depth test functions.
 */
export enum DepthFunc
{
	Always,
	Never,
	Equal,
	NotEqual,
	Less,
	LessEqual,
	Greater,
	GreaterEqual
}

/**
 * Stencil test functions.
 */
export enum StencilFunc
{
	Always,
	Never,
	Equal,
	NotEqual,
	Less,
	LessEqual,
	Greater,
	GreaterEqual
}

/**
 * Stencil test options.
 */
export enum StencilOption
{
	Keep,
	Zero,
	Replace,
	Increase,
	IncreaseWrap,
	Decrease,
	DecreaseWrap,
	Invert
}

/**
 * Texture filters.
 * @enum
 */
export enum TextureFilter
{
	Nearest,
	Linear
}

/**
 * Texture wrap modes.
 * @enum
 */
export enum TextureWrap
{
	Clamp,
	Repeat,
	Mirror
}