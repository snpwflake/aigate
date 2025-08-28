interface ApiEndpointProps {
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  description?: string;
  children: React.ReactNode;
}

export default function ApiEndpoint({
  method,
  endpoint,
  description,
  children,
}: ApiEndpointProps) {
  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-600";
      case "POST":
        return "bg-blue-600";
      case "PUT":
        return "bg-yellow-600";
      case "DELETE":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-2">
          <span
            className={`${getMethodColor(
              method
            )} text-white px-3 py-1 rounded text-sm font-semibold`}
          >
            {method}
          </span>
          <code className="bg-gray-100 px-3 py-2 rounded text-gray-800 font-mono">
            {endpoint}
          </code>
        </div>
        {description && <p className="text-gray-600 text-sm">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
