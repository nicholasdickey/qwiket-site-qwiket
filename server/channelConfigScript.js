var mysql = require('mysql');
const util = require('util');
const chalk = require('chalk');
chalk.enabled = true;
var connectionDr = mysql.createConnection({
    host: '167.99.225.235',
    user: 'root',
    password: 'nudela2008',
    database: 'povdb'
});
const queryDr = util.promisify(connectionDr.query).bind(connectionDr);
connectionDr.connect();

async function newslines(channel, parent) {
    let sql = `select * from pov_v51_newslines where channel? and parent=?`;
    var inserts = [channel, parent];
    sql = await mysql.format(sql, inserts);
    let results = await queryDr(sql);
    let json = 'children:{\n';
    results.forEach(async result => {
        let shortname = result['shortname'];

    })
}
async function script() {
    let sql = "select * from pov_v51_channels";
    let results = await queryDr(sql);
    // results = results.results;
    console.log({ results })
    results.forEach(async result => {
        let channel = result['channel'];
        let name = result['name'];
        let description = result['description'];
        let logo = result['logo'];
        let logoSrc = result['logo_src']
        let communityBoardName = result['community_board_name'];
        let communityBoardThreadid = result['community_board_threadid'];
        let disqusForum = result['forum'];
        let shortname = result['shortname'];
        let nickname = result['nickname'];
        let entity = result['entity'];
        let twitter = result['twitter'];
        let public = result['public'];
        let avatar = result['avatar'];
        let avatarSrc = result['avatar_src'];
        let fullDescription = result['full_description'];
        let hometown = result['hometown'];

        let newslines = await newslines(channel, '');


    })

    connectionDr.end();
}
script();
