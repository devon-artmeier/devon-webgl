// Color class
export class Color
{
	public readonly data = new Float32Array(4);
	
	// Float
	get r(): number { return this.data[0]; }
	set r(val: number) { this.data[0] = val; }
	get g(): number { return this.data[1]; }
	set g(val: number) { this.data[1] = val; }
	get b(): number { return this.data[2]; }
	set b(val: number) { this.data[2] = val; }
	get a(): number { return this.data[3]; }
	set a(val: number) { this.data[3] = val; }
	
	// Uint8
	get r8(): number { return Color.f32ToU8(this.data[0]); }
	set r8(val: number) { this.data[0] = Color.u8ToF32(val); }
	get g8(): number { return Color.f32ToU8(this.data[1]); }
	set g8(val: number) { this.data[1] = Color.u8ToF32(val); }
	get b8(): number { return Color.f32ToU8(this.data[2]); }
	set b8(val: number) { this.data[2] = Color.u8ToF32(val); }
	get a8(): number { return Color.f32ToU8(this.data[3]); }
	set a8(val: number) { this.data[3] = Color.u8ToF32(val); }
	
	get data8(): Uint8Array { return new Uint8Array([this.r8, this.g8, this.b8, this.a8]); }
	set data8(col: Uint8Array) {
		this.r8 = col[0];
		this.g8 = col[1];
		this.b8 = col[2];
		this.a8 = col[3];
	}
	
	constructor(r: number, g: number, b: number, a: number)
	{
		this.data[0] = r;
		this.data[1] = g;
		this.data[2] = b;
		this.data[3] = a;
	}
	
	// Generate RGBA color from float values
	public static FromRGBA(r: number, g: number, b: number, a: number)
	{
		return new Color(r, g, b, a);
	}
	
	// Generate RGB color from uint8 values
	public static RGBA8(r: number, g: number, b: number, a: number)
	{
		return new Color(Color.u8ToF32(r), Color.u8ToF32(g), Color.u8ToF32(b), Color.u8ToF32(a));
	}
	
	// Generate RGB color from float values
	public static FromRGB(r: number, g: number, b: number, a: number)
	{
		return new Color(r, g, b, 1);
	}
	
	// Generate RGB color from uint8 values
	public static RGBA(r: number, g: number, b: number, a: number)
	{
		return new Color(Color.u8ToF32(r), Color.u8ToF32(g), Color.u8ToF32(b), 1);
	}
	
	// Convert float value to uint8 value
	private static f32ToU8(val: number)
	{
		return Math.floor(val * 255);
	}
	
	// Convert uint8 value to float value
	private static u8ToF32(val: number)
	{
		return val / 255.0 ;
	}
}