"use client";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import { Table } from "@/components/table";
import React, { useMemo, useState } from "react";
import { useGetAllParkings } from "@/hooks/use-parking";
import AddParkingModal from "@/components/parking/add-parking-modal";
import EditParkingModal from "@/components/parking/edit-parking-modal";
import DeleteParkingDialog from "@/components/parking/delete-parking-dialog";
import LoadingScreen from "@/components/loading-screen";

const ParkingTable: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedParking, setSelectedParking] = useState<Parking | null>(null);
  const { data: parkingsData, isLoading } = useGetAllParkings();

  const openEditModal = (parking: Parking) => {
    setSelectedParking(parking);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedParking(null);
  };

  const openDeleteDialog = (parking: Parking) => {
    setSelectedParking(parking);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedParking(null);
  };

  const formattedParkings = useMemo(() => {
    if (!parkingsData?.data) return [];

    return parkingsData.data.map((parking: Parking) => ({
      ...parking,
      updatedAtDisplay: parking.updatedAt
        ? dayjs(parking.updatedAt).format("MMM D, YYYY")
        : "",
    }));
  }, [parkingsData]);

  const columns = [
    { key: "parkingName", label: "Parking Name" },
    { key: "numberOfAvailableSpaces", label: "Available Spaces" },
    { key: "chargingFeesPerHour", label: "Fees per Hour" },
    { key: "updatedAtDisplay", label: "Updated At" },
    { key: "actions", label: "Actions" },
  ];

  const tableData = formattedParkings.map((parking: any) => ({
    ...parking,
    actions: (
      <div className="flex space-x-2">
        <button
          className="text-textIcon"
          onClick={() => openEditModal(parking)}
        >
          <Icon icon="ic:baseline-edit" fontSize={18} />
        </button>
        <button
          className="text-textIcon"
          onClick={() => openDeleteDialog(parking)}
        >
          <Icon icon="ic:baseline-delete" fontSize={18} />
        </button>
      </div>
    ),
  }));

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <Table
        paginate
        exportable
        data={tableData}
        columns={columns}
        title="Parking Lots"
        exportData={tableData}
        additionalButton={<AddParkingModal />}
      />
      {selectedParking && (
        <>
          <EditParkingModal
            isOpen={isEditModalOpen}
            closeModal={closeEditModal}
            parking={selectedParking}
          />
          <DeleteParkingDialog
            isOpen={isDeleteDialogOpen}
            closeDialog={closeDeleteDialog}
            parking={selectedParking}
          />
        </>
      )}
    </div>
  );
};

export default ParkingTable;
