import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserTableState {
  visibleColumns: string[];
  selectedRows: number[];
  setVisibleColumns: (columns: string[]) => void;
  toggleColumn: (column: string) => void;
  setSelectedRows: (rows: number[]) => void;
  toggleRow: (id: number) => void;
  clearSelection: () => void;
}

const DEFAULT_COLUMNS = [
  "name",
  "email",
  "phone",
  "company",
  "country",
  "status",
  "actions",
];

export const useUserTableStore = create<UserTableState>()(
  persist(
    (set, get) => ({
      visibleColumns: DEFAULT_COLUMNS,
      selectedRows: [],
      setVisibleColumns: (columns) => set({ visibleColumns: columns }),
      toggleColumn: (column) => {
        const { visibleColumns } = get();
        if (visibleColumns.includes(column)) {
          if (visibleColumns.length > 1) {
            set({ visibleColumns: visibleColumns.filter((c) => c !== column) });
          }
        } else {
          set({ visibleColumns: [...visibleColumns, column] });
        }
      },
      setSelectedRows: (rows) => set({ selectedRows: rows }),
      toggleRow: (id) => {
        const { selectedRows } = get();
        if (selectedRows.includes(id)) {
          set({ selectedRows: selectedRows.filter((r) => r !== id) });
        } else {
          set({ selectedRows: [...selectedRows, id] });
        }
      },
      clearSelection: () => set({ selectedRows: [] }),
    }),
    {
      name: "user-table-settings",
    }
  )
);
