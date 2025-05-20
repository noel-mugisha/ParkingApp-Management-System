"use client";
import React, { useState } from "react";
import { useGetOutgoingCars, useGetEnteredCars } from "@/hooks/use-car-entry";
import { Table } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "dayjs";

type CarEntry = {
  id: string;
  plateNumber: string;
  parkingId: string;
  parking: { parkingName: string };
  entryDateTime: string;
  exitDateTime: string | null;
  chargedAmount?: number;
};

const CarActivityReport: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("");
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<string>("");
  const [queryTriggered, setQueryTriggered] = useState(false);

  // Combine date and time into ISO strings
  const startDateTime = startDate && startTime
    ? dayjs(startDate).set("hour", parseInt(startTime.split(":")[0])).set("minute", parseInt(startTime.split(":")[1])).toISOString()
    : "";
  const endDateTime = endDate && endTime
    ? dayjs(endDate).set("hour", parseInt(endTime.split(":")[0])).set("minute", parseInt(endTime.split(":")[1])).toISOString()
    : "";

  const outgoingCarsQuery = useGetOutgoingCars(startDateTime, endDateTime);
  const enteredCarsQuery = useGetEnteredCars(startDateTime, endDateTime);

  const handleGenerateReport = () => {
    if (!startDate || !startTime || !endDate || !endTime) {
      toast.error("Please select both start and end date-time");
      return;
    }
    const start = dayjs(startDateTime);
    const end = dayjs(endDateTime);
    if (start.isAfter(end)) {
      toast.error("Start date-time must be before end date-time");
      return;
    }
    setQueryTriggered(true);
  };

  const outgoingColumns = [
    { key: "plateNumber", label: "Plate Number" },
    { key: "parking.parkingName", label: "Parking Lot" },
    { key: "entryDateTime", label: "Entry Time", render: (value: string) => dayjs(value).format("MMM D, YYYY HH:mm") },
    { key: "exitDateTime", label: "Exit Time", render: (value: string) => dayjs(value).format("MMM D, YYYY HH:mm") },
    { key: "chargedAmount", label: "Charged Amount", render: (value: number) => `$${value?.toFixed(2) || "0.00"}` },
  ];

  const enteredColumns = [
    { key: "plateNumber", label: "Plate Number" },
    { key: "parking.parkingName", label: "Parking Lot" },
    { key: "entryDateTime", label: "Entry Time", render: (value: string) => dayjs(value).format("MMM D, YYYY HH:mm") },
    { key: "exitDateTime", label: "Exit Time", render: (value: string | null) => (value ? dayjs(value).format("MMM D, YYYY HH:mm") : "Still Parked") },
  ];

  const outgoingTableData = outgoingCarsQuery.data?.data?.map((entry: CarEntry) => ({
    ...entry,
  })) || [];

  const enteredTableData = enteredCarsQuery.data?.data?.map((entry: CarEntry) => ({
    ...entry,
  })) || [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Car Activity Report</h2>
      <div className="flex flex-col space-y-4 mb-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <label className="text-sm font-medium">Start Time</label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-[280px]"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">End Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <label className="text-sm font-medium">End Time</label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-[280px]"
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={handleGenerateReport}
            className="main-dark-button"
            disabled={outgoingCarsQuery.isLoading || enteredCarsQuery.isLoading}
          >
            {outgoingCarsQuery.isLoading || enteredCarsQuery.isLoading ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              "Generate Report"
            )}
          </Button>
        </div>
      </div>

      {queryTriggered && (
        <>
          <h3 className="text-xl font-semibold mt-8 mb-2">Outgoing Cars</h3>
          {outgoingCarsQuery.isLoading ? (
            <div className="flex justify-center">
              <ClipLoader size={30} color="#000" />
            </div>
          ) : outgoingCarsQuery.error ? (
            <p className="text-red-600">Error: {outgoingCarsQuery.error.message}</p>
          ) : (
            <Table
              paginate
              exportable
              data={outgoingTableData}
              columns={outgoingColumns}
              title="Outgoing Cars"
              exportData={outgoingTableData}
            />
          )}

          <h3 className="text-xl font-semibold mt-8 mb-2">Entered Cars</h3>
          {enteredCarsQuery.isLoading ? (
            <div className="flex justify-center">
              <ClipLoader size={30} color="#000" />
            </div>
          ) : enteredCarsQuery.error ? (
            <p className="text-red-600">Error: {enteredCarsQuery.error.message}</p>
          ) : (
            <Table
              paginate
              exportable
              data={enteredTableData}
              columns={enteredColumns}
              title="Entered Cars"
              exportData={enteredTableData}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CarActivityReport;