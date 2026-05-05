import { Room } from '../types';
import './RoomList.css';

interface Props {
  rooms: Room[];
  selectedId: string | null;
  onSelect: (room: Room) => void;
  onAdd: () => void;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
}

export function RoomList({ rooms, selectedId, onSelect, onAdd, onEdit, onDelete }: Props) {
  return (
    <div className="room-list">
      <div className="room-list-header">
        <h2 className="room-list-title">会议室列表</h2>
        <button className="btn-add" onClick={onAdd}>+ 新增</button>
      </div>
      {rooms.length === 0 ? (
        <p className="room-list-empty">暂无会议室</p>
      ) : (
        rooms.map((room) => (
          <div
            key={room.id}
            className={`room-card ${selectedId === room.id ? 'selected' : ''}`}
          >
            <div className="room-card-main" onClick={() => onSelect(room)}>
              <div className="room-card-name">{room.name}</div>
              <div className="room-card-info">
                {room.location ? <span>{room.location}</span> : null}
                <span>容纳 {room.capacity} 人</span>
              </div>
              <div className="room-card-facilities">
                {room.facilities.slice(0, 3).map((f) => (
                  <span key={f} className="mini-tag">{f}</span>
                ))}
                {room.facilities.length > 3 && (
                  <span className="mini-tag">+{room.facilities.length - 3}</span>
                )}
              </div>
            </div>
            <div className="room-card-actions">
              <button
                className="btn-icon btn-edit"
                title="编辑"
                onClick={(e) => { e.stopPropagation(); onEdit(room); }}
              >
                ✎
              </button>
              <button
                className="btn-icon btn-delete-room"
                title="删除"
                onClick={(e) => { e.stopPropagation(); onDelete(room); }}
              >
                ✕
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
