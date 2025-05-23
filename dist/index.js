var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/index.ts
import http3 from "node:http";
import https2 from "node:https";
import { got as originalGot, Options as Options8 } from "got";
import { HeaderGenerator as HeaderGenerator2 } from "header-generator";

// src/agent/transform-headers-agent.ts
import { HeaderGenerator } from "header-generator";
import { OutgoingMessage } from "node:http";

// src/agent/wrapped-agent.ts
import "node:http";
var _WrappedAgent = class _WrappedAgent {
  constructor(agent) {
    __publicField(this, "agent");
    this.agent = agent;
  }
  addRequest(request, options) {
    this.agent.addRequest(request, options);
  }
  get keepAlive() {
    return this.agent.keepAlive;
  }
  get maxSockets() {
    return this.agent.maxSockets;
  }
  get options() {
    return this.agent.options;
  }
  get defaultPort() {
    return this.agent.defaultPort;
  }
  get protocol() {
    return this.agent.protocol;
  }
  destroy() {
    this.agent.destroy();
  }
  // Let's implement `HttpAgent` so we don't have to
  // type `WrappedAgent as unknown as HttpAgent`
  get maxFreeSockets() {
    return this.agent.maxFreeSockets;
  }
  get maxTotalSockets() {
    return this.agent.maxTotalSockets;
  }
  get freeSockets() {
    return this.agent.freeSockets;
  }
  get sockets() {
    return this.agent.sockets;
  }
  get requests() {
    return this.agent.requests;
  }
  on(eventName, listener) {
    this.agent.on(eventName, listener);
    return this;
  }
  once(eventName, listener) {
    this.agent.once(eventName, listener);
    return this;
  }
  off(eventName, listener) {
    this.agent.off(eventName, listener);
    return this;
  }
  addListener(eventName, listener) {
    this.agent.addListener(eventName, listener);
    return this;
  }
  removeListener(eventName, listener) {
    this.agent.removeListener(eventName, listener);
    return this;
  }
  removeAllListeners(eventName) {
    this.agent.removeAllListeners(eventName);
    return this;
  }
  setMaxListeners(n) {
    this.agent.setMaxListeners(n);
    return this;
  }
  getMaxListeners() {
    return this.agent.getMaxListeners();
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  listeners(eventName) {
    return this.agent.listeners(eventName);
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  rawListeners(eventName) {
    return this.agent.rawListeners(eventName);
  }
  emit(eventName, ...args) {
    return this.agent.emit(eventName, ...args);
  }
  eventNames() {
    return this.agent.eventNames();
  }
  listenerCount(eventName) {
    return this.agent.listenerCount(eventName);
  }
  prependListener(eventName, listener) {
    this.agent.prependListener(eventName, listener);
    return this;
  }
  prependOnceListener(eventName, listener) {
    this.agent.prependOnceListener(eventName, listener);
    return this;
  }
};
__name(_WrappedAgent, "WrappedAgent");
var WrappedAgent = _WrappedAgent;

// src/agent/transform-headers-agent.ts
var { _storeHeader } = OutgoingMessage.prototype;
var generator = new HeaderGenerator();
var _TransformHeadersAgent = class _TransformHeadersAgent extends WrappedAgent {
  // Rewritten from https://github.com/nodejs/node/blob/533cafcf7e3ab72e98a2478bc69aedfdf06d3a5e/lib/_http_outgoing.js#L442-L479
  /**
   * Transforms the request via header normalization.
   */
  transformRequest(request, { sortHeaders }) {
    const headers = {};
    const hasConnection = request.hasHeader("connection");
    const hasContentLength = request.hasHeader("content-length");
    const hasTransferEncoding = request.hasHeader("transfer-encoding");
    const hasTrailer = request.hasHeader("trailer");
    const keys = request.getHeaderNames();
    for (const key of keys) {
      if (key.toLowerCase().startsWith("x-")) {
        headers[key] = request.getHeader(key);
      } else {
        headers[this.toPascalCase(key)] = request.getHeader(key);
      }
      if (sortHeaders) {
        request.removeHeader(key);
      }
    }
    const typedRequest = request;
    if (!hasConnection) {
      const shouldSendKeepAlive = request.shouldKeepAlive && (hasContentLength || request.useChunkedEncodingByDefault || typedRequest.agent);
      if (shouldSendKeepAlive) {
        headers.Connection = "keep-alive";
      } else {
        headers.Connection = "close";
      }
    }
    if (!hasContentLength && !hasTransferEncoding) {
      if (!hasTrailer && !typedRequest._removedContLen && typeof typedRequest._contentLength === "number") {
        headers["Content-Length"] = typedRequest._contentLength;
      } else if (!typedRequest._removedTE) {
        headers["Transfer-Encoding"] = "chunked";
      }
    }
    const transformedHeaders = sortHeaders ? generator.orderHeaders(headers) : headers;
    for (const [key, value] of Object.entries(transformedHeaders)) {
      request.setHeader(key, value);
    }
  }
  addRequest(request, options) {
    const typedRequest = request;
    typedRequest._storeHeader = (...args) => {
      this.transformRequest(request, { sortHeaders: true });
      return _storeHeader.call(request, ...args);
    };
    options.secureEndpoint = options.protocol === "https:";
    return super.addRequest(request, options);
  }
  toPascalCase(header) {
    return header.split("-").map((part) => {
      return part[0].toUpperCase() + part.slice(1).toLowerCase();
    }).join("-");
  }
};
__name(_TransformHeadersAgent, "TransformHeadersAgent");
var TransformHeadersAgent = _TransformHeadersAgent;

// src/hooks/browser-headers.ts
import "got";
import http22 from "http2-wrapper";
import "node:url";

// src/resolve-protocol.ts
import { isIPv6 as isIPv62 } from "node:net";
import tls2 from "node:tls";
import { URL as URL3 } from "node:url";
import "got";
import { auto as auto2 } from "http2-wrapper";
import QuickLRU from "quick-lru";

// src/hooks/proxy.ts
import "got";
import http2, { auto } from "http2-wrapper";
import { URL as URL2 } from "node:url";

// src/agent/h1-proxy-agent.ts
import http from "node:http";
import https from "node:https";
import { isIPv6 } from "node:net";
import tls from "node:tls";
import { URL } from "node:url";

// src/auth.ts
function buildBasicAuthHeader(url) {
  if (!url.username && !url.password) {
    return null;
  }
  const username = decodeURIComponent(url.username ?? "");
  const password = decodeURIComponent(url.password ?? "");
  const basic = Buffer.from(`${username}:${password}`).toString("base64");
  return `Basic ${basic}`;
}
__name(buildBasicAuthHeader, "buildBasicAuthHeader");

// src/agent/h1-proxy-agent.ts
var initialize = /* @__PURE__ */ __name((self, options) => {
  self.proxy = typeof options.proxy === "string" ? new URL(options.proxy) : options.proxy;
}, "initialize");
var getPort = /* @__PURE__ */ __name((url) => {
  if (url.port !== "") {
    return Number(url.port);
  }
  if (url.protocol === "http:") {
    return 80;
  }
  if (url.protocol === "https:") {
    return 443;
  }
  throw new Error(`Unexpected protocol: ${url.protocol}`);
}, "getPort");
var _HttpRegularProxyAgent = class _HttpRegularProxyAgent extends http.Agent {
  constructor(options) {
    super(options);
    __publicField(this, "proxy");
    initialize(this, options);
  }
  addRequest(request, options) {
    if (options.socketPath) {
      super.addRequest(request, options);
      return;
    }
    let hostport = `${options.host}:${options.port}`;
    if (isIPv6(options.host)) {
      hostport = `[${options.host}]:${options.port}`;
    }
    const url = new URL(`${request.protocol}//${hostport}${request.path}`);
    options = {
      ...options,
      host: this.proxy.hostname,
      port: getPort(this.proxy)
    };
    request.path = url.href;
    const basic = buildBasicAuthHeader(this.proxy);
    if (basic) {
      request.setHeader("proxy-authorization", basic);
    }
    super.addRequest(request, options);
  }
};
__name(_HttpRegularProxyAgent, "HttpRegularProxyAgent");
var HttpRegularProxyAgent = _HttpRegularProxyAgent;
var _HttpProxyAgent = class _HttpProxyAgent extends http.Agent {
  constructor(options) {
    super(options);
    __publicField(this, "proxy");
    initialize(this, options);
  }
  createConnection(options, callback) {
    if (options.path) {
      super.createConnection(options, callback);
      return;
    }
    const fn = this.proxy.protocol === "https:" ? https.request : http.request;
    let hostport = `${options.host}:${options.port}`;
    if (isIPv6(options.host)) {
      hostport = `[${options.host}]:${options.port}`;
    }
    const headers = {
      host: hostport
    };
    const basic = buildBasicAuthHeader(this.proxy);
    if (basic) {
      headers["proxy-authorization"] = basic;
      headers.authorization = basic;
    }
    const connectRequest = fn(this.proxy, {
      method: "CONNECT",
      headers,
      path: hostport,
      agent: false,
      rejectUnauthorized: false
    });
    connectRequest.once("connect", (response, socket, head) => {
      if (head.length > 0 || response.statusCode !== 200) {
        socket.destroy();
        const error = new Error(`The proxy responded with ${response.statusCode} ${response.statusMessage}: ${head.toString()}`);
        callback(error);
        return;
      }
      if (options.protocol === "https:") {
        callback(void 0, tls.connect({
          ...options,
          socket
        }));
        return;
      }
      callback(void 0, socket);
    });
    connectRequest.once("error", (error) => {
      callback(error);
    });
    connectRequest.end();
  }
};
__name(_HttpProxyAgent, "HttpProxyAgent");
var HttpProxyAgent = _HttpProxyAgent;
var _HttpsProxyAgent = class _HttpsProxyAgent extends https.Agent {
  constructor(options) {
    super(options);
    __publicField(this, "proxy");
    initialize(this, options);
  }
  createConnection(options, callback) {
    HttpProxyAgent.prototype.createConnection.call(this, options, callback);
  }
};
__name(_HttpsProxyAgent, "HttpsProxyAgent");
var HttpsProxyAgent = _HttpsProxyAgent;

// src/hooks/proxy.ts
var {
  HttpOverHttp2,
  HttpsOverHttp2,
  Http2OverHttp2,
  Http2OverHttps,
  Http2OverHttp
} = http2.proxies;
async function proxyHook(options) {
  const { context: { proxyUrl } } = options;
  if (proxyUrl) {
    const parsedProxy = new URL2(proxyUrl);
    validateProxyProtocol(parsedProxy.protocol);
    options.agent = await getAgents(parsedProxy, options.https.rejectUnauthorized);
  }
}
__name(proxyHook, "proxyHook");
var _ProxyError = class _ProxyError extends Error {
};
__name(_ProxyError, "ProxyError");
var ProxyError = _ProxyError;
function validateProxyProtocol(protocol) {
  const isSupported = protocol === "http:" || protocol === "https:";
  if (!isSupported) {
    throw new ProxyError(`Proxy URL protocol "${protocol}" is not supported. Please use HTTP or HTTPS.`);
  }
}
__name(validateProxyProtocol, "validateProxyProtocol");
async function getAgents(parsedProxyUrl, rejectUnauthorized) {
  const headers = {};
  const basic = buildBasicAuthHeader(parsedProxyUrl);
  if (basic) {
    headers.authorization = basic;
    headers["proxy-authorization"] = basic;
  }
  const wrapperOptions = {
    proxyOptions: {
      url: parsedProxyUrl,
      headers,
      // Based on the got https.rejectUnauthorized option
      rejectUnauthorized
    },
    // The sockets won't be reused, no need to keep them
    maxFreeSockets: 0,
    maxEmptySessions: 0
  };
  const nativeOptions = {
    proxy: parsedProxyUrl,
    // The sockets won't be reused, no need to keep them
    maxFreeSockets: 0
  };
  let agent;
  if (parsedProxyUrl.protocol === "https:") {
    let alpnProtocol = "http/1.1";
    try {
      const result = await auto.resolveProtocol({
        host: parsedProxyUrl.hostname,
        port: parsedProxyUrl.port,
        rejectUnauthorized,
        ALPNProtocols: ["h2", "http/1.1"],
        servername: parsedProxyUrl.hostname
      });
      alpnProtocol = result.alpnProtocol;
    } catch {
    }
    const proxyIsHttp2 = alpnProtocol === "h2";
    if (proxyIsHttp2) {
      agent = {
        http: new TransformHeadersAgent(new HttpOverHttp2(wrapperOptions)),
        https: new TransformHeadersAgent(new HttpsOverHttp2(wrapperOptions)),
        http2: new Http2OverHttp2(wrapperOptions)
      };
    } else {
      agent = {
        http: new TransformHeadersAgent(new HttpProxyAgent(nativeOptions)),
        https: new TransformHeadersAgent(new HttpsProxyAgent(nativeOptions)),
        http2: new Http2OverHttps(wrapperOptions)
      };
    }
  } else {
    agent = {
      http: new TransformHeadersAgent(new HttpRegularProxyAgent(nativeOptions)),
      https: new TransformHeadersAgent(new HttpsProxyAgent(nativeOptions)),
      http2: new Http2OverHttp(wrapperOptions)
    };
  }
  return agent;
}
__name(getAgents, "getAgents");

// src/resolve-protocol.ts
var connect = /* @__PURE__ */ __name(async (proxyUrl, options, callback) => new Promise((resolve, reject) => {
  let host = `${options.host}:${options.port}`;
  if (isIPv62(options.host)) {
    host = `[${options.host}]:${options.port}`;
  }
  void (async () => {
    try {
      const headers = {
        host
      };
      const url = new URL3(proxyUrl);
      const basic = buildBasicAuthHeader(url);
      if (basic) {
        headers.authorization = basic;
        headers["proxy-authorization"] = basic;
      }
      const request = await auto2(url, {
        method: "CONNECT",
        headers,
        path: host,
        // TODO: this property doesn't exist according to the types
        pathname: host,
        rejectUnauthorized: false
      });
      request.end();
      request.once("error", reject);
      request.once("connect", (response, socket, head) => {
        if (response.statusCode !== 200 || head.length > 0) {
          reject(new ProxyError(`Proxy responded with ${response.statusCode} ${response.statusMessage}: ${head.length} bytes.

Below is the first 100 bytes of the proxy response body:
${head.toString("utf8", 0, 100)}`, { cause: head.toString("utf8") }));
          socket.destroy();
          return;
        }
        const tlsSocket = tls2.connect({
          ...options,
          socket
        }, callback);
        resolve(tlsSocket);
      });
    } catch (error) {
      reject(error);
    }
  })();
}), "connect");
var createCaches = /* @__PURE__ */ __name(() => ({
  protocolCache: new QuickLRU({ maxSize: 1e3 }),
  resolveAlpnQueue: /* @__PURE__ */ new Map()
}), "createCaches");
var defaults = createCaches();
var createResolveProtocol = /* @__PURE__ */ __name((proxyUrl, sessionData, timeout) => {
  let { protocolCache, resolveAlpnQueue } = defaults;
  if (sessionData) {
    if (!sessionData.protocolCache || !sessionData.resolveAlpnQueue) {
      Object.assign(sessionData, createCaches());
    }
    protocolCache = sessionData.protocolCache;
    resolveAlpnQueue = sessionData.resolveAlpnQueue;
  }
  const connectWithProxy = /* @__PURE__ */ __name(async (pOptions, pCallback) => {
    return connect(proxyUrl, pOptions, pCallback);
  }, "connectWithProxy");
  const resolveProtocol = auto2.createResolveProtocol(
    protocolCache,
    resolveAlpnQueue,
    connectWithProxy
  );
  return async (...args) => resolveProtocol({
    ...args[0],
    timeout
  });
}, "createResolveProtocol");

// src/hooks/browser-headers.ts
function mergeHeaders(original, overrides) {
  const fixedHeaders = /* @__PURE__ */ new Map();
  for (const entry of Object.entries(original)) {
    fixedHeaders.set(entry[0].toLowerCase(), entry);
  }
  for (const entry of Object.entries(overrides)) {
    fixedHeaders.set(entry[0].toLowerCase(), entry);
  }
  return Object.fromEntries(fixedHeaders.values());
}
__name(mergeHeaders, "mergeHeaders");
var getResolveProtocolFunction = /* @__PURE__ */ __name((options, proxyUrl, sessionData) => {
  const { resolveProtocol } = options;
  if (resolveProtocol) {
    return resolveProtocol;
  }
  if (proxyUrl) {
    return createResolveProtocol(proxyUrl, sessionData, Math.min(options?.timeout?.connect ?? 6e4, options?.timeout?.request ?? 6e4));
  }
  return (...args) => http22.auto.resolveProtocol({
    ...args[0],
    timeout: Math.min(options?.timeout?.connect ?? 6e4, options?.timeout?.request ?? 6e4)
  });
}, "getResolveProtocolFunction");
async function browserHeadersHook(options) {
  const { context } = options;
  const {
    headerGeneratorOptions,
    useHeaderGenerator,
    headerGenerator,
    proxyUrl
  } = context;
  const sessionData = context.sessionData;
  if (!useHeaderGenerator || !headerGenerator)
    return;
  const createHeadersPair = /* @__PURE__ */ __name(() => ({
    1: headerGenerator.getHeaders({
      httpVersion: "1",
      ...headerGeneratorOptions
    }),
    2: headerGenerator.getHeaders({
      httpVersion: "2",
      ...headerGeneratorOptions
    })
  }), "createHeadersPair");
  const url = options.url;
  const resolveProtocol = getResolveProtocolFunction(options, proxyUrl, sessionData);
  let alpnProtocol;
  if (url.protocol === "https:") {
    alpnProtocol = (await resolveProtocol({
      host: url.hostname,
      port: url.port || 443,
      rejectUnauthorized: false,
      ALPNProtocols: ["h2", "http/1.1"],
      servername: url.hostname
    })).alpnProtocol;
  }
  const httpVersion = alpnProtocol === "h2" ? "2" : "1";
  let generatedHeaders;
  if (sessionData) {
    if (!sessionData.headers) {
      sessionData.headers = createHeadersPair();
    }
    generatedHeaders = sessionData.headers[httpVersion];
  } else {
    generatedHeaders = headerGenerator.getHeaders({
      httpVersion,
      ...headerGeneratorOptions
    });
  }
  if (!options.decompress) {
    for (const key of Object.keys(generatedHeaders)) {
      if (key.toLowerCase() === "accept-encoding") {
        delete generatedHeaders[key];
      }
    }
  }
  options.headers = mergeHeaders(generatedHeaders, options.headers);
}
__name(browserHeadersHook, "browserHeadersHook");

// src/hooks/custom-options.ts
import "got";
function customOptionsHook(raw, options) {
  const typedRaw = raw;
  const names = [
    "proxyUrl",
    "headerGeneratorOptions",
    "useHeaderGenerator",
    "insecureHTTPParser",
    "sessionToken"
  ];
  for (const name of names) {
    if (name in raw) {
      options.context[name] = typedRaw[name];
      delete typedRaw[name];
    }
  }
}
__name(customOptionsHook, "customOptionsHook");

// src/hooks/fix-decompress.ts
import zlib from "node:zlib";
import "node:http";
import { PassThrough } from "node:stream";
import mimicResponse from "mimic-response";
var onResponse = /* @__PURE__ */ __name((response, propagate) => {
  const encoding = response.headers["content-encoding"]?.toLowerCase();
  const zlibOptions = {
    flush: zlib.constants.Z_SYNC_FLUSH,
    finishFlush: zlib.constants.Z_SYNC_FLUSH
  };
  const useDecompressor = /* @__PURE__ */ __name((decompressor) => {
    delete response.headers["content-encoding"];
    const result = new PassThrough({
      autoDestroy: false,
      destroy(error, callback) {
        response.destroy();
        callback(error);
      }
    });
    decompressor.once("error", (error) => {
      result.destroy(error);
    });
    response.pipe(decompressor).pipe(result);
    propagate(mimicResponse(response, result));
  }, "useDecompressor");
  if (encoding === "gzip" || encoding === "x-gzip") {
    useDecompressor(zlib.createGunzip(zlibOptions));
  } else if (encoding === "deflate" || encoding === "x-deflate") {
    let read = false;
    response.once("data", (chunk) => {
      read = true;
      response.unshift(chunk);
      const decompressor = (chunk[0] & 15) === 8 ? zlib.createInflate() : zlib.createInflateRaw();
      useDecompressor(decompressor);
    });
    response.once("end", () => {
      if (!read) {
        propagate(response);
      }
    });
  } else if (encoding === "br") {
    let read = false;
    response.once("data", (chunk) => {
      read = true;
      response.unshift(chunk);
      const decompressor = zlib.createBrotliDecompress();
      useDecompressor(decompressor);
    });
    response.once("end", () => {
      if (!read) {
        propagate(response);
      }
    });
  } else {
    propagate(response);
  }
}, "onResponse");
var fixDecompress = /* @__PURE__ */ __name((options, next) => {
  const result = next(options);
  result.on("request", (request) => {
    const emit = request.emit.bind(request);
    request.emit = (event, ...args) => {
      if (event === "response" && options.decompress) {
        const response = args[0];
        const emitted = request.listenerCount("response") !== 0;
        onResponse(response, (fixedResponse) => {
          emit("response", fixedResponse);
        });
        return emitted;
      }
      return emit(event, ...args);
    };
  });
  return result;
}, "fixDecompress");

// src/hooks/http2.ts
import "node:url";
import "got";
import { auto as auto3 } from "http2-wrapper";
function http2Hook(options) {
  const { proxyUrl, sessionData } = options.context;
  if (options.http2 && options.url.protocol !== "http:") {
    options.request = (url, requestOptions, callback) => {
      const typedRequestOptions = requestOptions;
      if (proxyUrl) {
        typedRequestOptions.resolveProtocol = createResolveProtocol(
          proxyUrl,
          sessionData,
          Math.min(options?.timeout?.connect ?? 6e4, options?.timeout?.request ?? 6e4)
        );
      }
      return auto3(url, typedRequestOptions, callback);
    };
  } else {
    options.request = void 0;
  }
}
__name(http2Hook, "http2Hook");

// src/hooks/insecure-parser.ts
import "got";
function insecureParserHook(options) {
  if (options.context.insecureHTTPParser !== void 0) {
    options._unixOptions = {
      // @ts-expect-error Private use
      ...options._unixOptions,
      insecureHTTPParser: options.context.insecureHTTPParser
    };
  }
}
__name(insecureParserHook, "insecureParserHook");

// src/hooks/options-validation.ts
import ow from "ow";
var validationSchema = {
  proxyUrl: ow.optional.string.url,
  useHeaderGenerator: ow.optional.boolean,
  headerGeneratorOptions: ow.optional.object,
  insecureHTTPParser: ow.optional.boolean,
  sessionToken: ow.optional.object
};
function optionsValidationHandler(options) {
  ow(options, ow.object.partialShape(validationSchema));
}
__name(optionsValidationHandler, "optionsValidationHandler");

// src/hooks/referer.ts
import { URL as URL6 } from "node:url";
var refererHook = /* @__PURE__ */ __name((options, response) => {
  const url = options.url;
  const resUrl = new URL6(response.url);
  const policy = response.headers["referer-policy"] || "strict-origin-when-cross-origin";
  if (policy === "no-referrer") {
    delete options.headers.referer;
  } else if (policy === "no-referrer-when-downgrade") {
    if (resUrl.protocol === "https:" && url.protocol === "http:") {
      delete options.headers.referer;
    } else {
      options.headers.referer = `${resUrl.origin}${resUrl.pathname}${resUrl.search}`;
    }
  } else if (policy === "origin") {
    options.headers.referer = resUrl.origin;
  } else if (policy === "origin-when-cross-origin") {
    if (url.origin === resUrl.origin) {
      options.headers.referer = `${resUrl.origin}${resUrl.pathname}${resUrl.search}`;
    } else {
      options.headers.referer = resUrl.origin;
    }
  } else if (policy === "same-origin") {
    if (url.origin === resUrl.origin) {
      options.headers.referer = `${resUrl.origin}${resUrl.pathname}${resUrl.search}`;
    } else {
      delete options.headers.referer;
    }
  } else if (policy === "strict-origin") {
    if (resUrl.protocol === "https:" && url.protocol === "http:") {
      delete options.headers.referer;
    } else {
      options.headers.referer = resUrl.origin;
    }
  } else if (policy === "strict-origin-when-cross-origin") {
    if (url.origin === resUrl.origin) {
      options.headers.referer = `${resUrl.origin}${resUrl.pathname}${resUrl.search}`;
    } else if (resUrl.protocol === "https:" && url.protocol === "http:") {
      delete options.headers.referer;
    } else {
      options.headers.referer = resUrl.origin;
    }
  } else if (policy === "unsafe-url") {
    options.headers.referer = `${resUrl.origin}${resUrl.pathname}${resUrl.search}`;
  }
}, "refererHook");

// src/hooks/storage.ts
import "got";
var _Storage = class _Storage {
  constructor() {
    __publicField(this, "storage");
    this.storage = /* @__PURE__ */ new WeakMap();
  }
  get(token) {
    if (!token) {
      return;
    }
    if (!this.storage.has(token)) {
      this.storage.set(token, {});
    }
    return this.storage.get(token);
  }
};
__name(_Storage, "Storage");
var Storage = _Storage;
var storage = new Storage();
var sessionDataHook = /* @__PURE__ */ __name((options) => {
  options.context.sessionData = storage.get(options.context.sessionToken);
}, "sessionDataHook");

// src/hooks/tls.ts
import "got";
var supportsFirefoxFully = Number(process.versions.node.split(".")[0]) >= 17;
var SSL_OP_TLSEXT_PADDING = 1 << 4;
var SSL_OP_NO_ENCRYPT_THEN_MAC = 1 << 19;
var ecdhCurve = {
  firefox: (supportsFirefoxFully ? [
    "X25519",
    "prime256v1",
    "secp384r1",
    "secp521r1",
    "ffdhe2048",
    "ffdhe3072"
  ] : [
    "X25519",
    "prime256v1",
    "secp384r1",
    "secp521r1"
  ]).join(":"),
  chrome: [
    "X25519",
    "prime256v1",
    "secp384r1"
  ].join(":"),
  safari: [
    "X25519",
    "prime256v1",
    "secp384r1",
    "secp521r1"
  ].join(":")
};
var sigalgs = {
  firefox: [
    "ecdsa_secp256r1_sha256",
    "ecdsa_secp384r1_sha384",
    "ecdsa_secp521r1_sha512",
    "rsa_pss_rsae_sha256",
    "rsa_pss_rsae_sha384",
    "rsa_pss_rsae_sha512",
    "rsa_pkcs1_sha256",
    "rsa_pkcs1_sha384",
    "rsa_pkcs1_sha512",
    "ECDSA+SHA1",
    "rsa_pkcs1_sha1"
  ].join(":"),
  chrome: [
    "ecdsa_secp256r1_sha256",
    "rsa_pss_rsae_sha256",
    "rsa_pkcs1_sha256",
    "ecdsa_secp384r1_sha384",
    "rsa_pss_rsae_sha384",
    "rsa_pkcs1_sha384",
    "rsa_pss_rsae_sha512",
    "rsa_pkcs1_sha512"
  ].join(":"),
  safari: [
    "ecdsa_secp256r1_sha256",
    "rsa_pss_rsae_sha256",
    "rsa_pkcs1_sha256",
    "ecdsa_secp384r1_sha384",
    "ECDSA+SHA1",
    "rsa_pss_rsae_sha384",
    "rsa_pkcs1_sha384",
    "rsa_pss_rsae_sha512",
    "rsa_pkcs1_sha512",
    "RSA+SHA1"
  ].join(":")
};
var knownCiphers = {
  chrome: [
    // Chrome v92
    "TLS_AES_128_GCM_SHA256",
    "TLS_AES_256_GCM_SHA384",
    "TLS_CHACHA20_POLY1305_SHA256",
    "ECDHE-ECDSA-AES128-GCM-SHA256",
    "ECDHE-RSA-AES128-GCM-SHA256",
    "ECDHE-ECDSA-AES256-GCM-SHA384",
    "ECDHE-RSA-AES256-GCM-SHA384",
    "ECDHE-ECDSA-CHACHA20-POLY1305",
    "ECDHE-RSA-CHACHA20-POLY1305",
    // Legacy:
    "ECDHE-RSA-AES128-SHA",
    "ECDHE-RSA-AES256-SHA",
    "AES128-GCM-SHA256",
    "AES256-GCM-SHA384",
    "AES128-SHA",
    "AES256-SHA"
  ].join(":"),
  firefox: [
    // Firefox v91
    "TLS_AES_128_GCM_SHA256",
    "TLS_CHACHA20_POLY1305_SHA256",
    "TLS_AES_256_GCM_SHA384",
    "ECDHE-ECDSA-AES128-GCM-SHA256",
    "ECDHE-RSA-AES128-GCM-SHA256",
    "ECDHE-ECDSA-CHACHA20-POLY1305",
    "ECDHE-RSA-CHACHA20-POLY1305",
    "ECDHE-ECDSA-AES256-GCM-SHA384",
    "ECDHE-RSA-AES256-GCM-SHA384",
    // Legacy:
    "ECDHE-ECDSA-AES256-SHA",
    "ECDHE-ECDSA-AES128-SHA",
    "ECDHE-RSA-AES128-SHA",
    "ECDHE-RSA-AES256-SHA",
    "AES128-GCM-SHA256",
    "AES256-GCM-SHA384",
    "AES128-SHA",
    "AES256-SHA",
    "DES-CBC3-SHA"
  ].join(":"),
  safari: [
    // Safari v14
    "TLS_AES_128_GCM_SHA256",
    "TLS_AES_256_GCM_SHA384",
    "TLS_CHACHA20_POLY1305_SHA256",
    "ECDHE-ECDSA-AES256-GCM-SHA384",
    "ECDHE-ECDSA-AES128-GCM-SHA256",
    "ECDHE-ECDSA-CHACHA20-POLY1305",
    "ECDHE-RSA-AES256-GCM-SHA384",
    "ECDHE-RSA-AES128-GCM-SHA256",
    "ECDHE-RSA-CHACHA20-POLY1305",
    // Legacy:
    "ECDHE-ECDSA-AES256-SHA384",
    "ECDHE-ECDSA-AES128-SHA256",
    "ECDHE-ECDSA-AES256-SHA",
    "ECDHE-ECDSA-AES128-SHA",
    "ECDHE-RSA-AES256-SHA384",
    "ECDHE-RSA-AES128-SHA256",
    "ECDHE-RSA-AES256-SHA",
    "ECDHE-RSA-AES128-SHA",
    "AES256-GCM-SHA384",
    "AES128-GCM-SHA256",
    "AES256-SHA256",
    "AES128-SHA256",
    "AES256-SHA",
    "AES128-SHA",
    "ECDHE-ECDSA-DES-CBC3-SHA",
    "ECDHE-RSA-DES-CBC3-SHA",
    "DES-CBC3-SHA"
  ].join(":")
};
var minVersion = {
  firefox: "TLSv1.2",
  chrome: "TLSv1",
  safari: "TLSv1.2"
};
var maxVersion = {
  firefox: "TLSv1.3",
  chrome: "TLSv1.3",
  safari: "TLSv1.3"
};
var secureOptions = {
  firefox: SSL_OP_TLSEXT_PADDING | SSL_OP_NO_ENCRYPT_THEN_MAC,
  chrome: SSL_OP_TLSEXT_PADDING | SSL_OP_NO_ENCRYPT_THEN_MAC,
  safari: SSL_OP_TLSEXT_PADDING | SSL_OP_NO_ENCRYPT_THEN_MAC
};
var requestOCSP = {
  firefox: true,
  chrome: true,
  safari: true
};
var getUserAgent = /* @__PURE__ */ __name((headers) => {
  for (const [header, value] of Object.entries(headers)) {
    if (header.toLowerCase() === "user-agent") {
      return value;
    }
  }
  return void 0;
}, "getUserAgent");
var getBrowser = /* @__PURE__ */ __name((userAgent) => {
  if (!userAgent) {
    return;
  }
  let browser;
  if (userAgent.includes("Firefox")) {
    browser = "firefox";
  } else if (userAgent.includes("Chrome")) {
    browser = "chrome";
  } else {
    browser = "safari";
  }
  return browser;
}, "getBrowser");
function tlsHook(options) {
  const { https: https3 } = options;
  if (https3.ciphers || https3.signatureAlgorithms || https3.minVersion || https3.maxVersion) {
    return;
  }
  const browser = getBrowser(getUserAgent(options.headers)) ?? "firefox";
  https3.ciphers = knownCiphers[browser];
  https3.signatureAlgorithms = sigalgs[browser];
  https3.ecdhCurve = ecdhCurve[browser];
  https3.minVersion = minVersion[browser];
  https3.maxVersion = maxVersion[browser];
  options._unixOptions = {
    // @ts-expect-error Private use
    ...options._unixOptions,
    secureOptions: secureOptions[browser],
    requestOCSP: requestOCSP[browser]
  };
}
__name(tlsHook, "tlsHook");

// src/index.ts
export * from "got";
var handlers = [
  fixDecompress
];
var beforeRequest = [
  insecureParserHook,
  sessionDataHook,
  http2Hook,
  proxyHook,
  browserHeadersHook,
  tlsHook
];
var init = [
  optionsValidationHandler,
  customOptionsHook
];
var beforeRedirect = [
  refererHook
];
var gotScraping = originalGot.extend({
  handlers,
  mutableDefaults: true,
  // Most of the new browsers use HTTP/2
  http2: true,
  https: {
    // In contrast to browsers, we don't usually do login operations.
    // We want the content.
    rejectUnauthorized: false
  },
  // Don't fail on 404
  throwHttpErrors: false,
  timeout: { request: 6e4 },
  retry: { limit: 0 },
  headers: {
    "user-agent": void 0
  },
  context: {
    headerGenerator: new HeaderGenerator2(),
    useHeaderGenerator: true,
    insecureHTTPParser: true
  },
  agent: {
    http: new TransformHeadersAgent(http3.globalAgent),
    https: new TransformHeadersAgent(https2.globalAgent)
  },
  hooks: {
    init,
    beforeRequest,
    beforeRedirect
  }
});
var setupDecodeURI = /* @__PURE__ */ __name(() => {
  const { set } = Object.getOwnPropertyDescriptor(Options8.prototype, "url");
  Object.defineProperty(Options8.prototype, "url", {
    set(value) {
      const originalDecodeURI = global.decodeURI;
      global.decodeURI = (str) => str;
      try {
        return set.call(this, value);
      } finally {
        global.decodeURI = originalDecodeURI;
      }
    }
  });
}, "setupDecodeURI");
setupDecodeURI();
var hooks = {
  init,
  beforeRequest,
  beforeRedirect,
  fixDecompress,
  insecureParserHook,
  sessionDataHook,
  http2Hook,
  proxyHook,
  browserHeadersHook,
  tlsHook,
  optionsValidationHandler,
  customOptionsHook,
  refererHook
};
export {
  TransformHeadersAgent,
  getAgents,
  gotScraping,
  hooks
};
//# sourceMappingURL=index.js.map