/**
 * Created by zhwang.kevin on 2017/1/24.
 */
var FdfsClient = require('fdfs');

exports.fdfs = new FdfsClient({
    // tracker servers
    trackers: [
        {
            // host: '10.101.1.165',
            host: '101.37.22.3',//'172.16.36.1',//'10.101.1.165',//'123.59.144.47','10.101.1.165'
            port: 22122
        }
    ],
    timeout: 10000,
    //defaultExt: 'txt',
    charset: 'utf8'
});