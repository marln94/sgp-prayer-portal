import Prayers from "../components/prayers";

export default async function Home() {
  return (
    <div className="flex flex-col gap-2 p-4 max-w-2xl mx-auto mt-(--header-height)">
      <Prayers />
    </div>
  );
}
