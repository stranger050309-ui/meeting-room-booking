const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { readJSON, writeJSON } = require('../storage');

router.get('/', (req, res) => {
  const { roomId, date } = req.query;
  let bookings = readJSON('bookings.json');

  if (roomId) {
    bookings = bookings.filter((b) => b.roomId === roomId);
  }
  if (date) {
    bookings = bookings.filter((b) => b.date === date);
  }

  bookings.sort((a, b) => a.startTime.localeCompare(b.startTime));
  res.json(bookings);
});

router.post('/', (req, res) => {
  const { roomId, title, date, startTime, endTime, bookedBy } = req.body;

  if (!roomId || !title || !date || !startTime || !endTime || !bookedBy) {
    return res.status(400).json({ error: '缺少必填字段' });
  }

  if (startTime >= endTime) {
    return res.status(400).json({ error: '开始时间必须早于结束时间' });
  }

  const rooms = readJSON('rooms.json');
  const room = rooms.find((r) => r.id === roomId);
  if (!room) {
    return res.status(404).json({ error: '会议室不存在' });
  }

  const bookings = readJSON('bookings.json');
  const conflict = bookings.find((b) => {
    if (b.roomId !== roomId || b.date !== date) return false;
    return startTime < b.endTime && endTime > b.startTime;
  });

  if (conflict) {
    return res.status(409).json({
      error: '该时段已被预约',
      conflict: `已被 "${conflict.title}" (${conflict.bookedBy}) 预约，时段 ${conflict.startTime}-${conflict.endTime}`,
    });
  }

  const booking = {
    id: uuidv4(),
    roomId,
    title,
    date,
    startTime,
    endTime,
    bookedBy,
    createdAt: new Date().toISOString(),
  };

  bookings.push(booking);
  writeJSON('bookings.json', bookings);

  res.status(201).json(booking);
});

router.delete('/:id', (req, res) => {
  let bookings = readJSON('bookings.json');
  const index = bookings.findIndex((b) => b.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: '预约不存在' });
  }

  const removed = bookings.splice(index, 1)[0];
  writeJSON('bookings.json', bookings);

  res.json({ message: '预约已取消', booking: removed });
});

module.exports = router;
