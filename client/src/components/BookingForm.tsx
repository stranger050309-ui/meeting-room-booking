import { useState } from 'react';
import { Room } from '../types';
import './BookingForm.css';

interface Props {
  room: Room;
  onSubmit: (data: {
    roomId: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    bookedBy: string;
  }) => void;
  onCancel: () => void;
}

export function BookingForm({ room, onSubmit, onCancel }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [title, setTitle] = useState('');
  const [bookedBy, setBookedBy] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !bookedBy.trim()) return;
    onSubmit({
      roomId: room.id,
      title: title.trim(),
      date,
      startTime,
      endTime,
      bookedBy: bookedBy.trim(),
    });
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h3>预约 {room.name}</h3>

      <div className="form-row">
        <label>
          日期
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <label>
          开始时间
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </label>
        <label>
          结束时间
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          会议主题
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：周会、项目评审"
            required
          />
        </label>
        <label>
          预约人
          <input
            type="text"
            value={bookedBy}
            onChange={(e) => setBookedBy(e.target.value)}
            placeholder="请输入姓名"
            required
          />
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit">确认预约</button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          取消
        </button>
      </div>
    </form>
  );
}
