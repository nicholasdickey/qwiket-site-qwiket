// server.js
var favicon = require('serve-favicon');

const next = require('next')
var proxy = require('http-proxy-middleware');
const compression = require('compression')
//const routes = require("./routes")
//const cookieParser = require("cookie-parser");
//const cookieSession = require('cookie-session')
const chalk = require("chalk");
const app = next({ dev: process.env.NODE_ENV !== 'production' })
//const handler = routes.getRequestHandler(app)
const handle = app.getRequestHandler();
// With express
const express = require('express')
const server = express();
server.use(compression());

const url = 'http://' + process.env.QAPI + ':' + process.env.QAPIPORT;
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
    /*  pathRewrite: function (path, req) {
          let newPath = path;
          var parts = req.url.split('?');
          var query = parts[1] || '';
          const cookies = req.cookies;
          let identity = cookies['identity'];
          if (!identity) {
              identity = cookies['qid'] || '';
          }
          var hc = false;
          if (query && (query.indexOf("health_check") >= 0 || query.indexOf("drsyncdb") >= 0))
              hc = true;
          //  console.log("query",query,"hc=",hc); 
          var xFF = req.headers['x-forwarded-for'];
          var xRef = req.headers['x-forwarded-for'] || '';
          var ip = xFF ? xFF.split(',')[0] : req.connection.remoteAddress || '';
          var w = ip.split(':');
          //console.log("w=", w);
          ip = w ? w[w.length - 1] : ip;
          newPath = newPath.replace(/robots.txt/g, 'api?task=robots');
          newPath = newPath.replace(/sitemap.txt/, 'api?task=sitemap2');
  
          newPath = newPath.replace(/\bipn\b/, 'server/ipn.php?prod=1');
          newPath = newPath.replace(/\bipndev\b/, 'server/ipn.php?prod=0');
  
          if (newPath.indexOf("/sitemaps/") === 0)
              newPath = '/api?task=sitemap&name=req.params.name';
          else
              if (newPath.indexOf("/dl/") === 0)
                  newPath = '/server/dl.php?image=req.params.filename';
  
          newPath = updateQueryStringParameter(newPath, 'host', req.headers.host);
          newPath = updateQueryStringParameter(newPath, 'xip', ip);
          newPath = updateQueryStringParameter(newPath, 'xref', xRef);
          newPath = updateQueryStringParameter(newPath, 'pxid', identity);
          l(chalk.green("PROXY API:"), { url: newPath, remoteAddress: req.connection.remoteAddress });
          return newPath;
      }, */
};

console.log("call prepare")
app.prepare().then(() => {
    console.log("prepare")
    //  server.use(cookieParser());
    server.use(express.json());       // to support JSON-encoded bodies
    server.use(express.urlencoded()); // to support URL-encoded bodies


    server.set('trust proxy', 'linklocal', '159.203.156.141');


    server.use(favicon(__dirname + '/public/img/blue-bell.png'));



    var apiProxy = proxy(optionsApi);
    server.use("/robots.txt", apiProxy);

    server.use("/jsapi/?*", apiProxy);
    server.use("/api/?*", apiProxy);
    server.use("/qapi/?*", apiProxy);
    server.use("/ipn/?*", apiProxy);
    server.use("/ipndev/?*", apiProxy);
    server.use("/sitemap.txt", apiProxy);
    server.use("/sitemaps/:name/?*", apiProxy);
    server.use("/dl/:filename?*", apiProxy);
    server.use('/cdn', apiProxy);
    server.use('/login', apiProxy);
    server.use('/logout', apiProxy);
    server.use('/upload', apiProxy)

    //server.use('/static', express.static('static'))
    //server.use('/_next', express.static('_next'))
    console.log("after api register")



    console.log("after jsapi register");

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
        return handle(req, res)
    })
    // console.log("calling server listen")
    server.listen(3000, err => {
        if (err) throw err
        console.log('> Ready on http://localhost:3000')
    })

}).catch(ex => {
    console.error(ex.stack)
    process.exit(1)
})

