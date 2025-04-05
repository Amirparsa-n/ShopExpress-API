import type { Request, Response } from 'express';
import type { RootFilterQuery } from 'mongoose';

export class BaseController {
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
        return req.body[key] ?? req.query[key] ?? defaultValue;
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
        return this.getUniqueSlug(model, baseSlug, counter + 1);
    }

    /**
     * Handle pagination for MongoDB queries
     * @param dataKey show data key
     * @param page Current page number
     * @param limit Items per page
     * @param model Mongoose model
     * @param query MongoDB query object
     * @param populate Optional populate fields
     */
    async handlePagination(
        dataKey: string,
        model: any,
        query: RootFilterQuery<any> = {},
        page: number = 1,
        limit: number = 10,
        populate: string[] = []
    ) {
        const startIndex = (page - 1) * limit;
        const total = await model.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        let dataQuery = model.find(query).skip(startIndex).limit(limit);

        if (populate.length > 0) {
            populate.forEach((field) => {
                dataQuery = dataQuery.populate(field);
            });
        }

        const data = await dataQuery.exec();

        return {
            [dataKey]: data,
            pagination: {
                total,
                totalPages,
                currentPage: page,
                perPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                nextPage: page < totalPages ? page + 1 : null,
                prevPage: page > 1 ? page - 1 : null,
            },
        };
    }

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
}
