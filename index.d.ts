import * as Express from 'express';

export function redirectToHTTPS(ignoreHosts?: RegExp[], ignoreRoutes?: RegExp[], redirectCode?: number): (req: Express.Request, res: Express.Response, next: Express.NextFunction) => void;
