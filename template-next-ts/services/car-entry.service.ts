import { authorizedAPI } from "@/config/axios.config";
import { UtilsService } from "./utils.service";
import {
  CreateCarEntryFormData,
  UpdateCarEntryFormData,
} from "@/lib/schema/car-entry.schema";

export class CarEntryService {
  constructor(private readonly utils: UtilsService) {}

  createCarEntry(data: CreateCarEntryFormData) {
    return this.utils.handleApiRequest(() =>
      authorizedAPI.post("/car-entry", data)
    );
  }

  updateCarExit({ id, data }: { id: string; data: UpdateCarEntryFormData }) {
    return this.utils.handleApiRequest(() =>
      authorizedAPI.put(`/car-entry/${id}/exit`, data)
    );
  }

  getAllCarEntries() {
    return this.utils.handleApiRequest(() => authorizedAPI.get("/car-entry"));
  }

  getTicket({ id }: { id: string }) {
    return this.utils.handleApiRequest(() =>
      authorizedAPI.get(`/car-entry/ticket/${id}`)
    );
  }

  getTicketForCarEntry({ carEntryId }: { carEntryId: string }) {
    return this.utils.handleApiRequest(() =>
      authorizedAPI.get(`/car-entry/ticket?carEntryId=${carEntryId}`)
    );
  }

  async getOutgoingCars({
    startDateTime,
    endDateTime,
  }: {
    startDateTime: string;
    endDateTime: string;
  }) {
    return this.utils.handleApiRequest(() =>
      authorizedAPI.get(
        `/car-entry/outgoing?startDateTime=${startDateTime}&endDateTime=${endDateTime}`
      )
    );
  }

  async getEnteredCars({
    startDateTime,
    endDateTime,
  }: {
    startDateTime: string;
    endDateTime: string;
  }) {
    return this.utils.handleApiRequest(() =>
      authorizedAPI.get(
        `/car-entry/entered?startDateTime=${startDateTime}&endDateTime=${endDateTime}`
      )
    );
  }
}
