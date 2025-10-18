export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}
