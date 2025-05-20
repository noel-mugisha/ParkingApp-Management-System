import { CreateParkingFormData, UpdateParkingFormData } from "@/lib/schema/parking.schema";
import { UtilsService } from "@/services/utils.service";
import { ParkingService } from "@/services/parking.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const utils = new UtilsService()
const parkingService = new ParkingService(utils)

export const useCreateParking = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateParkingFormData) => parkingService.createParking(data),
        onSuccess: async (response) => {
            queryClient.invalidateQueries({ queryKey: ['parkings'] })
            if (response.success) {
                toast.success(response.message)
            } else {
                toast.error(response.message)
            }
        },
        onError: async (error) => {
            toast.error(error.message)
        }
    })
}

export const useGetAllParkings = () => {
    return useQuery({
        queryKey: ['parkings'],
        queryFn: () => parkingService.getAllParkings(),
    })
}

export const useUpdateParking = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: UpdateParkingFormData }) => parkingService.updateParking({ id, data }),
        onSuccess: async (response) => {
            queryClient.invalidateQueries({ queryKey: ['parkings'] })
            if (response.success) {
                toast.success(response.message)
            } else {
                toast.error(response.message)
            }
        },
        onError: async (error) => {
            toast.error(error.message)
        }
    })
}

export const useDeleteParking = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id }: { id: string }) => parkingService.deleteParking({ id }),
        onSuccess: async (response) => {
            queryClient.invalidateQueries({ queryKey: ['parkings'] })
            if (response.success) {
                toast.success(response.message)
            } else {
                toast.error(response.message)
            }
        },
        onError: async (error) => {
            toast.error(error.message)
        }
    })
}