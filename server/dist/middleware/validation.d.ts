import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
export declare function validate(schema: Joi.ObjectSchema): (req: Request, res: Response, next: NextFunction) => void;
export declare function validateNotionPageIdMiddleware(req: Request, res: Response, next: NextFunction): void;
export declare function validateAirtableBaseIdMiddleware(req: Request, res: Response, next: NextFunction): void;
export declare function validateContentType(req: Request, res: Response, next: NextFunction): void;
export declare const validationSchemas: {
    provisionNotion: Joi.ObjectSchema<any>;
    provisionAirtable: Joi.ObjectSchema<any>;
    config: Joi.ObjectSchema<any>;
};
export default validate;
//# sourceMappingURL=validation.d.ts.map