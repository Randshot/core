import { IStorageProvider } from './interface/IStorageProvider';
import { StorageProvider } from './StorageProvider';
import DB = require('node-json-db');

/**
 * Default storage provider for the framework. If no storage provider is passed
 * in the client constructor, this provider will be used
 * @extends StorageProvider
 * @implements IStorageProvider
 */
export class JSONProvider extends StorageProvider implements IStorageProvider
{
	private readonly _name: string;
	private _db: DB;
	public constructor(name: string)
	{
		super();
		this._name = name;
	}

	public async init(): Promise<void>
	{
		this._db = new DB(`storage/${this._name}`, true, true);
	}

	public async keys(): Promise<string[]>
	{
		try
		{
			let data: object = this._db.getData('/');
			return Object.keys(data);
		}
		catch (err)
		{
			return [];
		}
	}

	public async get(key: string): Promise<string>
	{
		if (typeof key === 'undefined') throw new TypeError('Key must be provided');
		if (typeof key !== 'string') throw new TypeError('Key must be a string');

		try
		{
			let data: string = this._db.getData(`/${key}`);
			return data;
		}
		catch (err)
		{
			return undefined;
		}
	}

	public async set(key: string, value: string): Promise<void>
	{
		if (typeof key === 'undefined') throw new TypeError('Key must be provided');
		if (typeof key !== 'string') throw new TypeError('Key must be a string');
		if (typeof value === 'undefined') throw new TypeError('Value must be provided');
		if (typeof value !== 'string') throw new TypeError('Value must be string');

		this._db.push(`/${key}`, value, true);
	}

	public async remove(key: string): Promise<void>
	{
		if (typeof key === 'undefined') throw new TypeError('Key must be provided');
		if (typeof key !== 'string') throw new TypeError('Key must be a string');

		try { this._db.delete(`/${key}`); }
		catch (err) { return; }
	}

	public async clear(): Promise<void>
	{
		try { for (const key of await this.keys()) this._db.delete(`/${key}`); }
		catch (err) { return; }
	}
}