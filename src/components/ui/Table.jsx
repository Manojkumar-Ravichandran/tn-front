const Table = ({ columns, data, loading }) => {

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg overflow-hidden">

      <table className="w-full text-sm">

        {/* Header */}
        <thead className="bg-gray-100">

          <tr>

            {columns.map((col) => (

              <th
                key={col.key}
                className="text-left p-3 font-semibold"
              >
                {col.title}
              </th>

            ))}

          </tr>

        </thead>

        {/* Body */}
        <tbody>

          {data.map((row, index) => (

            <tr key={row._id || index} className="border-t">

              {columns.map((col) => (

                <td key={col.key} className="p-3">

                  {col.render
                    ? col.render(row)
                    : row[col.dataIndex]}

                </td>

              ))}

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default Table;