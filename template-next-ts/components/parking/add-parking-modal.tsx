"use client"
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateParking } from "@/hooks/use-parking";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateParkingFormData,
  parkingSchema,
} from "@/lib/schema/parking.schema";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";
import AddButton from "../Button/AddButton";
import { toast } from "sonner";
import FormInput from "../form-input";

const AddParkingModal: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const createParkingMutation = useCreateParking();

  const form = useForm<CreateParkingFormData>({
    resolver: zodResolver(parkingSchema),
    defaultValues: {
      parkingName: "",
      numberOfAvailableSpaces: 0,
      chargingFeesPerHour: 0,
    },
  });

  const openAddModal = () => setIsAddModalOpen(true);

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    form.reset();
  };

  const onSubmit = async (data: CreateParkingFormData) => {
    try {
      await createParkingMutation.mutateAsync(data);
      closeAddModal();
    } catch (error) {
      toast.error("Parking lot creation failed");
    }
  };

  return (
    <div>
      <AddButton handleClick={openAddModal} hoverText="Add parking lot" />
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:rounded">
          <DialogHeader>
            <DialogTitle>Add New Parking Lot</DialogTitle>
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
                disabled={createParkingMutation.isPending}
                className="main-dark-button w-full"
              >
                {createParkingMutation.isPending ? (
                  <div className="flex items-center justify-center gap-x-2">
                    <ClipLoader size={20} color="#fff" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Add"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddParkingModal;