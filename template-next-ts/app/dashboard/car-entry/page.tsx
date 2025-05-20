"use client";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import { Table } from "@/components/table";
import React, { useMemo, useState } from "react";
import {
  useGetAllCarEntries,
  useGetTicketForCarEntry,
  useUpdateCarExit,
} from "@/hooks/use-car-entry";
import AddCarEntryModal from "@/components/car-entry/add-car-entry-modal";
import LoadingScreen from "@/components/loading-screen";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { CarEntryService } from "@/services/car-entry.service";
import { UtilsService } from "@/services/utils.service";

type CarEntry = {
  id: string;
  plateNumber: string;
  parkingId: string;
  parkingName: string;
  entryDateTime: string;
  exitDateTime: string | null;
  chargedAmount: number;
  createdAt: string;
  updatedAt: string;
};

type Ticket = {
  id: string;
  plateNumber: string;
  parkingName: string;
  entryDateTime: string;
  chargingFeesPerHour?: number;
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 12,
    backgroundColor: "#F5F6F5",
  },
  header: {
    borderBottom: "2 solid #003087",
    paddingBottom: 10,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003087",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#003087",
    marginBottom: 20,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    border: "1 solid #E0E0E0",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  value: {
    fontSize: 12,
    color: "#555555",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: "1 solid #E0E0E0",
    paddingTop: 10,
    textAlign: "center",
    fontSize: 10,
    color: "#777777",
  },
});

const TicketPDF: React.FC<{ ticket: Ticket }> = ({ ticket }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.logoText}>Parking Management</Text>
        <Text style={{ fontSize: 10, color: "#555555" }}>
          Generated on {new Date().toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.title}>Parking Ticket</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Ticket ID</Text>
        <Text style={styles.value}>{ticket.id}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Plate Number</Text>
        <Text style={styles.value}>{ticket.plateNumber}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Parking Lot</Text>
        <Text style={styles.value}>{ticket.parkingName}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Entry Time</Text>
        <Text style={styles.value}>
          {new Date(ticket.entryDateTime).toLocaleString()}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Charging Rate</Text>
        <Text style={styles.value}>
          ${ticket.chargingFeesPerHour ?? "1000"}/hour
        </Text>
      </View>
      <View style={styles.footer}>
        <Text>
          Parking Management System | Contact: support@parkingmanagement.com |
          (123) 456-7890
        </Text>
      </View>
    </Page>
  </Document>
);

const BillPDF: React.FC<{
  carEntry: CarEntry;
  ticket: Ticket;
  durationHours: number;
}> = ({ carEntry, ticket, durationHours }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.logoText}>Parking Management</Text>
        <Text style={{ fontSize: 10, color: "#555555" }}>
          Generated on {new Date().toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.title}>Parking Bill</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Ticket ID</Text>
        <Text style={styles.value}>{ticket.id}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Plate Number</Text>
        <Text style={styles.value}>{carEntry.plateNumber}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Parking Lot</Text>
        <Text style={styles.value}>{carEntry.parkingName}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Entry Time</Text>
        <Text style={styles.value}>
          {new Date(carEntry.entryDateTime).toLocaleString()}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Exit Time</Text>
        <Text style={styles.value}>
          {carEntry.exitDateTime
            ? new Date(carEntry.exitDateTime).toLocaleString()
            : "N/A"}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Parking Duration</Text>
        <Text style={styles.value}>{durationHours.toFixed(2)} hours</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Charging Rate</Text>
        <Text style={styles.value}>
          ${ticket.chargingFeesPerHour ?? "N/A"}/hour
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Total Amount Charged</Text>
        <Text style={styles.value}>${carEntry.chargedAmount.toFixed(2)}</Text>
      </View>
      <View style={styles.footer}>
        <Text>
          Parking Management System | Contact: support@parkingmanagement.com |
          (123) 456-7890
        </Text>
      </View>
    </Page>
  </Document>
);

const CarEntryTable: React.FC = () => {
  const [selectedCarEntryId, setSelectedCarEntryId] = useState<string | null>(
    null
  );
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [billDialogOpen, setBillDialogOpen] = useState(false);
  const [billData, setBillData] = useState<{
    carEntry: CarEntry;
    ticket: Ticket;
    durationHours: number;
  } | null>(null);
  const { data: carEntriesData, isLoading } = useGetAllCarEntries();
  const updateCarExitMutation = useUpdateCarExit();
  const {
    data: ticketData,
    isLoading: isTicketLoading,
    error: ticketError,
  } = useGetTicketForCarEntry(selectedCarEntryId || "");

  const utils = new UtilsService();
  const carEntryService = new CarEntryService(utils);

  const handleExit = async (carEntry: CarEntry) => {
    if (carEntry.exitDateTime) {
      toast.error("Car has already exited");
      return;
    }
    try {
      const exitDateTime = new Date().toISOString();
      const durationHours =
        (new Date(exitDateTime).getTime() -
          new Date(carEntry.entryDateTime).getTime()) /
        (1000 * 60 * 60);

      // Fetch ticket to include in bill
      const ticketResponse = await carEntryService.getTicketForCarEntry({
        carEntryId: carEntry.id,
      });
      const ticket = ticketResponse.data?.[0];
      if (!ticket) {
        throw new Error("No ticket found for this car entry");
      }

      // Update car exit
      const response = await updateCarExitMutation.mutateAsync({
        id: carEntry.id,
        data: { exitDateTime },
      });

      // Prepare bill data
      setBillData({
        carEntry: {
          ...carEntry,
          exitDateTime,
          chargedAmount: response.data.carEntry.chargedAmount,
        },
        ticket: {
          ...ticket,
          chargingFeesPerHour: ticket.parking?.chargingFeesPerHour,
        },
        durationHours,
      });
      setBillDialogOpen(true);
      toast.success("Car exit updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update car exit");
    }
  };

  const handleViewTicket = async (carEntryId: string) => {
    setSelectedCarEntryId(carEntryId);
    setTicketDialogOpen(true);
  };

  // New function to handle viewing the bill for already exited cars
  const handleViewBill = async (carEntry: CarEntry) => {
    try {
      const ticketResponse = await carEntryService.getTicketForCarEntry({
        carEntryId: carEntry.id,
      });
      const ticket = ticketResponse.data?.[0];

      if (!ticket || !carEntry.exitDateTime) {
        toast.error("Bill data not available or car has not exited.");
        return;
      }

      const durationHours =
        (new Date(carEntry.exitDateTime).getTime() -
          new Date(carEntry.entryDateTime).getTime()) /
        (1000 * 60 * 60);

      setBillData({
        carEntry: carEntry,
        ticket: {
          ...ticket,
          chargingFeesPerHour: ticket.parking?.chargingFeesPerHour,
        },
        durationHours,
      });
      setBillDialogOpen(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load bill details.");
    }
  };

  const formattedCarEntries = useMemo(() => {
    if (!carEntriesData?.data) return [];

    return carEntriesData.data.map((carEntry: CarEntry) => ({
      ...carEntry,
      entryDateTimeDisplay: carEntry.entryDateTime
        ? dayjs(carEntry.entryDateTime).format("MMM D, YYYY HH:mm")
        : "",
      exitDateTimeDisplay: carEntry.exitDateTime
        ? dayjs(carEntry.exitDateTime).format("MMM D, YYYY HH:mm")
        : "",
      chargedAmountDisplay: carEntry.chargedAmount.toFixed(2),
    }));
  }, [carEntriesData]);

  const columns = [
    { key: "plateNumber", label: "Plate Number" },
    { key: "parkingName", label: "Parking Lot" },
    { key: "entryDateTimeDisplay", label: "Entry Time" },
    { key: "exitDateTimeDisplay", label: "Exit Time" },
    { key: "chargedAmountDisplay", label: "Charged Amount" },
    { key: "actions", label: "Actions" },
  ];

  const tableData = formattedCarEntries.map((carEntry: any) => ({
    ...carEntry,
    actions: (
      <div className="flex space-x-2">
        {!carEntry.exitDateTime && (
          <button
            className="text-textIcon"
            onClick={() => handleExit(carEntry)}
            disabled={carEntry.exitDateTime || updateCarExitMutation.isPending}
          >
            <Icon icon="ic:baseline-exit-to-app" fontSize={18} />
          </button>
        )}
        <button
          className="text-textIcon"
          onClick={() => handleViewTicket(carEntry.id)}
          disabled={isTicketLoading}
        >
          <Icon icon="ic:baseline-receipt" fontSize={18} />
        </button>
        {carEntry.exitDateTime && ( // Conditionally render "View Bill" button
          <button
            className="text-textIcon"
            onClick={() => handleViewBill(carEntry)}
          >
            <Icon icon="mdi:file-document-outline" fontSize={18} />
          </button>
        )}
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
        title="Car Entries"
        exportData={tableData}
        additionalButton={<AddCarEntryModal />}
      />
      {/* Ticket Dialog */}
      <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
        <DialogContent className="sm:rounded">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
          </DialogHeader>
          {isTicketLoading ? (
            <div className="flex justify-center">
              <ClipLoader size={20} color="#000" />
            </div>
          ) : ticketError ? (
            <p className="text-red-600">
              Failed to load ticket: {ticketError.message}
            </p>
          ) : ticketData?.data?.[0] ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Ticket ID</p>
                <p className="text-sm text-gray-900">{ticketData.data[0].id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Plate Number
                </p>
                <p className="text-sm text-gray-900">
                  {ticketData.data[0].plateNumber}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Parking Lot</p>
                <p className="text-sm text-gray-900">
                  {ticketData.data[0].parkingName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Entry Time</p>
                <p className="text-sm text-gray-900">
                  {new Date(ticketData.data[0].entryDateTime).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    setTicketDialogOpen(false);
                    setSelectedCarEntryId(null);
                  }}
                  className="main-dark-button w-fit"
                >
                  Close
                </Button>
                <PDFDownloadLink
                  document={<TicketPDF ticket={ticketData.data[0]} />}
                  fileName={`ticket-${ticketData.data[0].id}.pdf`}
                  className="main-dark-button w-full text-center"
                >
                  {({ loading }) =>
                    loading ? "Generating PDF..." : "Download Ticket PDF"
                  }
                </PDFDownloadLink>
              </div>
            </div>
          ) : (
            <p>No ticket data available</p>
          )}
        </DialogContent>
      </Dialog>
      {/* Bill Dialog */}
      <Dialog open={billDialogOpen} onOpenChange={setBillDialogOpen}>
        <DialogContent className="sm:rounded">
          <DialogHeader>
            <DialogTitle>Parking Bill</DialogTitle>
          </DialogHeader>
          {billData ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Ticket ID</p>
                <p className="text-sm text-gray-900">{billData.ticket.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Plate Number
                </p>
                <p className="text-sm text-gray-900">
                  {billData.carEntry.plateNumber}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Parking Lot</p>
                <p className="text-sm text-gray-900">
                  {billData.carEntry.parkingName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Entry Time</p>
                <p className="text-sm text-gray-900">
                  {new Date(billData.carEntry.entryDateTime).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Exit Time</p>
                <p className="text-sm text-gray-900">
                  {new Date(billData.carEntry.exitDateTime!).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Parking Duration
                </p>
                <p className="text-sm text-gray-900">
                  {billData.durationHours.toFixed(2)} hours
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Total Amount Charged
                </p>
                <p className="text-sm text-gray-900">
                  ${billData.carEntry.chargedAmount.toFixed(2)}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    setBillDialogOpen(false);
                    setBillData(null);
                  }}
                  className="main-dark-button w-fit"
                >
                  Close
                </Button>
                <PDFDownloadLink
                  document={
                    <BillPDF
                      carEntry={billData.carEntry}
                      ticket={billData.ticket}
                      durationHours={billData.durationHours}
                    />
                  }
                  fileName={`bill-${billData.ticket.id}.pdf`}
                  className="main-dark-button w-full text-center"
                >
                  {({ loading }) =>
                    loading ? "Generating PDF..." : "Download Bill PDF"
                  }
                </PDFDownloadLink>
              </div>
            </div>
          ) : (
            <p>No bill data available</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarEntryTable;
