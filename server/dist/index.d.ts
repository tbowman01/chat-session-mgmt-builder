import express from 'express';
declare class Server {
    app: express.Application;
    private startTime;
    constructor();
    private initializeMiddleware;
    private initializeRoutes;
    private initializeErrorHandling;
    start(): Promise<void>;
}
declare const server: Server;
declare const _default: express.Application;
export default _default;
export { server };
//# sourceMappingURL=index.d.ts.map