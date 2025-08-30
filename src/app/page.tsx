import Prayers from "../components/prayers";

import { getPrayersToAssign } from "@/actions/sheet-actions";

export default async function Home() {
  const initialPrayers = await getPrayersToAssign()

  return (
    <div className="flex flex-col gap-2 p-4 max-w-2xl mx-auto mt-(--header-height)">
      <Prayers
        initialPrayers={initialPrayers.data}
      />
    </div>
  );
}
