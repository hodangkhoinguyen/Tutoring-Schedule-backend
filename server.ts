import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './route/auth.route';
import appointmentRoute from './route/appointment.route';
import scheduleRoute from './route/schedule.route';
import courseRoute from './route/course.route';
import userRoute from './route/user.route';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';

const app = express();
const corsOptions = {
    origin: true, //included origin as true
    credentials: true, //included credentials as true
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/appointment', appointmentRoute);
app.use('/api/v1/schedule', scheduleRoute);
app.use('/api/v1/course', courseRoute);
app.use('/api/v1/user', userRoute);

app.use('*', (req, res) => res.status(404).json({ err: 'URL not found' }));

export default app;
