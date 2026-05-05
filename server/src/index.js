const express = require('express');
const path = require('path');
const roomsRouter = require('./routes/rooms');
const bookingsRouter = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingsRouter);

const staticDir = path.join(__dirname, '../../client/dist');
app.use(express.static(staticDir));
app.get('*', (_req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`会议室预约系统已启动: http://localhost:${PORT}`);
});
