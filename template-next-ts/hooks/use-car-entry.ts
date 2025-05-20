import { UtilsService } from "@/services/utils.service";
import { CarEntryService } from "@/services/car-entry.service";
import {
  CreateCarEntryFormData,
  UpdateCarEntryFormData,
} from "@/lib/schema/car-entry.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authorizedAPI } from "@/config/axios.config";

const utils = new UtilsService();
const carEntryService = new CarEntryService(utils);

export const useCreateCarEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCarEntryFormData) =>
      carEntryService.createCarEntry(data),
    onSuccess: async (response) => {
      queryClient.invalidateQueries({ queryKey: ["parkings"] });
      queryClient.invalidateQueries({ queryKey: ["carEntries"] });
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    },
    onError: async (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateCarExit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCarEntryFormData }) =>
      carEntryService.updateCarExit({ id, data }),
    onSuccess: async (response) => {
      queryClient.invalidateQueries({ queryKey: ["parkings"] });
      queryClient.invalidateQueries({ queryKey: ["carEntries"] });
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    },
    onError: async (error) => {
      toast.error(error.message);
    },
  });
};

export const useGetAllCarEntries = () => {
  return useQuery({
    queryKey: ["carEntries"],
    queryFn: () => carEntryService.getAllCarEntries(),
  });
};

export const useGetTicket = (ticketId: string) => {
  return useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => carEntryService.getTicket({ id: ticketId })
      .catch(err => {
        console.error("Error fetching ticket:", err);
        throw err;
      }),
  });
};

export const useGetTicketForCarEntry = (carEntryId: string) => {
  return useQuery({
    queryKey: ["ticket-for-car-entry", carEntryId],
    queryFn: () => carEntryService.getTicketForCarEntry({ carEntryId }),
  });
};


export const useGetOutgoingCars = (startDateTime: string, endDateTime: string) => {
  return useQuery({
    queryKey: ["outgoingCars", startDateTime, endDateTime],
    queryFn: async () => {
      const response = await carEntryService.getOutgoingCars({ startDateTime, endDateTime });
      return response;
    },
    enabled: !!startDateTime && !!endDateTime,
  });
};

export const useGetEnteredCars = (startDateTime: string, endDateTime: string) => {
  return useQuery({
    queryKey: ["enteredCars", startDateTime, endDateTime],
    queryFn: async () => {
      const response = await carEntryService.getEnteredCars({ startDateTime, endDateTime });
      return response;
    },
    enabled: !!startDateTime && !!endDateTime,
  });
};