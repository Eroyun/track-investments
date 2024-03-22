import React from "react";
import Select from "react-select";

import { createOptions } from "../helpers/dataHelper";

const Filter = ({ filter, handleFilterChange, rows }) => {
  const { stockOptions, marketOptions } = createOptions(rows);
  return (
    <div className="flex items-center justify-end gap-2 m-2">
      <input
        type="date"
        name="date"
        value={filter.date}
        onChange={(event) => handleFilterChange("date", event.target.value)}
        className="rounded-md p-1 text-black placeholder-gray-800 selection-gray-800"
      />
      <Select
        name="stock"
        options={stockOptions}
        value={stockOptions.find((option) => option.value === filter.stock)}
        onChange={(selectedOption) =>
          handleFilterChange("stock", selectedOption)
        }
        isClearable
        placeholder="Filter by stock"
        className="rounded-md p-1 text-black"
        styles={{
          option: (styles, { isFocused }) => {
            return {
              ...styles,
              backgroundColor: isFocused ? "#1c1c1c" : null,
              color: isFocused ? "white" : null,
            };
          },
        }}
      />
      <Select
        name="market"
        options={marketOptions}
        value={marketOptions.find((option) => option.value === filter.market)}
        onChange={(selectedOption) =>
          handleFilterChange("market", selectedOption)
        }
        isClearable
        placeholder="Filter by market"
        className="rounded-md p-1 text-black"
        styles={{
          option: (styles, { isFocused }) => {
            return {
              ...styles,
              backgroundColor: isFocused ? "#1c1c1c" : null,
              color: isFocused ? "white" : null,
            };
          },
        }}
      />
    </div>
  );
};

export default Filter;
