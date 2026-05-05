import { Room, Booking, BookingFormData } from './types';

const BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || '请求失败');
  }
  return data as T;
}

export function fetchRooms(): Promise<Room[]> {
  return request<Room[]>('/rooms');
}

export function fetchBookings(roomId?: string, date?: string): Promise<Booking[]> {
  const params = new URLSearchParams();
  if (roomId) params.set('roomId', roomId);
  if (date) params.set('date', date);
  const qs = params.toString();
  return request<Booking[]>(`/bookings${qs ? '?' + qs : ''}`);
}

export function createBooking(data: BookingFormData): Promise<Booking> {
  return request<Booking>('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function cancelBooking(id: string): Promise<{ message: string; booking: Booking }> {
  return request(`/bookings/${id}`, { method: 'DELETE' });
}

export function createRoom(data: Omit<Room, 'id'>): Promise<Room> {
  return request<Room>('/rooms', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateRoom(id: string, data: Partial<Omit<Room, 'id'>>): Promise<Room> {
  return request<Room>(`/rooms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteRoom(id: string): Promise<{ message: string; room: Room }> {
  return request(`/rooms/${id}`, { method: 'DELETE' });
}
