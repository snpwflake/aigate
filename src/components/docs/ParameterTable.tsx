interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

interface ParameterTableProps {
  parameters: Parameter[];
  title?: string;
}

export default function ParameterTable({
  parameters,
  title = "Параметрлер",
}: ParameterTableProps) {
  return (
    <div className="mb-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-3">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-gray-50 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">
                Параметр
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">
                Түрі
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">
                Міндетті
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">
                Сипаттамасы
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {parameters.map((param, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <code className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">
                    {param.name}
                  </code>
                </td>
                <td className="px-4 py-3 text-gray-700">{param.type}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      param.required
                        ? "text-red-600 font-semibold"
                        : "text-gray-500"
                    }
                  >
                    {param.required ? "Иә" : "Жоқ"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {param.description}
                  {param.example && (
                    <div className="mt-1">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {param.example}
                      </code>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
