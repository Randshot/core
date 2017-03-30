import { PermissionResolvable } from 'discord.js';
import { Command } from './Command';
import { RateLimiter } from './RateLimiter';
import { MiddlewareFunction } from '../types/MiddlewareFunction';
import { ArgOpts } from '../types/ArgOpts';
import { Message } from '../types/Message';

/**
 * Grouping of static decorator methods for the {@link Command}
 * class and {@link Command#action} method
 * @module CommandDecorators
 */

/**
 * Apply a middleware function to the action method of a Command.
 * Identical to {@link Command#use} but used as a method decorator
 * @param {MiddlewareFunction} func Middleware function to use for this Command action
 */
export function using(func: MiddlewareFunction): MethodDecorator
{
	return function(target: Command<any>, key: string, descriptor: PropertyDescriptor): PropertyDescriptor
	{
		if (!target) throw new Error('@using must be used as a method decorator for a Command action method.');
		if (key !== 'action') throw new Error(`"${target.constructor.name}#${key}" is not a valid method target for @using.`);
		if (!descriptor) descriptor = Object.getOwnPropertyDescriptor(target, key);
		const original: any = descriptor.value;
		descriptor.value = async function(message: Message, args: any[]): Promise<any>
		{
			let middlewarePassed: boolean = true;
			try
			{
				let result: Promise<[Message, any[]]> | [Message, any[]] =
					func.call(this, message, args);
				if (result instanceof Promise) result = await result;
				if (!(result instanceof Array))
				{
					if (typeof result === 'string') message.channel.send(result);
					middlewarePassed = false;
				}
				if (middlewarePassed) [message, args] = result;
			}
			catch (err)
			{
				middlewarePassed = false;
				message.channel.send(err.toString());
			}
			if (middlewarePassed) return await original.apply(this, [message, args]);
		};
		return descriptor;
	};
}

/**
 * Set `name` metadata
 * @param {string} value Value to set
 */
export function name(value: string): ClassDecorator
{
	return _setMetaData('name', value);
}

/**
 * Set `aliases` metadata
 * @param {...string} values Values to set
 */
export function aliases(...values: string[]): ClassDecorator
{
	return _setMetaData('aliases', values);
}

/**
 * Set `description` metadata
 * @param {string} value Value to set
 */
export function description(value: string): ClassDecorator
{
	return _setMetaData('description', value);
}

/**
 * Set `usage` metadata
 * @param {string} value Value to set
 */
export function usage(value: string): ClassDecorator
{
	return _setMetaData('usage', value);
}

/**
 * Set `extraHelp` metadata
 * @param {string} value Value to set
 */
export function extraHelp(value: string): ClassDecorator
{
	return _setMetaData('extraHelp', value);
}

/**
 * Set `group` metadata
 * @param {string} value Value to set
 */
export function group(value: string): ClassDecorator
{
	return _setMetaData('group', value);
}

/**
 * Set `argOpts` metadata
 * @param {string} value Value to set
 */
export function argOpts(value: ArgOpts): ClassDecorator
{
	return _setMetaData('usage', value);
}

/**
 * Set `permissions` metadata
 * @param {...external:PermissionResolvable} values Values to set
 */
export function permissions(...values: PermissionResolvable[]): ClassDecorator
{
	return _setMetaData('permissions', values);
}

/**
 * Set `roles` metadata
 * @param {...string} values Values to set
 */
export function roles(...values: string[]): ClassDecorator
{
	return _setMetaData('roles', values);
}

/**
 * Set `ratelimit` metadata
 * @param {string} value Value to set
 */
export function ratelimit(value: string): ClassDecorator
{
	return _setMetaData('_rateLimiter', new RateLimiter(value, false));
}

/**
 * Set `overloads` metadata
 * @param {string} value Value to set
 */
export function overloads(value: string): ClassDecorator
{
	return _setMetaData('overloads', value);
}

/**
 * Set `owneronly` flag metadata
 */
export function ownerOnly(target: typeof Command): ClassDecorator
{
	return _setFlagMetaData('ownerOnly');
}

/**
 * Set `guildOnly` flag metadata
 */
export function guildOnly(target: typeof Command): ClassDecorator
{
	return _setFlagMetaData('guildOnly');
}

/**
 * Set `hidden` flag metadata
 */
export function hidden(target: typeof Command): ClassDecorator
{
	return _setFlagMetaData('hidden');
}

/**
 * Set a boolean flag metadata on a class
 * @private
 */
function _setFlagMetaData(flag: string): ClassDecorator
{
	return function(target: typeof Command): typeof Command
	{
		Object.defineProperty(target.prototype, flag, {
			value: true,
			enumerable: true,
		});
		return target;
	};
}

/**
 * Set an arbitrary value to an arbitrary key on a class
 * @private
 */
function _setMetaData(key: string, value: any): ClassDecorator
{
	return function(target: typeof Command): typeof Command
	{
		Object.defineProperty(target.prototype, key, {
			value: value,
			configurable: true,
			enumerable: true,
			writable: true
		});
		return target;
	};
}
