// server.js
var favicon = require('serve-favicon');

const next = require('next')
var proxy = require('http-proxy-middleware');
const compression = require('compression')
//const routes = require("./routes")
const cookieParser = require("cookie-parser");
const cookieSession = require('cookie-session')
const chalk = require("chalk");
const app = next({ dev: process.env.NODE_ENV !== 'production' })
//const handler = routes.getRequestHandler(app)
const handle = app.getRequestHandler();
// With express
const express = require('express')
const server = express();
server.use(compression());

const url = 'http://' + process.env.QAPI + ':' + process.env.QAPIPORT;
const port = process.env.PORT || 3000;
console.log("API BASE URL:", url)
const updateQueryStringParameter = (path, key, value) => {
    const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    const separator = path.indexOf('?') !== -1 ? '&' : '?';
    if (path.match(re)) {
        return path.replace(re, '$1' + key + '=' + value + '$2');
    } else {
        return path + separator + key + '=' + value;
    }
};
// proxy middleware options
function relayRequestHeaders(proxyReq, req) {
    Object.keys(req.headers).forEach(function (key) {
        proxyReq.setHeader(key, req.headers[key]);
    });
}

function relayResponseHeaders(proxyRes, req, res) {
    Object.keys(proxyRes.headers).forEach(function (key) {
        console.log("relayResponseHeaders", proxyRes.headers[key])
        res.append(key, proxyRes.headers[key]);
    });
}
function initSession(session) {
    if (!session || !session.options) {
        // l(chalk.red("updSessionParam: no session"));
        session = {
            options: {
                init: 1,
                theme: 1,
                twitter: 1,
                activeTopics: 1,
                cover: 0,
                zoom: 'out',
                thick: 0,
                dense: 0,
                loud: 0,
                width: 0,
                channelConfig: 0,
                userConfig: 0
            }
        }
    }
    return session;
}
var optionsApi = {
    target: url, // target host
    //  logLevel: 'debug',

    onError(err, req, res) {
        console.log("ERROR", { url, err })
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        res.end(
            'Something went wrong. And we are reporting a custom error message.' + err
        );
    },
    pathRewrite: function (path, req) {
        let newPath = path;
        newPath = newPath.replace(/robots.txt/g, 'api?task=robots');
        newPath = newPath.replace(/sitemap.txt/, 'api?task=sitemap2');

        newPath = newPath.replace(/\bipn\b/, 'server/ipn.php?prod=1');
        newPath = newPath.replace(/\bipndev\b/, 'server/ipn.php?prod=0');

        if (newPath.indexOf("/sitemaps/") === 0)
            newPath = '/api?task=sitemap&name=req.params.name';
        else
            if (newPath.indexOf("/dl/") === 0)
                newPath = '/server/dl.php?image=req.params.filename';

        if (newPath.indexOf("ssr") < 0) {
            var parts = req.url.split('?');
            var query = parts[1] || '';
            const cookies = req.cookies;
            console.log("cookies:", cookies)
            console.log("headers:", req.headers)

            let identity = cookies['identity'];
            if (!identity) {
                identity = cookies['qid'] || '';
            }
            let anon_identity = cookies['anon_identity'];
            var hc = false;
            if (query && (query.indexOf("health_check") >= 0 || query.indexOf("drsyncdb") >= 0))
                hc = true;
            //  console.log("query",query,"hc=",hc); 
            var xFF = req.headers['x-forwarded-for'];
            var ua = encodeURIComponent(req.headers['user-agent'] || '');
            var ip = xFF ? xFF.split(',')[0] : req.connection.remoteAddress || '';
            console.log("IP: ", { ip, xFF, rip: req.connection.remoteAddress, identity, hostname: req.hostname, reqip: req.ip })
            var w = ip.split(':');
            //console.log("w=", w);
            ip = w ? w[w.length - 1] : ip;
            ip = req.ip;


            newPath = updateQueryStringParameter(newPath, 'host', req.headers.host);
            newPath = updateQueryStringParameter(newPath, 'xip', ip);
            newPath = updateQueryStringParameter(newPath, 'ua', ua);
            newPath = updateQueryStringParameter(newPath, 'pxid', identity);
            newPath = updateQueryStringParameter(newPath, 'anon', anon_identity);
            console.log(chalk.green("PROXY API:"), { url: newPath, remoteAddress: req.connection.remoteAddress });
        }
        else {
            console.log(chalk.blue("SSR PROXY API:"), { url: newPath });

        }
        return newPath;
    },
};

console.log("call prepare")
app.prepare().then(() => {
    console.log("prepare")

    server.use(express.json());       // to support JSON-encoded bodies
    server.use(express.urlencoded()); // to support URL-encoded bodies


    server.set('trust proxy', 'loopback');


    server.use(favicon(__dirname + '/public/img/blue-bell.png'));

    server.use(cookieParser());
    server.use(cookieSession({
        name: 'session', secret: '23987f',
        maxAge: 365 * 24 * 60 * 60 * 1000,

    }));

    var apiProxy = proxy(optionsApi);
    server.use("/robots.txt", apiProxy);

    server.use("/jsapi/?*", apiProxy);
    server.use("/api/?*", apiProxy);
    server.use("/qapi/?*", apiProxy);
    server.use("/ipn/?*", apiProxy);
    server.use("/ipndev/?*", apiProxy);
    server.use("/sitemap.txt", apiProxy);
    // server.use("/sitemaps/:name/?*", apiProxy);
    server.use("/dl/:filename?*", apiProxy);
    server.use('/cdn', apiProxy);
    server.use('/login', apiProxy);
    server.use('/logout', apiProxy);
    server.use('/upload', apiProxy)

    server.use("/get-session", async (req, res) => {
        var session = initSession(req.session);
        let ss = JSON.stringify(session);
        let r = {};
        r.session = session.options;
        r.success = true;
        res.end(JSON.stringify(r, null, 4));
        logTime(t);
    });
    server.use("/update-session-param", async (req, res) => {
        const t = logEnter('update-session', '');
        var session = req.session;
        let { name, value } = req.query;
        if (!session || !session.options) {
            // l(chalk.red("updSessionParam: no session"));
            session = {
                options: {
                    init: 1,
                    theme: 1,
                    twitter: 1,
                    activeTopics: 1,
                    cover: 0,
                    zoom: 'out',
                    thick: 0,
                    dense: 0,
                    loud: 0,
                    width: 0,
                    channelConfig: 0,
                    userConfig: 0
                }
            }
        }
        try {
            //console.log(chalk.green.bold("updSessionParam 1 session: "), { session });
            session.options[name] = value;
            // console.log(chalk.green.bold("updSessionParam 2 session: "), { session });
        }
        catch (x) {
            console.log({ x });
        }
        let r = {};
        r.options = session.options;
        r.success = true;
        res.end(JSON.stringify(r, null, 4));
        logTime(t);
    });

    //server.use(handler).listen(3000)
    /* server.get('*', (req, res) => {
         return handle(req, res)
       }) */
    ['/static*', '/_next*', '/_webpack*', '/__webpack_hmr*'].forEach(function (path) {
        console.log("adding next path:", path)
        server.get(path, function (req, res) {
            handle(req, res)
        })
    })
    server.get('*', (req, res) => {
        // console.log("APP request headers:", req.headers)
        return handle(req, res)
    })
    // console.log("calling server listen")
    server.listen(port, err => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })

}).catch(ex => {
    console.error(ex.stack)
    process.exit(1)
})

