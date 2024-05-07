// infra related
const ipRangeCheck = require('ip-range-check');
const pclient = require('prom-client');

// logging
const morgan = require('morgan');

// tracing
// tbd

const privateCdir = [
    "127.0.0.0/8", // IPv4 loopback
    "10.0.0.0/8", // RFC1918
    "172.16.0.0/12", // RFC1918
    "192.168.0.0/16", // RFC1918
    "169.254.0.0/16", // RFC3927 link-local
    "::1/128", // IPv6 loopback
    "fe80::/10", // IPv6 link-local
    "fc00::/7", // IPv6 unique local addr
];

function isPrivateIP(ip) {
    return ipRangeCheck(ip, privateCdir);
}

// prom
const registry = new pclient.Registry();
const registryAppMemory = new pclient.Registry();
const registryAppResources = new pclient.Registry();

// App nodejs memory
const pmNodejsMemoryRss = new pclient.Gauge({
    name: 'nodejs_memory_rss',
    help: 'Resident Set Size is mount of space occupied in the main memory device.',
    async collect() {
        const mem = process.memoryUsage();
        this.set(mem.rss || 0);
    },
});
const pmNodejsMemoryHeapTotal = new pclient.Gauge({
    name: 'nodejs_memory_heap_total',
    help: 'V8 Memory usage',
    async collect() {
        const mem = process.memoryUsage();
        this.set(mem.heapTotal || 0);
    }
});
const pmNodejsMemoryHeapUsed = new pclient.Gauge({
    name: 'nodejs_memory_heap_used',
    help: 'V8 memory usage',
    async collect() {
        const mem = process.memoryUsage();
        this.set(mem.heapUsed || 0);
    }
});
const pmNodejsMemoryExternal = new pclient.Gauge({
    name: 'nodejs_memory_external',
    help: ' Memory usage of C++ objects bound to JavaScript objects managed by V8',
    async collect() {
        const mem = process.memoryUsage();
        this.set(mem.external || 0);
    }
});
const pmNodejsMemoryArrayBuffers = new pclient.Gauge({
    name: 'nodejs_memory_array_buffers',
    help: 'Memory allocated for ArrayBuffers and SharedArrayBuffer',
    async collect() {
        const mem = process.memoryUsage();
        this.set(mem.arrayBuffers || 0);
    }
});
registryAppMemory.registerMetric(pmNodejsMemoryRss);
registryAppMemory.registerMetric(pmNodejsMemoryHeapTotal);
registryAppMemory.registerMetric(pmNodejsMemoryHeapUsed);
registryAppMemory.registerMetric(pmNodejsMemoryExternal);
registryAppMemory.registerMetric(pmNodejsMemoryArrayBuffers);


// App nodejs resources
const pmNodejsResourcesFsRead = new pclient.Gauge({
    name: 'nodejs_resources_fs_read',
    help: 'Number of read file system operations',
    async collect() {
        const rsc = process.resourceUsage();
        this.set(rsc.fsRead || 0);
    }
});
const pmNodejsResourcesFsWrite = new pclient.Gauge({
    name: 'nodejs_resources_fs_write',
    help: 'Number of write file system operations',
    async collect() {
        const rsc = process.resourceUsage();
        this.set(rsc.fsWrite || 0);
    }
});
const pmNodejsResourcesIPCRead = new pclient.Gauge({
    name: 'nodejs_resources_ipc_read',
    help: 'Number of read IPC operations',
    async collect() {
        const rsc = process.resourceUsage();
        this.set(rsc.ipcRead || 0);
    }
});
const pmNodejsResourcesIPCWrite = new pclient.Gauge({
    name: 'nodejs_resources_ipc_write',
    help: 'Number of write IPC operations',
    async collect() {
        const rsc = process.resourceUsage();
        this.set(rsc.ipcWrite || 0);
    }
});
const pmNodejsResourcesSharedMemorySize = new pclient.Gauge({
    name: 'nodejs_resources_shared_memory_size',
    help: 'Number of shared memory',
    async collect() {
        const rsc = process.resourceUsage();
        this.set(rsc.sharedMemorySize || 0);
    }
});
registryAppResources.registerMetric(pmNodejsResourcesFsRead);
registryAppResources.registerMetric(pmNodejsResourcesFsWrite);
registryAppResources.registerMetric(pmNodejsResourcesIPCRead);
registryAppResources.registerMetric(pmNodejsResourcesIPCWrite);
registryAppResources.registerMetric(pmNodejsResourcesSharedMemorySize);


// App related
registry.setDefaultLabels({
    app: 'backend-nodejs',
    env: process.env.NODE_ENV,
});
const pmTotalRequest = new pclient.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests.',
    labelNames: ['method', 'path'],
});
const pmResponseStatus = new pclient.Counter({
    name: 'http_response_status',
    help: 'Status code of HTTP responses.',
    labelNames: ['method', 'path', 'status_code'],
});
const pmHttpRequestDuration = new pclient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['path'],
    buckets: pclient.linearBuckets(0.01, 0.05, 10),
});
registry.registerMetric(pmTotalRequest);
registry.registerMetric(pmResponseStatus);
registry.registerMetric(pmHttpRequestDuration);


const mergedRegistry = pclient.Registry.merge([
    registryAppMemory,
    registryAppResources,
    registry,
]);


/**
 *
 * @param req {e.Request}
 * @param res {e.Response}
 * @return {Promise<*>}
 */
async function ready(req, res) {
    return res.status(200).end('.');
}

/**
 *
 * @param req {e.Request}
 * @param res {e.Response}
 * @return {Promise<*>}
 */
async function health(req, res) {
    return res.status(200).end('.');
}

async function metrics(req, res, next) {
    res.status(200)
        .set('Content-Type', mergedRegistry.contentType)
        .send(await mergedRegistry.metrics());
}

const infraRouter = {
    '/metrics': metrics,
    '/healthz': health,
    '/readyz': ready,
};

/**
 * infra middleware
 *
 * @param {Request<ParsedQs>} req
 * @param {Response|ServerResponse} res
 * @param {NextFunction} next
 */
function bootstrapInfraMiddleware(req, res, next) {
    const isPrivateCdir = isPrivateIP(req.ip);
    const internalHealthcheck = req.headers['x-internal-healthcheck'] || null;
    const cfConnectingIP = req.headers['cf-connecting-ip'] || null;
    const f = infraRouter[req.path] || null;
    if (f) {
        if (!(isPrivateCdir || internalHealthcheck) || cfConnectingIP) {
            return next();
        }
        return f(req, res
            .set('X-Infra', '0'));
    }

    // other else, do metrices
    const pmEndTimerDuration = pmHttpRequestDuration.startTimer();
    const origEnd = res.end;
    res.end = function (...args) {
        origEnd.apply(this, arguments);
        pmEndTimerDuration();
        pmResponseStatus.inc({
            method: req.method,
            path: req.path,
            status_code: res.statusCode,
        });
        pmTotalRequest.inc({
            method: req.method,
            path: req.path,
        });
    };
    next();
}

/**
 *  app setting
 */
function appSetting(app) {
    const {
        fmt,
        config,
    } = app.get('env') === 'development' ? {
        fmt: 'dev',
        config: null,
    } : {
        fmt: 'tiny',
        config: {
            skip: (req, res) => {
                return res.statusCode < 400;
            },
        },
    };
    console.log("app env: " + app.get('env'));
    app.use(morgan(fmt, config));
}

exports.bootstrapInfraMiddleware = bootstrapInfraMiddleware;
exports.metrics = metrics;
exports.appSetting = appSetting;
