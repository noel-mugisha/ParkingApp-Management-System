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
};