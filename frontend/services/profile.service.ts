import { authorizedAPI } from "@/config/axios.config";
import { UtilsService } from "./utils.service";

export class ProfileService {
    constructor(
        private readonly utils: UtilsService
    ) { }

    getProfile(): Promise<any> {
        return this.utils.handleApiRequest(() => authorizedAPI.get('/profile'));
    }

    updateProfile = ({ firstName, lastName, photo }: { firstName: string; lastName: string; photo?: string }) => {
        return this.utils.handleApiRequest(() => authorizedAPI.put('/profile', { firstName, lastName, photo }));
    }
}