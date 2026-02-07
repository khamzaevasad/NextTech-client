import { categories } from "@/lib/data/category";
import DeviceCard from "../web/DeviceCard";

function Devices() {
  /* ------------------------------ APOLO CLIENT ------------------------------ */

  /* -------------------------------- HANDLERS -------------------------------- */

  return (
    <div className="my-8">
      <h2 className="text-4xl font-semibold my-6">Devices</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-3">
        {categories.map((category) => (
          <DeviceCard key={category._id} category={category} />
        ))}
      </div>
    </div>
  );
}

export default Devices;
