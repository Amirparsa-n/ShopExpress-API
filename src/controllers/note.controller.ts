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

    // getNote = async (req: Request, res: Response): Promise<any> => {};

    // removeNote = async (req: Request, res: Response): Promise<any> => {};
}
export default new NoteController();
