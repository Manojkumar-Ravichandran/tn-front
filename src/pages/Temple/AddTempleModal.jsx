import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { templeSchema } from "../../features/temples/templeSchema";
import { createTemple } from "../../features/temples/templeApi";
import { getDistricts, getDeities, getFestivals } from "../../features/temples/masterApi";
import Modal from "../../components/ui/Modal";
import { useState } from "react";

const AddTempleModal = ({ isOpen, onClose }) => {

  const [images, setImages] = useState([]);

  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(templeSchema)
  });

  // master data
  const { data: districts = [] } = useQuery({
    queryKey: ["districts"],
    queryFn: getDistricts
  });

  const { data: deities = [] } = useQuery({
    queryKey: ["deities"],
    queryFn: getDeities
  });

  const { data: festivals = [] } = useQuery({
    queryKey: ["festivals"],
    queryFn: getFestivals
  });

  const onSubmit = async (data) => {

    try {

      const formData = new FormData();

      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });

      formData.append("location", JSON.stringify([78.0, 11.0]));

      images.forEach(img => {
        formData.append("images", img);
      });

      await createTemple(formData);

      queryClient.invalidateQueries(["temples"]);

      onClose();

    } catch (err) {

      console.error(err);

    }

  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Temple">

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Temple Name */}
        <input
          {...register("name")}
          placeholder="Temple Name"
          className="border p-2 w-full"
        />
        <p className="text-red-500">{errors.name?.message}</p>

        {/* Deity Dropdown */}
        <select
          {...register("deity")}
          className="border p-2 w-full"
        >
          <option value="">Select Deity</option>

          {deities.map(d => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}

        </select>

        {/* District Dropdown */}
        <select
          {...register("district")}
          className="border p-2 w-full"
        >
          <option value="">Select District</option>

          {districts.map(d => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}

        </select>

        {/* Festivals */}
        <select
          {...register("festivals")}
          multiple
          className="border p-2 w-full"
        >

          {festivals.map(f => (
            <option key={f._id} value={f._id}>
              {f.name}
            </option>
          ))}

        </select>

        {/* Description */}
        <textarea
          {...register("description")}
          placeholder="Description"
          className="border p-2 w-full"
        />

        {/* History */}
        <textarea
          {...register("history")}
          placeholder="Temple History"
          className="border p-2 w-full"
        />

        {/* Images */}
        <input
          type="file"
          multiple
          onChange={(e) => setImages([...e.target.files])}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>

      </form>

    </Modal>
  );
};

export default AddTempleModal;