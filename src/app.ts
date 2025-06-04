import express from 'express';
import partRoutes from './routes/part.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(express.json());
app.use('/api/part', partRoutes);
app.use(errorHandler);

export default app;



// import express from 'express';
// import partRoutes from './routes/part.routes';
// import { errorHandler } from './middleware/error.middleware';

// const app = express();

// app.use(express.json());
// app.use('/api', partRoutes);
// app.use(errorHandler);

// export default app;
