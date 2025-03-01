import { Request, Response } from 'express';

export class BaseController {
    /**
     * send success response
     * @param res Response
     * @param data response data
     * @param message success message
     * @param statusCode HTTP status code
     */
    successResponse(res: Response, data: any = null, message: string = 'Success', statusCode: number = 200): Response {
        const response: Record<string, any> = {
            success: true,
            message,
        };

        if (data !== null) {
            response.data = data;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * send error response
     * @param res Response
     * @param message error message
     * @param statusCode HTTP status code
     * @param errors error details
     */
    errorResponse(
        res: Response,
        message: string = 'Something went wrong',
        statusCode: number = 500,
        errors: any = null
    ): Response {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
        });
    }

    /**
     * get param Query or Body
     * @param req Request
     * @param key key of param
     * @param defaultValue default value of param
     */
    getParam(req: Request, key: string, defaultValue: any = null): any {
        return req.body[key] || req.query[key] || defaultValue;
    }
    /**
     * return unique slug
     * @param model
     * @param baseSlug
     * @param counter
     * @returns
     */
    public async getUniqueSlug(model: any, baseSlug: string, counter: number = 1): Promise<string> {
        const currentSlug = counter === 1 ? baseSlug : `${baseSlug}-${counter}`;
        const existingSlug = await model.findOne({ slug: currentSlug }).exec();
        if (!existingSlug) {
            return currentSlug;
        }
        return await this.getUniqueSlug(model, baseSlug, counter + 1);
    }
}
