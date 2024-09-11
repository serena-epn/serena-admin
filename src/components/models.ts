// export interface Todo {
//   id: number;
//   content: string;
// }

// export interface Meta {
//   totalCount: number;
// }

export interface TPatient {
  name: string;

  lastname: string;

  birthdate: string;

  contactInfo: string;

  idNumber: string;

  deviceId: string;

  createdAt: Date;
}

export interface TZone {
  _id: string;
  latitude: number;
  longitude: number;
  patient?: string;
}

export interface TPatient {
  _id: string;
  name: string;
  lastname: string;
  birthdate: string;
  contactInfo: string;
  idNumber: string;
  deviceId: string;
  device: TDevice;
  createdAt: Date;
  zone: TZone;
  patientId: string;
  __v: number;
}

export interface TDevice {
  _id: string;
  imei: number;
  phoneNumber: string;
  serialNumber: string;
  registeredAt: Date;
  lastUpdatedAt: Date;
  batteryCapacity: number;
  updateTime: number;
}

export interface TUser {
  _id: string;
  name: string;
  lastname: string;
  birthdate: string;
  phone: string;
  email: string;
  password: string;
  userType: number;
  idNumber: string;
  passwordReset: boolean;
  createdAt: Date;
  __v: number;
  patient: TPatient;
}
