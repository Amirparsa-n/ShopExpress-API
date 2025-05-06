import commentController from '@controllers/comment.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { roleGuard } from '@middlewares/roleGuard.middleware';
import { Router } from 'express';

const commentRouter = Router();

commentRouter.route('/').get(commentController.getComments).post(commentController.createComment);

commentRouter
    .route('/:id')
    .patch(authGuard, commentController.updateComment)
    .delete(authGuard, roleGuard('admin'), commentController.deleteComment);

commentRouter.route('/:commentId/reply').post(authGuard, commentController.createReplyComment);
commentRouter
    .route('/:commentId/reply/:replyId')
    .patch(commentController.updateComment)
    .delete(commentController.deleteComment);

export default commentRouter;
