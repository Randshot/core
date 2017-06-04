import * as path from 'path';

export { Client } from './client/Client';
export { Command } from './command/Command';
export { CommandDispatcher } from './command/CommandDispatcher';
export { CommandLoader } from './command/CommandLoader';
export { CommandRegistry } from './command/CommandRegistry';
export { GuildSettings } from './storage/GuildSettings';
export { GuildStorageLoader } from './storage/GuildStorageLoader';
export { KeyedStorage } from './storage/KeyedStorage';
export { Middleware } from './command/middleware/Middleware';
export { RateLimit } from './command/RateLimit';
export { RateLimiter } from './command/RateLimiter';

export { IStorageProvider } from './storage/interface/IStorageProvider';
export { StorageProvider } from './storage/StorageProvider';
export { StorageFactory } from './storage/StorageFactory';
export { JSONProvider } from './storage/JSONProvider';

import * as CommandDecorators from './command/CommandDecorators';
export { CommandDecorators }

export { Time } from './util/Time';
export { Util } from './util/Util';
export { Logger } from './util/logger/Logger';
export { logger } from './util/logger/LoggerDecorator';
export { LogLevel } from './types/LogLevel';

export { deprecated } from './util/DeprecatedDecorator';

export { ListenerUtil } from './util/ListenerUtil';

export { ArgOpts } from './types/ArgOpts';
export { BaseCommandName } from './types/BaseCommandName';
export { ClientStorage } from './types/ClientStorage';
export { CommandInfo } from './types/CommandInfo';
export { DefaultGuildSettings } from './types/DefaultGuildSettings';
export { Difference } from './types/Difference';
export { ExpectArgType } from './types/ExpectArgType';
export { Guild } from './types/Guild';
export { GuildStorage } from './types/GuildStorage';
export { Message } from './types/Message';
export { MiddlewareFunction } from './types/MiddlewareFunction';
export { ResolveArgType } from './types/ResolveArgType';
export { StorageProviderConstructor } from './types/StorageProviderConstructor';
export { YAMDBFOptions } from './types/YAMDBFOptions';

export const version: string = require(path.join(__dirname, '..', 'package')).version;

/** @external {Client} See: {@link https://discord.js.org/#/docs/main/stable/class/Client} */
/** @external {ClientOptions} See: {@link https://discord.js.org/#/docs/main/stable/typedef/ClientOptions} */
/** @external {Collection} See: {@link https://discord.js.org/#/docs/main/stable/class/Collection} */
/** @external {Guild} See: {@link https://discord.js.org/#/docs/main/stable/class/Guild} */
/** @external {Message} See: {@link https://discord.js.org/#/docs/main/stable/class/Message} */
/** @external {User} See: {@link https://discord.js.org/#/docs/main/stable/class/User} */
/** @external {PermissionResolvable} See: {@link https://discord.js.org/#/docs/main/stable/typedef/PermissionResolvable} */

/**
 * @typedef {Array<any>} Tuple Represents an array of fixed length where the the item in
 * the specified position is of the specified type.
 *
 * Example:
 * ```
 * Tuple<string, number> === [string, number] === ['foo', 10]
 * ```
 */