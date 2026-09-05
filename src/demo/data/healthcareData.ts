import { ApiFetcherParams } from "../../types/api.types";

// ============================================================================
// 4. HEALTHCARE & CLINIC APPOINTMENTS
// ============================================================================
export interface MedicalAppointment {
  id: string;
  patientName: string;
  patientAge: number;
  doctor: string;
  specialty: "Cardiology" | "Neurology" | "Orthopedics" | "Dermatology" | "Pediatrics" | "Ophthalmology";
  appointmentDate: string;
  type: "In-Person" | "Telehealth" | "Emergency";
  triage: "Urgent" | "Normal" | "Critical";
  status: "Confirmed" | "Waiting" | "In Consultation" | "Completed" | "Cancelled";
  fee: number; // in EGP
  insuranceCovered: boolean;
}

export const MEDICAL_APPOINTMENTS_DB: MedicalAppointment[] = [
  {
    id: "apt_101",
    patientName: "Mahmoud Hassan",
    patientAge: 46,
    doctor: "Dr. Sherif Zaki",
    specialty: "Cardiology",
    appointmentDate: "2026-09-06 10:30",
    type: "In-Person",
    triage: "Critical",
    status: "Waiting",
    fee: 950,
    insuranceCovered: true,
  },
  {
    id: "apt_102",
    patientName: "Laila El-Gammal",
    patientAge: 29,
    doctor: "Dr. Mona Ragab",
    specialty: "Dermatology",
    appointmentDate: "2026-09-06 11:15",
    type: "In-Person",
    triage: "Normal",
    status: "Confirmed",
    fee: 650,
    insuranceCovered: false,
  },
  {
    id: "apt_103",
    patientName: "Ziad Taha",
    patientAge: 12,
    doctor: "Dr. Ahmed Mansi",
    specialty: "Pediatrics",
    appointmentDate: "2026-09-06 12:00",
    type: "Telehealth",
    triage: "Urgent",
    status: "In Consultation",
    fee: 500,
    insuranceCovered: true,
  },
  {
    id: "apt_104",
    patientName: "Fatma Rostom",
    patientAge: 62,
    doctor: "Dr. Hossam Allam",
    specialty: "Orthopedics",
    appointmentDate: "2026-09-06 13:00",
    type: "In-Person",
    triage: "Normal",
    status: "Confirmed",
    fee: 800,
    insuranceCovered: true,
  },
  {
    id: "apt_105",
    patientName: "Khaled Badran",
    patientAge: 38,
    doctor: "Dr. Yasmine Saeed",
    specialty: "Neurology",
    appointmentDate: "2026-09-06 14:30",
    type: "In-Person",
    triage: "Urgent",
    status: "Waiting",
    fee: 1100,
    insuranceCovered: true,
  },
  {
    id: "apt_106",
    patientName: "Menna Ezzat",
    patientAge: 24,
    doctor: "Dr. Tarek Helmy",
    specialty: "Ophthalmology",
    appointmentDate: "2026-09-06 15:45",
    type: "Telehealth",
    triage: "Normal",
    status: "Completed",
    fee: 600,
    insuranceCovered: false,
  },
];

export async function fetchMedicalAppointmentsApi(
  params: ApiFetcherParams
): Promise<{ data: MedicalAppointment[]; total: number; page: number; pageSize: number }> {
  await new Promise((r) => setTimeout(r, 240));
  let list = [...MEDICAL_APPOINTMENTS_DB];

  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(
      (m) =>
        m.patientName.toLowerCase().includes(q) ||
        m.doctor.toLowerCase().includes(q) ||
        m.specialty.toLowerCase().includes(q) ||
        m.status.toLowerCase().includes(q)
    );
  }

  if (params.sortBy) {
    const key = params.sortBy as keyof MedicalAppointment;
    list.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      if (valA < valB) return params.sortOrder === "desc" ? 1 : -1;
      if (valA > valB) return params.sortOrder === "desc" ? -1 : 1;
      return 0;
    });
  }

  const page = params.page || 1;
  const pageSize = params.pageSize || 5;
  const total = list.length;
  const data = list.slice((page - 1) * pageSize, page * pageSize);

  return { data, total, page, pageSize };
}
