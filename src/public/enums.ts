// Texture filter modes
export enum TextureFilter
{
	Nearest,
	Bilinear
}

// Texture wrap modes
export enum TextureWrap
{
	Clamp,
	Repeat,
	Mirror
}

// Buffer object usage
export enum BufferUsage
{
	Static,
	Dynamic,
	Stream
}

// Condition
export enum Condition
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

// Stencil action option
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