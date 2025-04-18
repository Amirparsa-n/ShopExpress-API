import type { Request, Response } from 'express';

import noteModel from '@models/note.model';
import productModel from '@models/product.model';

import { BaseController } from './base.controller';

class NoteController extends BaseController {
    addNote = async (req: Request, res: Response): Promise<any> => {
        const { productId, content } = req.body;
        const user = req.user;

        const product = await productModel.findById(productId);
        if (!product) {
            return this.errorResponse(res, 'Product not found', 404);
        }

        const existingNote = await noteModel.findOne({ user: user._id, product: productId });

        if (existingNote) {
            return this.errorResponse(res, 'Note already exists', 400);
        }

        const newNote = await noteModel.create({
            user: user._id,
            product: productId,
            content,
        });

        return this.successResponse(res, newNote, 'Note added successfully');
    };

    // editNote = async (req: Request, res: Response): Promise<any> => {};

    getNote = async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params;
        const user = req.user;

        const note = await noteModel
            .findOne({ _id: id, user: user._id })
            .populate('product')
            .populate('user', 'firstName lastName phone email')
            .lean();

        if (!note) {
            return this.errorResponse(res, 'Note not found', 404);
        }

        if (!note.product) {
            await noteModel.findByIdAndDelete(id);
            return this.errorResponse(res, 'This Product has been removed !!', 404);
        }

        return this.successResponse(res, note);
    };

    getNotes = async (req: Request<any, any, any, { page: string; limit: string }>, res: Response): Promise<any> => {
        const { page, limit } = req.query;
        const user = req.user;

        const notes = await this.handlePagination('notes', noteModel, { user: user._id }, +page, +limit, [
            'product',
            { path: 'user', select: 'firstName lastName phone email' },
        ]);

        return this.successResponse(res, notes);
    };

    // removeNote = async (req: Request, res: Response): Promise<any> => {};
}
export default new NoteController();
