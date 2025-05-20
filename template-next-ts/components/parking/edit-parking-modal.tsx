"use client"
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateParking } from "@/hooks/use-parking";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateParkingFormData,
  parkingSchema,
} from "@/lib/schema/parking.schema";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import FormInput from "../form-input";

type Parking = {
  id: string;
  parkingName: string;
  numberOfAvailableSpaces: number;
  chargingFeesPerHour: number;
  createdAt: string;
  updatedAt: string;
}

interface EditParkingModalProps {
  isOpen: boolean;
  closeModal: () => void;
  parking: Parking;
}

const EditParkingModal: React.FC<EditParkingModalProps> = ({
  isOpen,
  closeModal,
  parking,
}) => {
  const updateParkingMutation = useUpdateParking();

  const form = useForm<UpdateParkingFormData>({
    resolver: zodResolver(parkingSchema.partial()),
    defaultValues: {
      parkingName: parking.parkingName,
      numberOfAvailableSpaces: parking.numberOfAvailableSpaces,
      chargingFeesPerHour: parking.chargingFeesPerHour,
    },
  });

  const onSubmit = async (data: UpdateParkingFormData) => {
    try {
      await updateParkingMutation.mutateAsync({ id: parking.id, data });
      closeModal();
    } catch (error) {
      toast.error("Updating parking lot failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:rounded">
        <DialogHeader>
          <DialogTitle>Edit Parking Lot</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              control={form.control}
              name="parkingName"
              label="Parking Name"
              placeholder="Main Lot"
              type="text"
              description="Enter parking lot name"
            />
            <FormInput
              control={form.control}
              name="numberOfAvailableSpaces"
              label="Available Spaces"
              placeholder="50"
              type="number"
              description="Enter number of available spaces"
            />
            <FormInput
              control={form.control}
              name="chargingFeesPerHour"
              label="Fees per Hour"
              placeholder="10.00"
              type="number"
              step="0.01"
              description="Enter charging fees per hour"
            />
            <Button
              type="submit"
              disabled={updateParkingMutation.isPending}
              className="main-dark-button w-full"
            >
              {updateParkingMutation.isPending ? (
                <div className="flex items-center justify-center gap-x-2">
                  <ClipLoader size={20} color="#fff" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditParkingModal;