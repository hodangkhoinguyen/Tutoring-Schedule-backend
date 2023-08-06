import { Request, Response } from 'express';

const Course = ['Math', 'Chemistry', 'Computer Science', 'Biology', 'Design', 'Physics', 'Art', 'Statistics'];

async function getAllCourses(req: Request, res: Response) {
    try {
        return res.json(Course);
    } catch (err) {
        return res.status(500).send({
            error: (err as Error).message,
            message: 'Cannot get course list',
        });
    }
}

const courseCtrl = {
    getAllCourses
};

export default courseCtrl;
