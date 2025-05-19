import type { updateOrderSchema } from '@validators/order.validation';
import type { Request, Response } from 'express';
import type { z } from 'zod';

import orderModel from '@models/order.model';

import { BaseController } from './base.controller';

class OrderController extends BaseController {
    getAllOrders = async (req: Request, res: Response): Promise<any> => {
        const { page, limit } = req.query as { page: string; limit: string };
        const user = req.user;

        const orders = await this.handlePagination({
            dataKey: 'orders',
            model: orderModel,
            limit: +limit,
            page: +page,
            query: { ...(user.role === 'admin' ? {} : { user: user._id }) },
            sort: { createdAt: -1 },
            populate: ['user', 'items.product', 'items.seller'],
        });

        return this.successResponse(res, orders);
    };

    updateOrder = async (req: Request<any, any, z.infer<typeof updateOrderSchema>>, res: Response): Promise<any> => {
        const { id } = req.params;
        const { status, postTrackingCode } = req.body;

        const order = await orderModel.findByIdAndUpdate(id, { status, postTrackingCode }, { new: true });

        if (!order) {
            return this.errorResponse(res, 'Order not found', 404);
        }

        return this.successResponse(res, order, 'Order updated successfully');
    };
}

export default new OrderController();
