import { config } from '../../shared/config';

import { AppServer } from './app-server';

let app = new AppServer(config).getApp();
export { app };