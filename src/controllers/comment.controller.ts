/* eslint-disable perfectionist/sort-classes */
import type { Request, Response } from 'express';

import { BaseController } from './base.controller';

class CommentController extends BaseController {
    getComments = async (req: Request, res: Response): Promise<any> => {};
    createComment = async (req: Request, res: Response): Promise<any> => {};
    updateComment = async (req: Request, res: Response): Promise<any> => {};
    deleteComment = async (req: Request, res: Response): Promise<any> => {};

    // Reply Comment
    createReplyComment = async (req: Request, res: Response): Promise<any> => {};
    updateReplyComment = async (req: Request, res: Response): Promise<any> => {};
    deleteReplyComment = async (req: Request, res: Response): Promise<any> => {};
}

export default new CommentController();
