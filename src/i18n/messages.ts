export interface TableMessages {
  searchPlaceholder: string;
  noRecordsTitle: string;
  noRecordsDescription: string;
  errorTitle: string;
  errorDescription: string;
  retry: string;
  showing: string;
  to: string;
  of: string;
  results: string;
  page: string;
  rowsPerPage: string;
  actions: string;
  export: string;
  exportCsv: string;
  exportJson: string;
  exportSuccess: string;
  selectAll: string;
  selectRow: string;
  prevPage: string;
  nextPage: string;
  confirmTitle: string;
  confirmButton: string;
  cancelButton: string;
  addRecord: string;
  clearSearch: string;
  loading: string;
}

export const enMessages: TableMessages = {
  searchPlaceholder: "Search records...",
  noRecordsTitle: "No records found",
  noRecordsDescription: "Try adjusting your search query or clear active filters.",
  errorTitle: "Unable to load data",
  errorDescription: "An unexpected error occurred while fetching the records.",
  retry: "Retry Request",
  showing: "Showing",
  to: "to",
  of: "of",
  results: "results",
  page: "Page",
  rowsPerPage: "Rows / page",
  actions: "Actions",
  export: "Export",
  exportCsv: "Export CSV",
  exportJson: "Export JSON",
  exportSuccess: "Export completed successfully",
  selectAll: "Select all rows",
  selectRow: "Select row",
  prevPage: "Previous page",
  nextPage: "Next page",
  confirmTitle: "Are you sure?",
  confirmButton: "Confirm",
  cancelButton: "Cancel",
  addRecord: "Add",
  clearSearch: "Clear search",
  loading: "Loading...",
};

export const arMessages: TableMessages = {
  searchPlaceholder: "بحث في السجلات...",
  noRecordsTitle: "لا توجد سجلات",
  noRecordsDescription: "جرّب تغيير عبارة البحث أو إعادة تعيين الفلاتر.",
  errorTitle: "تعذر تحميل بيانات الجدول",
  errorDescription: "حدث خطأ غير متوقع أثناء جلب السجلات من الخادم.",
  retry: "إعادة المحاولة",
  showing: "عرض",
  to: "إلى",
  of: "من إجمالي",
  results: "سجل",
  page: "صفحة",
  rowsPerPage: "سجل لكل صفحة",
  actions: "الإجراءات",
  export: "تصدير",
  exportCsv: "تصدير CSV (Excel)",
  exportJson: "تصدير JSON",
  exportSuccess: "تم تصدير البيانات بنجاح",
  selectAll: "تحديد جميع الصفوف",
  selectRow: "تحديد الصف",
  prevPage: "الصفحة السابقة",
  nextPage: "الصفحة التالية",
  confirmTitle: "هل أنت متأكد؟",
  confirmButton: "تأكيد",
  cancelButton: "إلغاء",
  addRecord: "إضافة",
  clearSearch: "مسح البحث",
  loading: "جاري التحميل...",
};

export function resolveMessages(
  locale: string = "en",
  customMessages?: Partial<TableMessages>
): TableMessages {
  const isArabic = locale.toLowerCase().startsWith("ar");
  const base = isArabic ? arMessages : enMessages;

  if (!customMessages) return base;
  return { ...base, ...customMessages };
}
