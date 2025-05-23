// @ts-ignore Patch needed for ES20xx compatibility while this module uses Node16/NodeNext resolutions
import * as got from 'got';
// @ts-ignore Patch needed for ES20xx compatibility while this module uses Node16/NodeNext resolutions
import { Options, OptionsInit as OptionsInit$1, Agents, CancelableRequest, Response, Request, ExtendOptions, HTTPAlias, PaginationOptions, PaginateData, Got } from 'got';
// @ts-ignore Patch needed for ES20xx compatibility while this module uses Node16/NodeNext resolutions
export * from 'got';
// @ts-ignore Patch needed for ES20xx compatibility while this module uses Node16/NodeNext resolutions
export { OptionsInit as GotOptionsInit } from 'got';
import { Agent, ClientRequest, ClientRequestArgs, AgentOptions } from 'node:http';
import { URL as URL$1 } from 'node:url';

/**
 * @see https://github.com/nodejs/node/blob/533cafcf7e3ab72e98a2478bc69aedfdf06d3a5e/lib/_http_client.js#L129-L162
 * @see https://github.com/nodejs/node/blob/533cafcf7e3ab72e98a2478bc69aedfdf06d3a5e/lib/_http_client.js#L234-L246
 * @see https://github.com/nodejs/node/blob/533cafcf7e3ab72e98a2478bc69aedfdf06d3a5e/lib/_http_client.js#L304-L305
 * Wraps an existing Agent instance,
 * so there's no need to replace `agent.addRequest`.
 */
declare class WrappedAgent<T extends Agent> implements Agent {
    agent: T;
    constructor(agent: T);
    addRequest(request: ClientRequest, options: ClientRequestArgs): void;
    get keepAlive(): boolean;
    get maxSockets(): Agent['maxSockets'];
    get options(): AgentOptions;
    get defaultPort(): number;
    get protocol(): string;
    destroy(): void;
    get maxFreeSockets(): Agent['maxFreeSockets'];
    get maxTotalSockets(): Agent['maxTotalSockets'];
    get freeSockets(): Agent['freeSockets'];
    get sockets(): Agent['sockets'];
    get requests(): Agent['requests'];
    on(eventName: string | symbol, listener: (...args: any[]) => void): this;
    once(eventName: string | symbol, listener: (...args: any[]) => void): this;
    off(eventName: string | symbol, listener: (...args: any[]) => void): this;
    addListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    removeAllListeners(eventName?: string | symbol): this;
    setMaxListeners(n: number): this;
    getMaxListeners(): number;
    listeners(eventName: string | symbol): Function[];
    rawListeners(eventName: string | symbol): Function[];
    emit(eventName: string | symbol, ...args: any[]): boolean;
    eventNames(): (string | symbol)[];
    listenerCount(eventName: string | symbol): number;
    prependListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    prependOnceListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
}

/**
 * Transforms the casing of the headers to Pascal-Case.
 */
declare class TransformHeadersAgent<T extends Agent> extends WrappedAgent<T> {
    /**
     * Transforms the request via header normalization.
     */
    transformRequest(request: ClientRequest, { sortHeaders }: {
        sortHeaders: boolean;
    }): void;
    addRequest(request: ClientRequest, options: ClientRequestArgs): void;
    toPascalCase(header: string): string;
}

declare function browserHeadersHook(options: Options): Promise<void>;

declare function customOptionsHook(raw: OptionsInit$1, options: Options): void;

declare function http2Hook(options: Options): void;

declare function insecureParserHook(options: Options): void;

declare function optionsValidationHandler(options: unknown): void;

declare function proxyHook(options: Options): Promise<void>;
declare function getAgents(parsedProxyUrl: URL$1, rejectUnauthorized: boolean): Promise<Agents>;

declare function tlsHook(options: Options): void;

interface Context {
    proxyUrl?: string;
    headerGeneratorOptions?: Record<string, unknown>;
    useHeaderGenerator?: boolean;
    headerGenerator?: {
        getHeaders: (options: Record<string, unknown>) => Record<string, string>;
    };
    insecureHTTPParser?: boolean;
    sessionToken?: object;
    /** @private */
    sessionData?: unknown;
    /** @private */
    resolveProtocol?: (data: unknown) => {
        alpnProtocol: string;
    } | Promise<{
        alpnProtocol: string;
    }>;
}
type OptionsInit = OptionsInit$1 & Context;

type Except<ObjectType, KeysType extends keyof ObjectType> = Pick<ObjectType, Exclude<keyof ObjectType, KeysType>>;
type Merge<FirstType, SecondType> = Except<FirstType, Extract<keyof FirstType, keyof SecondType>> & SecondType;
type ExtendedGotRequestFunction = {
    (url: string | URL, options?: ExtendedOptionsOfTextResponseBody): CancelableRequest<Response<string>>;
    <T>(url: string | URL, options?: ExtendedOptionsOfJSONResponseBody): CancelableRequest<Response<T>>;
    (url: string | URL, options?: ExtendedOptionsOfBufferResponseBody): CancelableRequest<Response<Buffer>>;
    (url: string | URL, options?: ExtendedOptionsOfUnknownResponseBody): CancelableRequest<Response>;
    (options: ExtendedOptionsOfTextResponseBody): CancelableRequest<Response<string>>;
    <T>(options: ExtendedOptionsOfJSONResponseBody): CancelableRequest<Response<T>>;
    (options: ExtendedOptionsOfBufferResponseBody): CancelableRequest<Response<Buffer>>;
    (options: ExtendedOptionsOfUnknownResponseBody): CancelableRequest<Response>;
    (url: string | URL, options?: (Merge<ExtendedOptionsOfTextResponseBody, ResponseBodyOnly>)): CancelableRequest<string>;
    <T>(url: string | URL, options?: (Merge<ExtendedOptionsOfJSONResponseBody, ResponseBodyOnly>)): CancelableRequest<T>;
    (url: string | URL, options?: (Merge<ExtendedOptionsOfBufferResponseBody, ResponseBodyOnly>)): CancelableRequest<Buffer>;
    (options: (Merge<ExtendedOptionsOfTextResponseBody, ResponseBodyOnly>)): CancelableRequest<string>;
    <T>(options: (Merge<ExtendedOptionsOfJSONResponseBody, ResponseBodyOnly>)): CancelableRequest<T>;
    (options: (Merge<ExtendedOptionsOfBufferResponseBody, ResponseBodyOnly>)): CancelableRequest<Buffer>;
    (url: string | URL, options?: Merge<OptionsInit, {
        isStream: true;
    }>): Request;
    (options: Merge<OptionsInit, {
        isStream: true;
    }>): Request;
    (url: string | URL, options?: OptionsInit): CancelableRequest | Request;
    (options: OptionsInit): CancelableRequest | Request;
    (url: undefined, options: undefined, defaults: Options): CancelableRequest | Request;
};
type ExtendedOptionsOfTextResponseBody = Merge<OptionsInit, {
    isStream?: false;
    resolveBodyOnly?: false;
    responseType?: 'text';
}>;
type ExtendedOptionsOfJSONResponseBody = Merge<OptionsInit, {
    isStream?: false;
    resolveBodyOnly?: false;
    responseType?: 'json';
}>;
type ExtendedOptionsOfBufferResponseBody = Merge<OptionsInit, {
    isStream?: false;
    resolveBodyOnly?: false;
    responseType: 'buffer';
}>;
type ExtendedOptionsOfUnknownResponseBody = Merge<OptionsInit, {
    isStream?: false;
    resolveBodyOnly?: false;
}>;
type ResponseBodyOnly = {
    resolveBodyOnly: true;
};
type ExtendedGotStreamFunction = ((url?: string | URL, options?: Merge<OptionsInit, {
    isStream?: true;
}>) => Request) & ((options?: Merge<OptionsInit, {
    isStream?: true;
}>) => Request);
type ExtendedExtendOptions = ExtendOptions & OptionsInit;
type ExtendedGotStream = ExtendedGotStreamFunction & Record<HTTPAlias, ExtendedGotStreamFunction>;
type ExtendedPaginationOptions<ElementType, BodyType> = PaginationOptions<ElementType, BodyType> & {
    paginate?: (data: PaginateData<BodyType, ElementType>) => OptionsInit | false;
};
type ExtendedOptionsWithPagination<T = unknown, R = unknown> = Merge<OptionsInit, {
    pagination?: ExtendedPaginationOptions<T, R>;
}>;
type ExtendedGotPaginate = {
    /**
    Same as `GotPaginate.each`.
    */
    <T, R = unknown>(url: string | URL, options?: ExtendedOptionsWithPagination<T, R>): AsyncIterableIterator<T>;
    /**
    Same as `GotPaginate.each`.
    */
    <T, R = unknown>(options?: ExtendedOptionsWithPagination<T, R>): AsyncIterableIterator<T>;
    /**
    Returns an async iterator.

    See pagination.options for more pagination options.

    @example
    ```
    import { gotScraping } from 'got-scraping';

    const countLimit = 10;

    const pagination = gotScraping.paginate('https://api.github.com/repos/sindresorhus/got/commits', {
        pagination: { countLimit }
    });

    console.log(`Printing latest ${countLimit} Got commits (newest to oldest):`);

    for await (const commitData of pagination) {
        console.log(commitData.commit.message);
    }
    ```
    */
    each: (<T, R = unknown>(url: string | URL, options?: ExtendedOptionsWithPagination<T, R>) => AsyncIterableIterator<T>) & (<T, R = unknown>(options?: ExtendedOptionsWithPagination<T, R>) => AsyncIterableIterator<T>);
    /**
    Returns a Promise for an array of all results.

    See pagination.options for more pagination options.

    @example
    ```
    import { gotScraping } from 'got-scraping';

    const countLimit = 10;

    const results = await gotScraping.paginate.all('https://api.github.com/repos/sindresorhus/got/commits', {
        pagination: { countLimit }
    });

    console.log(`Printing latest ${countLimit} Got commits (newest to oldest):`);
    console.log(results);
    ```
    */
    all: (<T, R = unknown>(url: string | URL, options?: ExtendedOptionsWithPagination<T, R>) => Promise<T[]>) & (<T, R = unknown>(options?: ExtendedOptionsWithPagination<T, R>) => Promise<T[]>);
};
type GotScraping = {
    stream: ExtendedGotStream;
    paginate: ExtendedGotPaginate;
    defaults: Got['defaults'];
    extend: (...instancesOrOptions: Array<GotScraping | ExtendedExtendOptions>) => GotScraping;
} & Record<HTTPAlias, ExtendedGotRequestFunction> & ExtendedGotRequestFunction;

declare const gotScraping: GotScraping;

declare const hooks: {
    init: (typeof customOptionsHook)[];
    beforeRequest: (typeof insecureParserHook)[];
    beforeRedirect: got.BeforeRedirectHook[];
    fixDecompress: got.HandlerFunction;
    insecureParserHook: typeof insecureParserHook;
    sessionDataHook: (options: Options) => void;
    http2Hook: typeof http2Hook;
    proxyHook: typeof proxyHook;
    browserHeadersHook: typeof browserHeadersHook;
    tlsHook: typeof tlsHook;
    optionsValidationHandler: typeof optionsValidationHandler;
    customOptionsHook: typeof customOptionsHook;
    refererHook: got.BeforeRedirectHook;
};

export { Context, ExtendedExtendOptions, ExtendedGotPaginate, ExtendedGotRequestFunction, ExtendedGotStream, ExtendedGotStreamFunction, ExtendedOptionsOfBufferResponseBody, ExtendedOptionsOfJSONResponseBody, ExtendedOptionsOfTextResponseBody, ExtendedOptionsOfUnknownResponseBody, ExtendedOptionsWithPagination, ExtendedPaginationOptions, GotScraping, OptionsInit, ResponseBodyOnly, TransformHeadersAgent, getAgents, gotScraping, hooks };
