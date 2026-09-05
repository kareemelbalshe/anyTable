import { TableAction } from "../types/action.types";

export interface LegacyActionsParams<TData = any> {
  explicitActions?: TableAction<TData>[];
  buttons?: any[];
  block?: boolean;
  handleBlock?: (id: any) => void;
  view?: boolean;
  linkView?: string;
  viewHandler?: (id: any) => void;
  edit?: boolean;
  linkEdit?: string;
  editHandler?: (id: any) => void;
  del?: boolean;
  handleDelete?: (id: any) => void;
}

/**
 * Resolves actions list by combining modern explicit `actions` array
 * with legacy Wasel-compatible props (buttons, block, view, edit, del).
 */
export function resolveTableActions<TData = any>(
  params: LegacyActionsParams<TData>
): TableAction<TData>[] {
  const {
    explicitActions,
    buttons,
    block,
    handleBlock,
    view,
    linkView,
    viewHandler,
    edit,
    linkEdit,
    editHandler,
    del,
    handleDelete,
  } = params;

  const list: TableAction<TData>[] = [...(explicitActions || [])];

  // Convert legacy custom buttons
  if (buttons && Array.isArray(buttons)) {
    buttons.forEach((btn, idx) => {
      list.push({
        id: `legacy-btn-${idx}`,
        label: btn.label,
        icon: btn.icon,
        className: btn.className,
        show: btn.show,
        hide: btn.hide,
        onClick: (row) => btn.onClick(row),
      });
    });
  }

  // Convert legacy Block action
  if (block && handleBlock) {
    list.push({
      id: "legacy-block",
      label: (row: any) => (row.isBanned || !row.isActive ? "Unblock" : "Block"),
      variant: (row: any) => (row.isBanned || !row.isActive ? "success" : "danger"),
      onClick: (row: any) => handleBlock(row?._id || row?.id),
    });
  }

  // Convert legacy View action
  if (view && (viewHandler || linkView)) {
    list.push({
      id: "legacy-view",
      label: "View",
      variant: "primary",
      onClick: (row: any) => {
        const id = row?._id || row?.id;
        if (viewHandler) viewHandler(id);
        else if (linkView && typeof window !== "undefined") {
          window.location.href = `${linkView}/${id}`;
        }
      },
    });
  }

  // Convert legacy Edit action
  if (edit && (editHandler || linkEdit)) {
    list.push({
      id: "legacy-edit",
      label: "Edit",
      variant: "info",
      onClick: (row: any) => {
        const id = row?._id || row?.id;
        if (editHandler) editHandler(id);
        else if (linkEdit && typeof window !== "undefined") {
          window.location.href = `${linkEdit}/${id}`;
        }
      },
    });
  }

  // Convert legacy Delete action
  if (del && handleDelete) {
    list.push({
      id: "legacy-del",
      label: "Delete",
      variant: "danger",
      confirmation: {
        title: "Delete Item",
        message: "Are you sure you want to delete this record?",
      },
      onClick: (row: any) => handleDelete(row?._id || row?.id),
    });
  }

  return list;
}
