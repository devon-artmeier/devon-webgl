/**
 * A class that contains logging functions.
 */
export class Log
{
	/**
	 * Log an informative message.
	 * 
	 * @param msg The message to log.
	 */
	public static info(msg: string)
	{
		console.info(`[devon-webgl] ${msg}`);
	}

	/**
	 * Log a warning message.
	 * 
	 * @param msg The message to log.
	 */
	public static warning(msg: string)
	{
		console.warn(`[devon-webgl] ${msg}`);
	}

	/**
	 * Log an error message.
	 * 
	 * @param msg The message to log.
	 */
	public static error(msg: string)
	{
		console.error(`[devon-webgl] ${msg}`);
	}
}