type CarEntry = {
  id: string;
  plateNumber: string;
  parkingCode: string;
  entryDateTime: string;
  exitDateTime: string | null;
  chargedAmount: number;
  parkingId: string;
  createdAt: string;
  updatedAt: string;
};

type Ticket = {
  id: string;
  plateNumber: string;
  parkingName: string;
  entryDateTime: string;
  carEntryId: string;
  parkingId: string;
  parking?: {
    id: string;
    parkingName: string;
    numberOfAvailableSpaces: number;
    chargingFeesPerHour: number;
    createdAt: string;
    updatedAt: string;
  };
  carEntry?: CarEntry;
};