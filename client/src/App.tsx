import { useState, useCallback, useEffect } from 'react';
import { Room, Booking } from './types';
import {
  fetchRooms,
  fetchBookings,
  createBooking,
  cancelBooking,
  createRoom,
  updateRoom,
  deleteRoom,
} from './api';
import { RoomList } from './components/RoomList';
import { BookingForm } from './components/BookingForm';
import { BookingList } from './components/BookingList';
import { RoomFormDialog } from './components/RoomFormDialog';
import './App.css';

type View = 'rooms' | 'bookings';

export default function App() {
  const [view, setView] = useState<View>('rooms');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showRoomDialog, setShowRoomDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const loadRooms = useCallback(async () => {
    try {
      const data = await fetchRooms();
      setRooms(data);
    } catch {
      setError('加载会议室列表失败');
    }
  }, []);

  const loadBookings = useCallback(async (roomId?: string, date?: string) => {
    try {
      setLoading(true);
      const data = await fetchBookings(roomId, date);
      setBookings(data);
    } catch {
      setError('加载预约列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setShowForm(false);
    setError('');
    setSuccess('');
    loadBookings(room.id);
  };

  const handleBookClick = () => {
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleSubmitBooking = async (data: {
    roomId: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    bookedBy: string;
  }) => {
    try {
      setError('');
      await createBooking(data);
      setSuccess('预约成功！');
      setShowForm(false);
      loadBookings(data.roomId, data.date);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      setError('');
      await cancelBooking(id);
      setSuccess('预约已取消');
      loadBookings(selectedRoom?.id);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setShowRoomDialog(true);
    setError('');
    setSuccess('');
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setShowRoomDialog(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteRoom = async (room: Room) => {
    try {
      setError('');
      await deleteRoom(room.id);
      setSuccess(`已删除会议室"${room.name}"`);
      if (selectedRoom?.id === room.id) {
        setSelectedRoom(null);
      }
      loadRooms();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleRoomSave = async (data: {
    name: string;
    capacity: number;
    location: string;
    facilities: string[];
    description: string;
  }) => {
    try {
      setError('');
      if (editingRoom) {
        await updateRoom(editingRoom.id, data);
        setSuccess('会议室已更新');
        if (selectedRoom?.id === editingRoom.id) {
          setSelectedRoom({ ...selectedRoom, ...data });
        }
      } else {
        const newRoom = await createRoom(data);
        setSuccess('会议室已新增');
        setSelectedRoom(newRoom);
      }
      setShowRoomDialog(false);
      loadRooms();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>会议室预约系统</h1>
        <nav className="app-nav">
          <button
            className={view === 'rooms' ? 'active' : ''}
            onClick={() => setView('rooms')}
          >
            会议室列表
          </button>
          <button
            className={view === 'bookings' ? 'active' : ''}
            onClick={() => {
              setView('bookings');
              loadBookings();
            }}
          >
            全部预约
          </button>
        </nav>
      </header>

      {error && <div className="toast toast-error">{error}</div>}
      {success && <div className="toast toast-success">{success}</div>}

      <main className="app-main">
        {view === 'rooms' && (
          <div className="rooms-page">
            <div className="rooms-panel">
              <RoomList
                rooms={rooms}
                selectedId={selectedRoom?.id || null}
                onSelect={handleSelectRoom}
                onAdd={handleAddRoom}
                onEdit={handleEditRoom}
                onDelete={handleDeleteRoom}
              />
            </div>
            <div className="detail-panel">
              {selectedRoom ? (
                <div className="room-detail">
                  <div className="detail-header">
                    <div>
                      <h2>{selectedRoom.name}</h2>
                      <p className="detail-meta">
                        {selectedRoom.location} · 容纳 {selectedRoom.capacity} 人
                      </p>
                      <p className="detail-desc">{selectedRoom.description}</p>
                      <div className="facilities">
                        {selectedRoom.facilities.map((f) => (
                          <span key={f} className="tag">{f}</span>
                        ))}
                      </div>
                    </div>
                    <button className="btn-primary" onClick={handleBookClick}>
                      预约此会议室
                    </button>
                  </div>

                  {showForm && (
                    <BookingForm
                      room={selectedRoom}
                      onSubmit={handleSubmitBooking}
                      onCancel={() => setShowForm(false)}
                    />
                  )}

                  <h3 style={{ margin: '16px 0 8px' }}>
                    该会议室预约记录
                  </h3>
                  {loading ? (
                    <p className="loading-text">加载中...</p>
                  ) : (
                    <BookingList
                      bookings={bookings}
                      showRoom={false}
                      onCancel={handleCancelBooking}
                    />
                  )}
                </div>
              ) : (
                <div className="empty-hint">请从左侧选择一个会议室查看详情</div>
              )}
            </div>
          </div>
        )}

        {view === 'bookings' && (
          <div className="bookings-page">
            <h2>全部预约记录</h2>
            {loading ? (
              <p className="loading-text">加载中...</p>
            ) : (
              <BookingList
                bookings={bookings}
                showRoom
                rooms={rooms}
                onCancel={handleCancelBooking}
              />
            )}
          </div>
        )}
      </main>

      {showRoomDialog && (
        <RoomFormDialog
          room={editingRoom}
          onSave={handleRoomSave}
          onClose={() => setShowRoomDialog(false)}
        />
      )}
    </div>
  );
}
