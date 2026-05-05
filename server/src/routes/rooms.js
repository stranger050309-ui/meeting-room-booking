const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { readJSON, writeJSON } = require('../storage');

function validateRoom(body, isUpdate) {
  const errors = [];
  if (!isUpdate || body.name !== undefined) {
    if (!body.name || !body.name.trim()) errors.push('名称不能为空');
  }
  if (!isUpdate || body.capacity !== undefined) {
    if (!Number.isInteger(body.capacity) || body.capacity < 1) errors.push('容纳人数必须是正整数');
  }
  return errors;
}

router.get('/', (_req, res) => {
  const rooms = readJSON('rooms.json');
  res.json(rooms);
});

router.get('/:id', (req, res) => {
  const rooms = readJSON('rooms.json');
  const room = rooms.find((r) => r.id === req.params.id);
  if (!room) {
    return res.status(404).json({ error: '会议室不存在' });
  }
  res.json(room);
});

router.post('/', (req, res) => {
  const errors = validateRoom(req.body, false);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join('；') });
  }

  const rooms = readJSON('rooms.json');
  const room = {
    id: uuidv4(),
    name: req.body.name.trim(),
    capacity: req.body.capacity,
    location: (req.body.location || '').trim(),
    facilities: req.body.facilities || [],
    description: (req.body.description || '').trim(),
  };

  rooms.push(room);
  writeJSON('rooms.json', rooms);

  res.status(201).json(room);
});

router.put('/:id', (req, res) => {
  const rooms = readJSON('rooms.json');
  const index = rooms.findIndex((r) => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: '会议室不存在' });
  }

  const errors = validateRoom(req.body, true);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join('；') });
  }

  const existing = rooms[index];
  if (req.body.name !== undefined) existing.name = req.body.name.trim();
  if (req.body.capacity !== undefined) existing.capacity = req.body.capacity;
  if (req.body.location !== undefined) existing.location = (req.body.location || '').trim();
  if (req.body.facilities !== undefined) existing.facilities = req.body.facilities;
  if (req.body.description !== undefined) existing.description = req.body.description.trim();

  rooms[index] = existing;
  writeJSON('rooms.json', rooms);

  res.json(existing);
});

router.delete('/:id', (req, res) => {
  const rooms = readJSON('rooms.json');
  const index = rooms.findIndex((r) => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: '会议室不存在' });
  }

  const bookings = readJSON('bookings.json');
  const hasBookings = bookings.some((b) => b.roomId === req.params.id);
  if (hasBookings) {
    return res.status(400).json({ error: '该会议室有预约记录，无法删除。请先取消所有相关预约' });
  }

  const removed = rooms.splice(index, 1)[0];
  writeJSON('rooms.json', rooms);

  res.json({ message: '会议室已删除', room: removed });
});

module.exports = router;
