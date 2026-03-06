import { useQuery } from "@tanstack/react-query";
import { getMyTemples } from "../../features/temples/templeApi";

const TempleList = () => {

  const { data: temples = [], isLoading } = useQuery({
    queryKey: ["temples"],
    queryFn: getMyTemples
  });

  if (isLoading) return <p>Loading temples...</p>;

  return (
    <div className="bg-white border rounded-lg">

      <table className="w-full">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Temple</th>
            <th className="p-3 text-left">District</th>
            <th className="p-3 text-left">Deity</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>

          {temples.map((temple) => (

            <tr key={temple._id} className="border-t">

              <td className="p-3">
                {temple.name}
              </td>

              <td className="p-3">
                {temple.district?.name}
              </td>

              <td className="p-3">
                {temple.deity?.name}
              </td>

              <td className="p-3">

                <span className={`px-2 py-1 rounded text-xs
                  ${temple.status === "approved" && "bg-green-100 text-green-700"}
                  ${temple.status === "pending" && "bg-yellow-100 text-yellow-700"}
                  ${temple.status === "rejected" && "bg-red-100 text-red-700"}
                `}>

                  {temple.status}

                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default TempleList;