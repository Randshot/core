import { Lang } from '../localization/Lang';
import { ArgOpts } from '../types/ArgOpts';
import { Message } from '../types/Message';
import { MiddlewareFunction } from '../types/MiddlewareFunction';
import { ResourceLoader } from '../types/ResourceLoader';
import { Command } from './Command';
import { RateLimiter } from './RateLimiter';
import { PermissionResolvable } from 'discord.js';

/**
 * Grouping of static decorator methods for the {@link Command}
 * class and {@link Command#action} method
 *
 * **Note:** This is a Typescript feature. Javascript users are limited to
 * using CommandInfo to define their commands and {@link Command#use} for
 * assigning middleware functions to commands
 * @module CommandDecorators
 */

/**
 * Apply a middleware function to the action method of a Command.
 * Identical to {@link Command#use} but used as a method decorator
 * @param {MiddlewareFunction} func Middleware function to use for this Command action
 * @returns {MethodDecorator}
 */
export function using(func: MiddlewareFunction): MethodDecorator
{
	return function(target: Command, key: string, descriptor: PropertyDescriptor): PropertyDescriptor
	{
		if (!target) throw new Error('@using must be used as a method decorator for a Command action method.');
		if (key !== 'action') throw new Error(`"${target.constructor.name}#${key}" is not a valid method target for @using.`);
		if (!descriptor) descriptor = Object.getOwnPropertyDescriptor(target, key);
		const original: any = descriptor.value;
		descriptor.value = async function(this: Command<any>, message: Message, args: any[]): Promise<any>
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
				message.channel.send(err.toString(), { split: true });
			}
			if (middlewarePassed) return await original.apply(this, [message, args]);
		};
		return descriptor;
	};
}

/**
 * Creates a {@link ResourceLoader} function using the localization
 * language for the command call and passes it as the first argument
 * for that command call.
 *
 * Identical to {@link Middleware.localize} but used as a Command
 * method decorator.
 *
 * Like the `localize` middleware, you will want to use this after
 * any other usages of middleware via the `@using()` decorator.
 * Middleware used with {@link Command#use} is evaluated before
 * middlleware used via `@using()` decorator.
 * @returns {MethodDecorator}
 */
export function localizable(target: Command, key: string, descriptor: PropertyDescriptor): PropertyDescriptor
{
	if (!target) throw new Error('@localizable must be used as a method decorator for a Command action method.');
	if (key !== 'action') throw new Error(
		`"${target.constructor.name}#${key}" is not a valid method target for @localizable.`);
	if (!descriptor) descriptor = Object.getOwnPropertyDescriptor(target, key);
	const original: any = descriptor.value;
	descriptor.value = async function(this: Command<any>, message: Message, args: any[]): Promise<any>
	{
		const dm: boolean = message.channel.type !== 'text';
		const lang: string = dm ? this.client.defaultLang
			:  await message.guild.storage.settings.get('lang');

		const res: ResourceLoader = Lang.createResourceLoader(lang);
		return await original.apply(this, [message, [res, ...args]]);
	};
	return descriptor;
}

/**
 * Set `name` metadata
 * @param {string} value Value to set
 * @returns {ClassDecorator}
 */
export function name(value: string): ClassDecorator
{
	return _setMetaData('name', value);
}

/**
 * Set `aliases` metadata
 * @param {...string} values Values to set
 * @returns {ClassDecorator}
 */
export function aliases(...values: string[]): ClassDecorator
{
	return _setMetaData('aliases', values);
}

/**
 * Set `desc` metadata
 * @param {string} value Value to set
 * @returns {ClassDecorator}
 */
export function desc(value: string): ClassDecorator
{
	return _setMetaData('desc', value);
}

/**
 * Set `usage` metadata
 * @param {string} value Value to set
 * @returns {ClassDecorator}
 */
export function usage(value: string): ClassDecorator
{
	return _setMetaData('usage', value);
}

/**
 * Set `info` metadata
 * @param {string} value Value to set
 * @returns {ClassDecorator}
 */
export function info(value: string): ClassDecorator
{
	return _setMetaData('info', value);
}

/**
 * Set `group` metadata
 * @param {string} value Value to set
 * @returns {ClassDecorator}
 */
export function group(value: string): ClassDecorator
{
	return _setMetaData('group', value);
}

/**
 * Set `argOpts` metadata
 * @param {ArgOpts} value Value to set
 * @returns {ClassDecorator}
 */
export function argOpts(value: ArgOpts): ClassDecorator
{
	return _setMetaData('usage', value);
}

/**
 * Set `callerPermissions` metadata
 * @param {...external:PermissionResolvable} values Values to set
 * @returns {ClassDecorator}
 */
export function callerPermissions(...values: PermissionResolvable[]): ClassDecorator
{
	return _setMetaData('callerPermissions', values);
}

/**
 * Set `clientPermissions` metadata
 * @param {...external:PermissionResolvable} values Values to set
 * @returns {ClassDecorator}
 */
export function clientPermissions(...values: PermissionResolvable[]): ClassDecorator
{
	return _setMetaData('clientPermissions', values);
}

/**
 * Set `roles` metadata
 * @param {...string} values Values to set
 * @returns {ClassDecorator}
 */
export function roles(...values: string[]): ClassDecorator
{
	return _setMetaData('roles', values);
}

/**
 * Set `ratelimit` metadata
 * @param {string} value Value to set
 * @returns {ClassDecorator}
 */
export function ratelimit(value: string): ClassDecorator
{
	return _setMetaData('_rateLimiter', new RateLimiter(value, false));
}

/**
 * Set `overloads` metadata
 * @param {string} value Value to set
 * @returns {ClassDecorator}
 */
export function overloads(value: string): ClassDecorator
{
	return _setMetaData('overloads', value);
}

/**
 * Set `owneronly` flag metadata
 * @returns {ClassDecorator}
 */
export function ownerOnly<T extends Function>(target: T): T
{
	return _setFlagMetaData(target, 'ownerOnly');
}

/**
 * Set `guildOnly` flag metadata
 * @returns {ClassDecorator}
 */
export function guildOnly<T extends Function>(target: T): T
{
	return _setFlagMetaData(target, 'guildOnly');
}

/**
 * Set `hidden` flag metadata
 * @returns {ClassDecorator}
 */
export function hidden<T extends Function>(target: T): T
{
	return _setFlagMetaData(target, 'hidden');
}

/**
 * Set a boolean flag metadata on a command class
 * @private
 */
function _setFlagMetaData<T extends Function>(target: T, flag: string): T
{
	Object.defineProperty(target.prototype, flag, {
		value: true,
		enumerable: true,
	});
	return target;
}

/**
 * Set an arbitrary value to an arbitrary key on a command class
 * @private
 */
function _setMetaData(key: string, value: any): ClassDecorator
{
	return function<T extends Function>(target: T): T
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
