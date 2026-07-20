import FieldError from "@/components/ui/FieldError";

type Props = {
  label: string;
  name: string;
  type?: "text" | "email" | "password";
  defaultValue?: string;
  errors?: string[];
};

export default function TextInput({
  label,
  name,
  type = "text",
  defaultValue,
  errors,
}: Props) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
      />
      <FieldError messages={errors} />
    </div>
  );
}
