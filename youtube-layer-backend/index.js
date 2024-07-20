const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
var cors = require( 'cors' );

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

/* Routes */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/youtube', require('./routes/youtubeRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

/* Custom error handler middleware */
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});