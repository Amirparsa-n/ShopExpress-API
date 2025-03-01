import { Request, Response, Router } from 'express';

// /api/users
const userRoute = Router();

userRoute.get('/', (req: Request, res: Response) => {
    res.json([]);
});

export default userRoute;
