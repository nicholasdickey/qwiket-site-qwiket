// server.js
require("regenerator-runtime");
require("regenerator-runtime/runtime");
require = require("esm")(module/*, options*/)

var favicon = require('serve-favicon');
const next = require('next')
var proxy = require('http-proxy-middleware');
const compression = require('compression')
//const routes = require("./routes")
const cookieParser = require("cookie-parser");
const cookieSession = require('cookie-session')
const { ssrParams, initSession } = require('./qwiket-lib/lib/ssrParams')
const { qwiketRouter } = require('./qwiket-lib/lib/qwiketRouter')
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
            let { host, ip, ua, pxid, anon } = ssrParams(req);


            newPath = updateQueryStringParameter(newPath, 'host', host);
            newPath = updateQueryStringParameter(newPath, 'xip', ip);
            newPath = updateQueryStringParameter(newPath, 'ua', ua);
            newPath = updateQueryStringParameter(newPath, 'pxid', pxid);
            newPath = updateQueryStringParameter(newPath, 'anon', anon);
            // console.log(chalk.green("PROXY API:"), { url: newPath });
        }
        else {
            //  console.log(chalk.blue("SSR PROXY API:"), { url: newPath });

        }
        return newPath;
    },
};

var loginApi = {
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
            let { host, ip, ua, pxid, anon } = ssrParams(req);


            newPath = updateQueryStringParameter(newPath, 'host', host);
            newPath = updateQueryStringParameter(newPath, 'xip', ip);
            newPath = updateQueryStringParameter(newPath, 'ua', ua);
            newPath = updateQueryStringParameter(newPath, 'pxid', pxid);
            newPath = updateQueryStringParameter(newPath, 'anon', anon);
            // console.log(chalk.green("PROXY API:"), { url: newPath });
        }
        else {
            //  console.log(chalk.blue("SSR PROXY API:"), { url: newPath });

        }
        return newPath;
    },
    /*
     let json = await response.json();

        console.log("Return:", json)
        if (json.success) {
            const redirect = json.redirect;
            console.log(chalk.red.bold("Login redirect: "), redirect)
            return res.redirect(redirect);
        }
        else {
            return res.status(500).json(json);
        }*/
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
    qwiketRouter(server, app);
    console.log("============================")
    server.use('/disqus-login', async (req, res) => {
        let { host, ip, ua, pxid, anon } = ssrParams(req);

        let u = `${url}/disqus-login?ua=${ua}&pxid=${pxid}&anon=${anon}&host=${host}&xip=${ip}`;
        console.log(chalk.red.bold("LOGIN API URL:"), u)
        let response = await fetch(u, {
            credentials: 'same-origin'
        })
        let json = await response.json();

        console.log("Return:", json)
        if (json.success) {
            const redirect = json.redirect;
            console.log(chalk.red.bold("Login redirect: "), redirect)
            return res.redirect(redirect);
        }
        else {
            return res.status(500).json(json);

        }
    });
    server.get('/disqus-logout', async (req, res) => {
        let { host, ip, ua, pxid, anon } = ssrParams(req);
        let channel = req.query.channel;
        let u = `${url}/qapi/user/disqus-logout?ua=${ua}&pxid=${pxid}&anon=${anon}&host=${host}&xip=${ip}`;
        console.log(chalk.red.bold("LOGOUT API URL:"), u)
        console.log(chalk.red.bold("CHANNELL:"), channel, host)
        let response = await fetch(u, {
            credentials: 'same-origin'
        })
        let json = await response.json();

        console.log("Return:", json)
        if (json.cookie) {

            const identity = json.cookie.identity;
            const anon = json.cookie.anon;
            const maxAge = 24 * 3600 * 30 * 1000 * 100;
            res.cookie('_ga', 'GA1.2.' + identity, { maxAge, sameSite: 'Lax' });
            res.cookie('qid', identity, { maxAge, sameSite: 'Lax' });
            res.cookie('identity', identity, { maxAge, sameSite: 'Lax' });
            res.cookie('anon', anon, { maxAge, sameSite: 'Lax' });
            server.get('/channel/:channel', (req, res) => {
                const actualPage = '/channel'
                const queryParams = { route: 'channel', channel: req.params.channel }
                app.render(req, res, actualPage, queryParams)
            })
            // return res.redirect(`${host}:/channel/${channel}`);
        }
        else {
            return res.status(500).json(json);

        }
    });

    server.use("/jsapi/?*", apiProxy);
    server.use("/api/?*", apiProxy);
    server.use("/qapi/?*", apiProxy);
    server.use("/ipn/?*", apiProxy);
    server.use("/ipndev/?*", apiProxy);
    server.use("/sitemap.txt", apiProxy);
    // server.use("/sitemaps/:name/?*", apiProxy);
    server.use("/dl/:filename?*", apiProxy);
    server.use('/cdn', apiProxy);


    server.use('/upload', apiProxy)
    /*
        server.get('/channel/:channel', async (req, res) => {
            const actualPage = '/channel'
            const queryParams = { route: 'channel', channel: req.params.channel, sel: 'newsline' }
            let logout = req.query.logout;
            if (logout) {
                let { host, ip, ua, pxid, anon } = ssrParams(req);
    
                let u = `${url}/qapi/user/disqus-logout?ua=${ua}&pxid=${pxid}&anon=${anon}&host=${host}&xip=${ip}`;
                console.log(chalk.red.bold("LOGOUT API URL:"), u)
                // console.log(chalk.red.bold("CHANNELL:"), req.params.channel, host)
                let response = await fetch(u, {
                    credentials: 'same-origin'
                })
                let json = await response.json();
    
                console.log("Return:", json)
                if (json.cookie) {
                    const identity = json.cookie.identity;
                    const anon = json.cookie.anon;
                    const maxAge = 24 * 3600 * 30 * 1000 * 100;
                    res.cookie('_ga', 'GA1.2.' + identity, { maxAge, sameSite: 'Lax' });
                    res.cookie('qid', identity, { maxAge, sameSite: 'Lax' });
                    res.cookie('identity', identity, { maxAge, sameSite: 'Lax' });
                    res.cookie('anon', anon, { maxAge, sameSite: 'Lax' });
                    req.cookies['identity'] = identity;
                    req.cookies['anon'] = anon;
    
                    // return res.redirect(`${host}:/channel/${channel}`);
                }
                else {
                    return res.status(500).json(json);
    
                }
            }
            app.render(req, res, actualPage, queryParams)
        })
        */
    /*
    server.get('/channel/:channel/find', (req, res) => {
        const actualPage = '/channel'
        const queryParams = { route: 'channel', channel: req.params.channel, find: 1, sel: 'newsline' }
        app.render(req, res, actualPage, queryParams)
    })*/
    /*
    server.get('/channel/:channel/qshow/:rootThreadid/:qwiketid', (req, res) => {
        const actualPage = '/channel'
        const queryParams = { route: 'qshow', channel: req.params.channel, rootThreadid: req.params.rootThreadid, qwiketid: req.params.qwiketid, sel: 'newsline' }
        console.log("QSHOW ======== --------------   >>>>>>>>>", queryParams)
        app.render(req, res, actualPage, queryParams)
    })

    server.get('/context/channel/:channel/rediro/topic/:threadid/?*', (req, res) => {
        const actualPage = '/context'
        const queryParams = { route: 'valid', sel: 'context' }
        app.render(req, res, actualPage, queryParams)
    })

    server.get('/context/rediro/topic/:threadid/?*', (req, res) => {
        const actualPage = '/context'
        const queryParams = { route: 'valid', sel: 'context' }
        app.render(req, res, actualPage, queryParams)
    })
    server.get('/rediro/topic/:threadid/?*', (req, res) => {
        const actualPage = '/context'
        const queryParams = { route: 'valid', sel: 'context' }
        app.render(req, res, actualPage, queryParams)
    })
    */
    /*  server.get('/context/channel/:channel/topic/:threadid/?*', (req, res) => {
          const actualPage = '/channel'
          const queryParams = { route: 'context' }
          // console.log("CONTEXT ======== --------------   >>>>>>>>>", queryParams)
          app.render(req, res, actualPage, queryParams)
      })
      server.get('/context/channel/:channel/hub/:hub/topic/:threadid/?*', (req, res) => {
          const actualPage = '/channel'
          const queryParams = { route: 'context' }
          // console.log("CONTEXT ======== --------------   >>>>>>>>>", queryParams)
          app.render(req, res, actualPage, queryParams)
      })*/
    /*server.get('/context/?*', (req, res) => {
        const actualPage = '/channel'
        const queryParams = { route: 'context', sel: "context" }
        // console.log("CONTEXT ======== --------------   >>>>>>>>>", queryParams)
        app.render(req, res, actualPage, queryParams)
    })*/
    /*
    server.get('/context/channel/:channel/topic/:threadid/tag/:shortname', (req, res) => {
        const actualPage = '/channel'
        const queryParams = { route: 'context', qwiketid: req.params.threadid, channel: req.params.channel, sel: 'context', shortname: req.params.shortname }
        // console.log("CONTEXT ======== --------------   >>>>>>>>>", queryParams)
        app.render(req, res, actualPage, queryParams)
    })
    server.get('/context/channel/:channel/topic/:threadid/tag/:shortname/cc/:cc', (req, res) => {
        const actualPage = '/channel'
        const queryParams = { route: 'context', qwiketid: req.params.threadid, channel: req.params.channel, sel: 'context', cc: req.params.cc, shortname: req.params.shortname }
        // console.log("CONTEXT ======== --------------   >>>>>>>>>", queryParams)
        app.render(req, res, actualPage, queryParams)
    })
    server.get('/context/channel/:channel/topic/:threadid/cc/:cc', (req, res) => {
        const actualPage = '/channel'
        const queryParams = { route: 'context', qwiketid: req.params.threadid, channel: req.params.channel, sel: 'context', cc: req.params.cc }
        // console.log("CONTEXT ======== --------------   >>>>>>>>>", queryParams)
        app.render(req, res, actualPage, queryParams)
    })

    server.get('/context/channel/:channel/topic/:threadid', (req, res) => {
        const actualPage = '/channel'
        const queryParams = { route: 'context', qwiketid: req.params.threadid, channel: req.params.channel, sel: 'context' }
        // console.log("CONTEXT ======== --------------   >>>>>>>>>", queryParams)
        app.render(req, res, actualPage, queryParams)
    })
    */
    /*
     server.get('/home/:shortname/?*', (req, res) => {
         const actualPage = '/context'
         const queryParams = { route: 'valid', sel: 'context' }
         app.render(req, res, actualPage, queryParams)
     })
 
     server.get('/channel/:channel/home:shortname/?*', (req, res) => {
         const actualPage = '/context'
         const queryParams = { route: 'valid', sel: 'context' }
         app.render(req, res, actualPage, queryParams)
     })
     server.get('/context/topic/:threadid/?*', (req, res) => {
         const actualPage = '/context'
         const queryParams = { route: 'valid', sel: 'context' }
         app.render(req, res, actualPage, queryParams)
     })
     server.get('/context/topic/:shortname/url/:url/?*', (req, res) => {
         const actualPage = '/context'
         const queryParams = { route: 'valid', sel: 'context' }
         app.render(req, res, actualPage, queryParams)
     })
     server.get('/context/channel/:channel/topic/:shortname/url/:url/?*', (req, res) => {
         const actualPage = '/context'
         const queryParams = { route: 'valid', sel: 'context' }
         app.render(req, res, actualPage, queryParams)
     })
 
 */

    //  .add('qview', '/qview/:rootThreadid/:qwiketid/(.*)?', 'dest')
    // .add('cc', '/cc/:cc/(.*)?', 'dest')
    /* server.get('/channel/:channel/?*', (req, res) => {
         const actualPage = '/channel'
         const queryParams = { route: 'valid' }
         // console.log("NEWSLINE ======== --------------   >>>>>>>>>", queryParams)
         app.render(req, res, actualPage, queryParams)
     })*/
    server.use("/get-session", async (req, res) => {
        var session = initSession(req);
        let r = {};
        r.session = session;
        r.success = true;
        console.log("GET_SESSION:", session)
        res.end(JSON.stringify(r, null, 4));
        logTime(t);
    });
    server.use("/update-session-param", async (req, res) => {
        console.log("update-session-param")
        let { name, value } = req.query;
        try {
            if (!req.session || !req.session.options) {
                req.session.options = initSession(req);
            }
            req.session.options[name] = value;
        }
        catch (x) {
            console.log({ x });
        }
        let r = {};
        r.session = req.session.options;
        r.success = true;
        res.end(JSON.stringify(r, null, 4));

    });

    ['/static*', '/_next*', '/_webpack*', '/__webpack_hmr*'].forEach(function (path) {
        console.log("adding next path:", path)
        server.get(path, function (req, res) {
            handle(req, res)
        })
    })
    server.get('/', (req, res) => {
        let { code, appid } = req.query;

        const actualPage = '/channel'
        const queryParams = { route: 'default', channel: 'landing', code, appid }
        app.render(req, res, actualPage, queryParams)
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

