import { Booking, Room } from '../types';
import './BookingList.css';

interface Props {
  bookings: Booking[];
  showRoom?: boolean;
  rooms?: Room[];
  onCancel: (id: string) => void;
}

export function BookingList({ bookings, showRoom, rooms, onCancel }: Props) {
  const getRoomName = (roomId: string) => {
    if (!rooms) return roomId;
    const room = rooms.find((r) => r.id === roomId);
    return room ? room.name : roomId;
  };

  if (bookings.length === 0) {
    return <p className="booking-empty">暂无预约记录</p>;
  }

  return (
    <div className="booking-list">
      {bookings.map((b) => (
        <div key={b.id} className="booking-item">
          <div className="booking-info">
            <div className="booking-title">{b.title}</div>
            <div className="booking-meta">
              {showRoom && (
                <span className="booking-room">{getRoomName(b.roomId)}</span>
              )}
              <span>{b.date}</span>
              <span>
                {b.startTime} - {b.endTime}
              </span>
              <span>预约人：{b.bookedBy}</span>
            </div>
          </div>
          <button
            className="btn-cancel-sm"
            onClick={() => onCancel(b.id)}
          >
            取消预约
          </button>
        </div>
      ))}
    </div>
  );
}
