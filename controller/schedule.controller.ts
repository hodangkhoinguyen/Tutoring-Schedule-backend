import { Request, Response } from 'express';
import User from '../model/user.model';
import Schedule from '../model/schedule.model';
import Appointment from '../model/appointment.model';

const WEEKDAYS = 7;

async function createSchedule(req: Request, res: Response) {
    try {
        const userId = req.body.userId;

        /*
        Check the format of schedule 
        {
            0: [[start, end], [start, end], ...], // Monday
            1: [[start, end], [start, end], ...], // Tuesday
            2: [[start, end], [start, end], ...], // Wednesday
            ...
        }
        */
        const isGoodFormat = (time: string) => {
            const regex = '^([0-1][0-9]|2[0-3]):(00|30)$';
            return time.match(regex);
        };

        for (let i = 0; i < WEEKDAYS; i++) {
            let currPeriodArr = req.body.schedule[i];

            for (let period of currPeriodArr) {
                // Check if each period has start and end time
                if (period.length !== 2) {
                    return res.status(406).json({
                        message: 'Wrong schedule format',
                    });
                }

                // Check the start and end time follow the format
                if (!isGoodFormat(period[0]) || !isGoodFormat(period[1]) || period[0] >= period[1]) {
                    return res.status(406).json({
                        message: 'Wrong schedule format',
                    });
                }
            }
        }

        const newSchedule = new Schedule({
            tutorId: userId,
            time: req.body.schedule,
        });

        await newSchedule.save();

        return res.json({ message: 'Create schedule successfully' });
    } catch (err) {
        return res.status(500).json({
            message: 'Cannot create schedule',
        });
    }
}

async function getAvailabilityByTutorId(tutorId: string, startDate: Date, endDate: Date) {
    // Query all availabilities for the date range
    const schedule = await Schedule.findOne({ tutorId: tutorId });
    if (!schedule) {
        return {};
    }

    // Appointments is a list of number that represents a list of time counts by milliseconds of appointments
    const appointments: number[] = (await Appointment.find({ tutorId: tutorId })).map((appointment) =>
        (appointment.date as Date).getTime(),
    );

    /*
        day: Date format
        time: String with format "hh:mm"
        return a Day with the same input date and set the input time
    */
    function createTime(day: Date, time: string): Date {
        const resultDate = new Date(day);
        resultDate.setHours(Number(time.split(':')[0]));
        resultDate.setMinutes(Number(time.split(':')[1]));
        return resultDate;
    }

    // Based on the day range, find all available sessions from the tutor
    let result: any = {};
    for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
        const periods = schedule.time[day.getDay()];
        const slots: any = [];

        // Based on availability periods, break them into 30-minute sessions
        for (let period of periods) {
            const start: number = createTime(day, period[0]).getTime();
            const end = createTime(day, period[1]).getTime();
            const diff = 60 * 30 * 1000; // milliseconds for 30 minutes

            for (let t: number = start; t < end; t += diff) {
                // Skip if an appointment occupies the session
                if (appointments.includes(t)) {
                    continue;
                }
                slots.push([new Date(t), new Date(t + diff)]);
            }
        }

        result[day.toDateString()] = slots;
    }
    return result;
}

async function getAvailabilityByTutor(req: Request, res: Response) {
    try {
        const tutorId = req.params.tutorId;
        let startDate: Date = req.query.startDate ? new Date(req.query.startDate as string) : new Date();
        let endDate: Date;
        if (req.query.endDate) {
            endDate = new Date(req.query.endDate as string);
        } else {
            endDate = new Date();
            endDate.setDate(startDate.getDate() + 14);
        }

        let result: any = await getAvailabilityByTutorId(tutorId, startDate, endDate);

        return res.json(result);
    } catch (err) {
        return res.status(500).json({
            message: 'Cannot get availability by tutor',
        });
    }
}

async function getAvailabilityByCourse(req: Request, res: Response) {
    try {
        const course = req.params.course;
        let startDate: Date = req.query.startDate ? new Date(req.query.startDate as string) : new Date();
        let endDate: Date;
        if (req.query.endDate) {
            endDate = new Date(req.query.endDate as string);
        } else {
            endDate = new Date();
            endDate.setDate(startDate.getDate() + 14);
        }

        const tutors = await User.find({
            $and: [{ courses: { $in: [course] } }, { roles: { $in: ['tutor'] } }],
        });

        const result: any = [];

        // Iterate through tutors to get each's availabilities
        for (let tutor of tutors) {
            const tutorId = tutor._id.toString();
            const availability = await getAvailabilityByTutorId(tutorId, startDate, endDate);
            const tutorResult: any = {
                tutorId: tutorId,
                email: tutor.email,
                name: tutor.name,
                courses: tutor.courses,
                availability: availability,
            };
            result.push(tutorResult);
        }
        return res.json(result);
    } catch (err) {
        return res.status(500).json({
            message: 'Cannot get availability by course',
        });
    }
}

async function updateSchedule(req: Request, res: Response) {
    try {
        const userId = req.body.userId;
        await Schedule.findOneAndUpdate(
            {
                tutorId: userId,
            },
            { time: req.body.schedule },
        );

        return res.json({ message: 'Update schedule successfully' });
    } catch (err) {
        return res.status(500).json({
            message: 'Cannot update schedule',
        });
    }
}

async function deleteSchedule(req: Request, res: Response) {
    try {
        const userId = req.body.userId;
        await Schedule.findOneAndDelete({
            tutorId: userId,
        });
        return res.json({ message: 'Delete schedule successfully' });
    } catch (err) {
        return res.status(500).json({
            message: 'Cannot delete schedule',
        });
    }
}

const scheduleCtrl = {
    createSchedule,
    getAvailabilityByTutor,
    getAvailabilityByCourse,
    updateSchedule,
    deleteSchedule,
};

export default scheduleCtrl;
