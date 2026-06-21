type SelectOption = {
  value: string | number;
  label: string;
};

type SelectProps = {
  options: SelectOption[];
  name?: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string | number;
};

export default function CommonSelect({
  options,
  name,
  label,
  placeholder = "Select value",
  defaultValue,
}: SelectProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-lg mb-2">
        {label}
      </label>

      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        className="w-full px-4 py-2 border rounded-lg"
      >
        {!defaultValue && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
