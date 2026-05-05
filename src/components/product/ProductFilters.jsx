import Select from "react-select";

const options = [
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" }
];

const ProductFilters = ({ onFilter }) => {
  return (
    <div className="mb-4">
      <Select
        options={options}
        placeholder="Filter by category"
        onChange={(val) => onFilter(val.value)}
      />
    </div>
  );
};

export default ProductFilters;