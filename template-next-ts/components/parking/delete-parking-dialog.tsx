"use client"
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteParking } from "@/hooks/use-parking";
import { toast } from "sonner";

type Parking = {
  id: string;
  parkingName: string;
  numberOfAvailableSpaces: number;
  chargingFeesPerHour: number;
  createdAt: string;
  updatedAt: string;
}

interface DeleteParkingDialogProps {
  isOpen: boolean;
  closeDialog: () => void;
  parking: Parking;
}

const DeleteParkingDialog: React.FC<DeleteParkingDialogProps> = ({
  isOpen,
  closeDialog,
  parking,
}) => {
  const deleteParkingMutation = useDeleteParking();

  const handleDelete = async () => {
    try {
      await deleteParkingMutation.mutateAsync({ id: parking.id });
      closeDialog();
    } catch (error) {
      toast.error("Deleting parking lot failed");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={closeDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            parking lot <strong>{parking.parkingName}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeDialog}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            {deleteParkingMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteParkingDialog;