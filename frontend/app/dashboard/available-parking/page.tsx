"use client"
import dayjs from 'dayjs';
import { Table } from '@/components/table';
import React, { useMemo, useState } from 'react';
import { useGetAllParkings } from '@/hooks/use-parking';
import LoadingScreen from '@/components/loading-screen';

const AvailableParkingTable: React.FC = () => {
  const { data: parkingsData, isLoading } = useGetAllParkings();

  const formattedParkings = useMemo(() => {
    if (!parkingsData?.data) return [];

    return parkingsData.data.map((parking: Parking) => ({
      ...parking,
      updatedAtDisplay: parking.updatedAt ? dayjs(parking.updatedAt).format('MMM D, YYYY') : '',
    }));
  }, [parkingsData]);

  const columns = [
    { key: 'parkingName', label: 'Parking Name' },
    { key: 'numberOfAvailableSpaces', label: 'Available Spaces' },
    { key: 'chargingFeesPerHour', label: 'Fees per Hour' },
    { key: 'updatedAtDisplay', label: 'Updated At' },
  ];

  const tableData = formattedParkings

  
  if(isLoading){
    return <LoadingScreen />
  }

  return (
    <div>
      <Table
        paginate
        exportable
        data={tableData}
        columns={columns}
        title="Available Parking Lots"
        exportData={tableData}
      />
    </div>
  );
};

export default AvailableParkingTable;