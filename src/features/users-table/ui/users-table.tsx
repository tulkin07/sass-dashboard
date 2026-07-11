"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  Columns3,
  Download,
  Eye,
  MoreVertical,
  Pencil,
} from "lucide-react";
import { useVirtualTable } from "@/shared/hooks/use-virtual-table";
import { fetchUsers } from "@/shared/api/users";
import { queryKeys } from "@/shared/config/query-keys";
import { DEFAULT_PAGE_SIZE } from "@/shared/config/constants";
import { useUserTableStore } from "@/shared/stores/user-table-store";
import {
  downloadCSV,
  getInitials,
  getUserStatus,
  cn,
} from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { StatusBadge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Pagination } from "@/shared/ui/pagination";
import {
  DataTableCard,
  DataTableFilterMeta,
  DataTableFooter,
  DataTableSearch,
  DataTableTabs,
  DataTableToolbar,
  tableCellComfortClass,
  tableCellDenseClass,
  tableHeadClass,
  type DataTableFilterChip,
  type DataTableTab,
} from "@/shared/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { TableRowSkeleton } from "@/shared/ui/skeleton";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";
import type { User, UserStatus } from "@/shared/types/api";

type SortField = "firstName" | "email" | "company" | "country";
type SortOrder = "asc" | "desc";

const ALL_COLUMNS = [
  { id: "name", labelKey: "name" },
  { id: "email", labelKey: "email" },
  { id: "phone", labelKey: "phone" },
  { id: "company", labelKey: "company" },
  { id: "country", labelKey: "country" },
  { id: "status", labelKey: "status" },
  { id: "actions", labelKey: "actions" },
];

export function UsersTable() {
  const t = useTranslations("users");
  const tc = useTranslations("common");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortField, setSortField] = useState<SortField>("firstName");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [dense, setDense] = useState(false);

  const { visibleColumns, selectedRows, toggleRow, setSelectedRows, toggleColumn, clearSelection } =
    useUserTableStore();

  const searchTimeout = useMemo(() => {
    let timer: ReturnType<typeof setTimeout>;
    return (value: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setDebouncedSearch(value);
        setPage(1);
      }, 300);
    };
  }, []);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.users.list({ limit: 100, skip: 0, q: debouncedSearch }),
    queryFn: () => fetchUsers({ limit: 100, skip: 0, q: debouncedSearch || undefined }),
  });

  const usersWithStatus = useMemo(
    () =>
      (data?.users || []).map((user) => ({
        ...user,
        status: getUserStatus(user.id),
      })),
    [data?.users]
  );

  const statusCounts = useMemo(
    () => ({
      all: usersWithStatus.length,
      active: usersWithStatus.filter((u) => u.status === "active").length,
      pending: usersWithStatus.filter((u) => u.status === "pending").length,
      inactive: usersWithStatus.filter((u) => u.status === "inactive").length,
    }),
    [usersWithStatus]
  );

  const statusTabs: DataTableTab[] = [
    { value: "all", label: tc("all"), count: statusCounts.all, countVariant: "plain" },
    {
      value: "active",
      label: t("active"),
      count: statusCounts.active,
      badgeTone: "success",
    },
    {
      value: "pending",
      label: t("pending"),
      count: statusCounts.pending,
      badgeTone: "warning",
    },
    {
      value: "inactive",
      label: t("inactive"),
      count: statusCounts.inactive,
      badgeTone: "default",
    },
  ];

  const processedUsers = useMemo(() => {
    let users = [...usersWithStatus];

    if (statusFilter !== "all") {
      users = users.filter((u) => u.status === statusFilter);
    }

    users.sort((a, b) => {
      let aVal: string, bVal: string;
      switch (sortField) {
        case "email":
          aVal = a.email;
          bVal = b.email;
          break;
        case "company":
          aVal = a.company.name;
          bVal = b.company.name;
          break;
        case "country":
          aVal = a.address.country;
          bVal = b.address.country;
          break;
        default:
          aVal = `${a.firstName} ${a.lastName}`;
          bVal = `${b.firstName} ${b.lastName}`;
      }
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

    return users;
  }, [usersWithStatus, statusFilter, sortField, sortOrder]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return processedUsers.slice(start, start + pageSize);
  }, [processedUsers, page, pageSize]);

  const totalPages = Math.ceil(processedUsers.length / pageSize);

  const filterChips: DataTableFilterChip[] = useMemo(() => {
    const chips: DataTableFilterChip[] = [];
    if (statusFilter !== "all") {
      chips.push({
        id: "status",
        label: `${t("status")}: ${t(statusFilter)}`,
      });
    }
    if (debouncedSearch) {
      chips.push({
        id: "search",
        label: `${tc("search")}: ${debouncedSearch}`,
      });
    }
    return chips;
  }, [statusFilter, debouncedSearch, t, tc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedUsers.map((u) => u.id));
    } else {
      clearSelection();
    }
  };

  const handleExport = () => {
    const exportData = (selectedRows.length > 0
      ? processedUsers.filter((u) => selectedRows.includes(u.id))
      : processedUsers
    ).map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      company: user.company.name,
      country: user.address.country,
      status: user.status,
    }));
    downloadCSV(exportData, "users-export.csv");
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
  };

  const removeChip = (id: string) => {
    if (id === "status") setStatusFilter("all");
    if (id === "search") {
      setSearch("");
      setDebouncedSearch("");
    }
    setPage(1);
  };

  const cellClass = dense ? tableCellDenseClass : tableCellComfortClass;

  const { parentRef, enabled, virtualRows, paddingTop, paddingBottom, measureElement } =
    useVirtualTable(paginatedUsers.length, dense ? 44 : 52);

  if (isError) {
    return <ErrorState onRetry={() => refetch()} retryLabel={tc("retry")} />;
  }

  return (
    <DataTableCard>
      <DataTableTabs
        tabs={statusTabs}
        value={statusFilter}
        onChange={(value) => {
          setStatusFilter(value as UserStatus | "all");
          setPage(1);
        }}
      />

      <DataTableToolbar>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <DataTableSearch
            value={search}
            onChange={(value) => {
              setSearch(value);
              searchTimeout(value);
            }}
            placeholder={t("search")}
            className="w-full max-w-none sm:max-w-sm"
          />

          <div className="flex shrink-0 items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Columns3 className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("columns")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("columns")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ALL_COLUMNS.filter((c) => c.id !== "actions").map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={visibleColumns.includes(col.id)}
                    onCheckedChange={() => toggleColumn(col.id)}
                  >
                    {t(col.labelKey)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" className="h-10" onClick={handleExport}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">{t("export")}</span>
            </Button>
          </div>
        </div>

        <DataTableFilterMeta
          resultsCount={processedUsers.length}
          resultsLabel={tc("resultsFound")}
          chips={filterChips}
          onRemoveChip={removeChip}
          onClear={clearFilters}
          clearLabel={tc("clear")}
        />
      </DataTableToolbar>

      {selectedRows.length > 0 && (
        <div className="flex items-center gap-2 border-b border-border bg-primary/5 px-4 py-2 text-sm md:px-5">
          <span>{t("selected", { count: selectedRows.length })}</span>
          <Button variant="ghost" size="sm" onClick={clearSelection}>
            {tc("clear")}
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <div
          ref={parentRef}
          className={cn(enabled && "max-h-[480px] overflow-auto")}
        >
          <table className="w-full" role="table">
            <thead
              className={cn(
                "border-b border-border bg-muted/30",
                enabled && "sticky top-0 z-10"
              )}
            >
            <tr>
              <th className="w-10 px-4 py-3" scope="col">
                <Checkbox
                  checked={
                    paginatedUsers.length > 0 &&
                    paginatedUsers.every((u) => selectedRows.includes(u.id))
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </th>
              {visibleColumns.includes("name") && (
                <th className={tableHeadClass} scope="col">
                  <button
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort("firstName")}
                  >
                    {t("name")}
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
              )}
              {visibleColumns.includes("email") && (
                <th className={tableHeadClass} scope="col">
                  <button
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort("email")}
                  >
                    {t("email")}
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
              )}
              {visibleColumns.includes("phone") && (
                <th className={tableHeadClass} scope="col">
                  {t("phone")}
                </th>
              )}
              {visibleColumns.includes("company") && (
                <th className={tableHeadClass} scope="col">
                  <button
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort("company")}
                  >
                    {t("company")}
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
              )}
              {visibleColumns.includes("country") && (
                <th className={tableHeadClass} scope="col">
                  <button
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort("country")}
                  >
                    {t("country")}
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
              )}
              {visibleColumns.includes("status") && (
                <th className={tableHeadClass} scope="col">
                  {t("status")}
                </th>
              )}
              {visibleColumns.includes("actions") && (
                <th className={tableHeadClass} scope="col">
                  {t("actions")}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRowSkeleton key={i} columns={7} />
              ))
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <EmptyState title={t("noUsers")} />
                </td>
              </tr>
            ) : enabled ? (
              <>
                {paddingTop > 0 && (
                  <tr aria-hidden="true">
                    <td colSpan={8} style={{ height: paddingTop, padding: 0, border: 0 }} />
                  </tr>
                )}
                {virtualRows.map((virtualRow) => {
                  const user = paginatedUsers[virtualRow.index];
                  return (
                    <UserRow
                      key={user.id}
                      user={user}
                      visibleColumns={visibleColumns}
                      isSelected={selectedRows.includes(user.id)}
                      onToggle={() => toggleRow(user.id)}
                      cellClass={cellClass}
                      rowRef={measureElement}
                      dataIndex={virtualRow.index}
                    />
                  );
                })}
                {paddingBottom > 0 && (
                  <tr aria-hidden="true">
                    <td colSpan={8} style={{ height: paddingBottom, padding: 0, border: 0 }} />
                  </tr>
                )}
              </>
            ) : (
              paginatedUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  visibleColumns={visibleColumns}
                  isSelected={selectedRows.includes(user.id)}
                  onToggle={() => toggleRow(user.id)}
                  cellClass={cellClass}
                />
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      <DataTableFooter
        dense={dense}
        onDenseChange={setDense}
        denseLabel={tc("dense")}
      >
        <Pagination
          compact
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={processedUsers.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          rowsPerPageLabel={tc("rowsPerPage")}
          previousLabel={tc("previous")}
          nextLabel={tc("next")}
          ofLabel={tc("of")}
        />
      </DataTableFooter>
    </DataTableCard>
  );
}

function UserRow({
  user,
  visibleColumns,
  isSelected,
  onToggle,
  cellClass,
  rowRef,
  dataIndex,
}: {
  user: User & { status: UserStatus };
  visibleColumns: string[];
  isSelected: boolean;
  onToggle: () => void;
  cellClass: string;
  rowRef?: (element: HTMLTableRowElement | null) => void;
  dataIndex?: number;
}) {
  return (
    <tr
      ref={rowRef}
      data-index={dataIndex}
      className="transition-colors hover:bg-muted/25"
    >
      <td className={cellClass}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggle}
          aria-label={`Select ${user.firstName}`}
        />
      </td>
      {visibleColumns.includes("name") && (
        <td className={cellClass}>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user.image}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <AvatarFallback>
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">
                {user.firstName} {user.lastName}
              </p>
              {!visibleColumns.includes("email") && (
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              )}
            </div>
          </div>
        </td>
      )}
      {visibleColumns.includes("email") && (
        <td className={cn(cellClass, "text-muted-foreground")}>{user.email}</td>
      )}
      {visibleColumns.includes("phone") && (
        <td className={cn(cellClass, "whitespace-nowrap text-muted-foreground")}>
          {user.phone}
        </td>
      )}
      {visibleColumns.includes("company") && (
        <td className={cellClass}>{user.company.name}</td>
      )}
      {visibleColumns.includes("country") && (
        <td className={cellClass}>{user.address.country}</td>
      )}
      {visibleColumns.includes("status") && (
        <td className={cellClass}>
          <StatusBadge status={user.status} />
        </td>
      )}
      {visibleColumns.includes("actions") && (
        <td className={cellClass}>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground">
              <Pencil className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground"
                  aria-label="Actions"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4" />
                  View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </td>
      )}
    </tr>
  );
}
