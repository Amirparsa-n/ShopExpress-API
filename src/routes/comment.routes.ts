import commentController from '@controllers/comment.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { roleGuard } from '@middlewares/roleGuard.middleware';
import { V } from '@middlewares/validation.middleware';
import { createCommentSchema } from '@validators/comment.validation';
import { Router } from 'express';

const commentRouter = Router();

commentRouter
    .route('/')
    .get(commentController.getComments)
    .post(authGuard, V({ body: createCommentSchema }), commentController.createComment);

commentRouter
    .use(authGuard)
    .route('/:id')
    .patch(commentController.updateComment)
    .delete(roleGuard('admin'), commentController.deleteComment);

commentRouter.route('/:commentId/reply').post(authGuard, commentController.createReplyComment);
commentRouter
    .use(authGuard)
    .route('/:commentId/reply/:replyId')
    .patch(commentController.updateComment)
    .delete(commentController.deleteComment);

export default commentRouter;
