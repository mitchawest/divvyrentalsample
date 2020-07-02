import { Request, Response, NextFunction } from 'express';

export interface IdentifiedRequest extends Request {
    requestId: string;
    authorized: boolean;
}

export interface IdentifiedRequestHandler {
    (req: IdentifiedRequest, res: Response, next: NextFunction): void;
}

export interface IdentifiedErrorHandler {
    (err: {[key: string]: string}, req: IdentifiedRequest, res: Response, next: NextFunction): void;
}
