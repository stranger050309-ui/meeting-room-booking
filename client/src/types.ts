export interface Room {
  id: string;
  name: string;
  capacity: number;
  location: string;
  facilities: string[];
  description: string;
}

export interface Booking {
  id: string;
  roomId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  bookedBy: string;
  createdAt: string;
}

export interface BookingFormData {
  roomId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  bookedBy: string;
}
