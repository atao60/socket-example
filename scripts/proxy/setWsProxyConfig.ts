/**
 * Update ws proxy configuration file
 * 
 */
import { config } from '../../shared/config';

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { env, exit } from 'process';

const proxyFilePath = env.PROXY_FILE_PATH || './ws-proxy.conf.json';

const proxyFileContent = existsSync(proxyFilePath) ? readFileSync(proxyFilePath, 'utf8') : "{}";

const proxyConf = JSON.parse(proxyFileContent);

if (config.ws.url === proxyConf.socketIoConfig.url) {
    exit(0);
}

proxyConf.socketIoConfig.url = config.ws.url;

const newFileContent = JSON.stringify(proxyConf, null, 2) + "\n";
writeFileSync(proxyFilePath, newFileContent, { "encoding": "utf8" });
