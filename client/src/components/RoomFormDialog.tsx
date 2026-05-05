import { useState } from 'react';
import { Room } from '../types';
import './RoomFormDialog.css';

interface Props {
  room?: Room | null;
  onSave: (data: {
    name: string;
    capacity: number;
    location: string;
    facilities: string[];
    description: string;
  }) => void;
  onClose: () => void;
}

export function RoomFormDialog({ room, onSave, onClose }: Props) {
  const isEdit = !!room;
  const [name, setName] = useState(room?.name || '');
  const [capacity, setCapacity] = useState(room?.capacity || 6);
  const [location, setLocation] = useState(room?.location || '');
  const [description, setDescription] = useState(room?.description || '');
  const [facilitiesText, setFacilitiesText] = useState(
    room?.facilities?.join('，') || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const facilities = facilitiesText
      .split(/[,，、]/)
      .map((f) => f.trim())
      .filter(Boolean);
    onSave({
      name: name.trim(),
      capacity,
      location: location.trim(),
      facilities,
      description: description.trim(),
    });
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h3>{isEdit ? '编辑会议室' : '新增会议室'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="dialog-field">
            <label>名称 *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：创新厅"
              required
            />
          </div>
          <div className="dialog-field">
            <label>容纳人数 *</label>
            <input
              type="number"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              required
            />
          </div>
          <div className="dialog-field">
            <label>位置 *</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="例如：3楼A区"
              required
            />
          </div>
          <div className="dialog-field">
            <label>设施（逗号分隔）</label>
            <input
              value={facilitiesText}
              onChange={(e) => setFacilitiesText(e.target.value)}
              placeholder="例如：投影仪，白板，视频会议"
            />
          </div>
          <div className="dialog-field">
            <label>描述</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简短描述会议室用途"
            />
          </div>
          <div className="dialog-actions">
            <button type="submit" className="btn-submit">
              {isEdit ? '保存修改' : '确认新增'}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
