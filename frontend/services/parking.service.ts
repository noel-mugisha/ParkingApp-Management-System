import { authorizedAPI } from "@/config/axios.config";
import { UtilsService } from "./utils.service";
import { CreateParkingFormData, UpdateParkingFormData } from "@/lib/schema/parking.schema";

export class ParkingService {
    constructor(
        private readonly utils: UtilsService
    ) { }

    createParking(data: CreateParkingFormData) {
        return this.utils.handleApiRequest(() => authorizedAPI.post('/parking', data))
    }

    getAllParkings() {
        return this.utils.handleApiRequest(() => authorizedAPI.get('/parking'))
    }

    updateParking({ id, data }: { id: string, data: UpdateParkingFormData }) {
        return this.utils.handleApiRequest(() => authorizedAPI.put(`/parking/${id}`, data))
    }

    deleteParking({ id }: { id: string }) {
        return this.utils.handleApiRequest(() => authorizedAPI.delete(`/parking/${id}`))
    }
}