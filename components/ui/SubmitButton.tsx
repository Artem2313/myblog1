export default function SubmitButton({
  pending,
  children,
  pendingLabel = "Saving...",
}: {
  pending: boolean;
  children: React.ReactNode;
  pendingLabel?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-gray-900 py-2.5 font-medium text-white hover:bg-gray-700 disabled:opacity-50"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
