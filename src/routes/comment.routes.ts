import commentController from '@controllers/comment.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { roleGuard } from '@middlewares/roleGuard.middleware';
import { V } from '@middlewares/validation.middleware';
import {
    addReplySchema,
    createCommentSchema,
    updateCommentSchema,
    updateReplySchema,
} from '@validators/comment.validation';
import { objectIdSchema } from '@validators/validation';
import { Router } from 'express';

const commentRouter = Router();

commentRouter.get('/all', authGuard, roleGuard('admin'), commentController.getAllComments);

commentRouter
    .route('/')
    .get(commentController.getComments)
    .post(authGuard, V({ body: createCommentSchema }), commentController.createComment);

commentRouter
    .use(authGuard)
    .route('/:id')
    .patch(V({ body: updateCommentSchema }), commentController.updateComment)
    .delete(roleGuard('admin'), commentController.deleteComment);

// * Reply comment

commentRouter
    .route('/:commentId/reply')
    .post(
        authGuard,
        V({ body: addReplySchema, params: objectIdSchema('commentId') }),
        commentController.createReplyComment
    );

commentRouter
    .use(authGuard)
    .route('/:commentId/reply/:replyId')
    .patch(
        V({ body: updateReplySchema, params: objectIdSchema(['commentId', 'replyId']) }),
        commentController.updateReplyComment
    )
    .delete(V({ params: objectIdSchema(['commentId', 'replyId']) }), commentController.deleteReplyComment);

export default commentRouter;
