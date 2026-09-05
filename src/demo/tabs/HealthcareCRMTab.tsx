import React, { useRef } from "react";
import { AnyTable } from "../../components/AnyTable";
import { TableInstance } from "../../types/table.types";
import { TablePreset } from "../../types/theme.types";
import {
  MedicalAppointment,
  fetchMedicalAppointmentsApi,
} from "../data/healthcareData";

export interface HealthcareCRMTabProps {
  selectedPreset: TablePreset;
  isDarkMode: boolean;
  showToast: (msg: string) => void;
}

export const HealthcareCRMTab: React.FC<HealthcareCRMTabProps> = ({
  selectedPreset,
  isDarkMode,
  showToast,
}) => {
  const medicalTableRef = useRef<TableInstance<MedicalAppointment>>(null);

  return (
    <div className="flex flex-col gap-4 any-table-fade-in">
      <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between">
        <div>
          🏥 <strong>Healthcare & Clinic Management:</strong> Patient triages (Critical, Urgent, Normal), consultation dates, doctors, and insurance statuses.
        </div>
        <span className="bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold px-2 py-0.5 rounded-full text-[10px]">
          HEALTHCARE
        </span>
      </div>

      <AnyTable<MedicalAppointment>
        key={`med-${selectedPreset}-${isDarkMode ? "dark" : "light"}`}
        preset={selectedPreset}
        tableRef={medicalTableRef}
        title="Clinical Appointments & Patient Triage"
        subtitle="Doctor allocations, appointment priority levels, and insurance claims"
        rowKey="id"
        api={{
          fetcher: fetchMedicalAppointmentsApi,
        }}
        columns={[
          {
            key: "patientName",
            title: "Patient",
            sortable: true,
            render: (name, row) => (
              <div>
                <div className="font-bold text-xs text-gray-900 dark:text-white">{name}</div>
                <div className="text-[11px] text-gray-400">{row.patientAge} years old</div>
              </div>
            ),
          },
          {
            key: "doctor",
            title: "Assigned Physician",
            sortable: true,
            render: (doc, row) => (
              <div>
                <div className="font-bold text-xs text-gray-900 dark:text-white">{doc}</div>
                <div className="text-[11px] text-primary font-semibold">{row.specialty}</div>
              </div>
            ),
          },
          {
            key: "appointmentDate",
            title: "Date & Time",
            type: "datetime",
            sortable: true,
          },
          {
            key: "triage",
            title: "Triage Priority",
            sortable: true,
            render: (triage) => (
              <span
                className={`font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  triage === "Critical"
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                    : triage === "Urgent"
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                }`}
              >
                {triage}
              </span>
            ),
          },
          {
            key: "type",
            title: "Consultation Type",
            render: (type) => (
              <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                {type === "In-Person" ? "🏥 In-Person" : "💻 Telehealth"}
              </span>
            ),
          },
          {
            key: "fee",
            title: "Consultation Fee",
            type: "currency",
            currency: "EGP",
            sortable: true,
          },
          {
            key: "insuranceCovered",
            title: "Insurance",
            type: "boolean",
          },
          {
            key: "status",
            title: "Status",
            type: "status",
            sortable: true,
            statusMap: {
              Waiting: { label: "Waiting", variant: "warning" },
              "In Consultation": { label: "In Consultation", variant: "info" },
              Confirmed: { label: "Confirmed", variant: "neutral" },
              Completed: { label: "Completed", variant: "success" },
              Cancelled: { label: "Cancelled", variant: "danger" },
            },
          },
        ]}
        actions={[
          {
            id: "consult-btn",
            label: "Call Patient",
            icon: "🔔",
            variant: "primary",
            onClick: (row) => showToast(`Calling patient ${row.patientName} to Examination Room`),
          },
        ]}
      />
    </div>
  );
};
