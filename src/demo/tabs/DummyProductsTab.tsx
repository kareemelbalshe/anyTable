import React, { useRef } from "react";
import { AnyTable } from "../../components/AnyTable";
import { TableInstance } from "../../types/table.types";
import { TablePreset } from "../../types/theme.types";
import { fetchDummyJsonProducts } from "../externalApis";

export interface DummyProductsTabProps {
  selectedPreset: TablePreset;
  isDarkMode: boolean;
  showToast: (msg: string) => void;
}

export const DummyProductsTab: React.FC<DummyProductsTabProps> = ({
  selectedPreset,
  isDarkMode,
  showToast,
}) => {
  const productsTableRef = useRef<TableInstance<any>>(null);

  return (
    <div className="flex flex-col gap-4 any-table-fade-in">
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
        <div>
          🛍️ <strong>Live Real-World API:</strong> Connected directly to <code>https://dummyjson.com/products</code> with server-side pagination, sorting, and debounced search.
        </div>
        <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full text-[10px]">
          LIVE API
        </span>
      </div>

      <AnyTable
        key={`prod-${selectedPreset}-${isDarkMode ? "dark" : "light"}`}
        preset={selectedPreset}
        tableRef={productsTableRef}
        title="DummyJSON Products Inventory"
        subtitle="Fetching real e-commerce inventory with server pagination and search"
        rowKey="id"
        api={{
          fetcher: fetchDummyJsonProducts,
          response: {
            dataPath: "products",
            totalPath: "total",
          },
        }}
        columns={[
          {
            key: "thumbnail",
            title: "Image",
            type: "image",
            width: 70,
            align: "center",
          },
          {
            key: "title",
            title: "Product Title",
            sortable: true,
            render: (val, row) => (
              <div>
                <div className="font-bold text-xs text-gray-900 dark:text-white">{val}</div>
                <div className="text-[11px] text-gray-400 capitalize">{row.brand || row.category}</div>
              </div>
            ),
          },
          {
            key: "category",
            title: "Category",
            type: "badge",
          },
          {
            key: "price",
            title: "Price",
            type: "currency",
            currency: "$",
            sortable: true,
          },
          {
            key: "rating",
            title: "Customer Rating",
            type: "rating",
            sortable: true,
          },
          {
            key: "stock",
            title: "In Stock",
            render: (val) => (
              <span
                className={`font-bold text-xs px-2 py-0.5 rounded-full ${
                  val > 20
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                }`}
              >
                {val} units
              </span>
            ),
          },
        ]}
        actions={[
          {
            id: "order-product",
            label: "Add to Cart",
            icon: "🛒",
            variant: "primary",
            onClick: (row) => showToast(`Added "${row.title}" ($${row.price}) to cart!`),
          },
        ]}
        selectable
      />
    </div>
  );
};
