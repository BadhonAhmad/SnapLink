"use client";

import { useState } from "react";

interface DateFilterProps {
  selectedFilter: string;
  onFilterChange: (filter: string, fromDate?: string, toDate?: string) => void;
}

export default function DateFilter({
  selectedFilter,
  onFilterChange,
}: DateFilterProps) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showCustomRange, setShowCustomRange] = useState(false);

  const filters = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "custom", label: "Custom Range" },
  ];

  const handleFilterChange = (value: string) => {
    if (value === "custom") {
      setShowCustomRange(true);
    } else {
      setShowCustomRange(false);
      setFromDate("");
      setToDate("");
      onFilterChange(value);
    }
  };

  const handleApplyCustomRange = () => {
    if (fromDate && toDate) {
      onFilterChange("custom", fromDate, toDate);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <label
          htmlFor="date-filter"
          className="text-sm font-medium text-gray-700"
        >
          Filter by:
        </label>
        <select
          id="date-filter"
          value={showCustomRange ? "custom" : selectedFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="block w-40 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-gray-900"
        >
          {filters.map((filter) => (
            <option
              key={filter.value}
              value={filter.value}
              className="text-gray-900 bg-white"
            >
              {filter.label}
            </option>
          ))}
        </select>
      </div>

      {showCustomRange && (
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <label
              htmlFor="from-date"
              className="text-sm font-medium text-gray-700"
            >
              From:
            </label>
            <input
              type="date"
              id="from-date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-gray-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="to-date"
              className="text-sm font-medium text-gray-700"
            >
              To:
            </label>
            <input
              type="date"
              id="to-date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-gray-900"
            />
          </div>

          <button
            onClick={handleApplyCustomRange}
            disabled={!fromDate || !toDate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
