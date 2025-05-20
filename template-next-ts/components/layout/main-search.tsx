import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";

const DOCUMENT_TYPES = [
  { label: "All Doc", value: "all" },
  { label: "National ID", value: "nationalId" },
  { label: "License", value: "license" },
  { label: "Passport", value: "passport" },
];

const MainSearch = () => {
  const [docType, setDocType] = useState(DOCUMENT_TYPES[0].value);

  return (
    <main className="flex items-center gap-x-2 border border-light_gray rounded-full  px-2 overflow-hidden">
      <Input
        type="search"
        placeholder={`search for any document...`}
        className="!ring-offset-0 !ring-0 min-w-[18rem] border-none focus:outline-none text-sm placeholder:text-[13px]"
        aria-label="Search documents"
      />
      <Select onValueChange={setDocType} defaultValue={docType}>
        <SelectTrigger className="w-[120px] !p-0 border-none focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          {DOCUMENT_TYPES.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <button className="bg-primary rounded-full p-1 hover:bg-blue-700 transition-all">
        <Icon icon="mynaui:search" color="#fff" fontSize={20} />
      </button>
    </main>
  );
};

export default MainSearch;
