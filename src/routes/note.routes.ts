import noteController from '@controllers/note.controller';
import { authGuard } from '@middlewares/authGuard.middleware';
import { V } from '@middlewares/validation.middleware';
import { noteSchema } from '@validators/note.validation';
import { Router } from 'express';

const noteRouter = Router();

noteRouter
    .use(authGuard)
    .route('/?')
    .get(noteController.getNotes)
    .post(V({ body: noteSchema }), noteController.addNote);

noteRouter
    .use(authGuard)
    .route('/:id')
    .get(noteController.getNote)
    .delete(noteController.removeNote)
    .put(noteController.editNote);

export default noteRouter;
