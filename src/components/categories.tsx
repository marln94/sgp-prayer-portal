import { Prayer, Priorities } from "@/app/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardAction } from "@/components/ui/card";

export default function Categories({
  prayers,
  checkPrayer,
  groupPrayers,
}: {
  prayers: Prayer[];
  checkPrayer: (id: number) => void;
  groupPrayers: (prayers: Prayer[]) => Record<string, Prayer[]>;
}) {
  return Object.entries(groupPrayers(prayers)).map(([category, prayers]) => (
    <section key={category} className="flex flex-col gap-2 pb-2 select-none">
      <h2 className="font-semibold">{category}</h2>
      {prayers.map((prayer) => (
        <Card
          key={prayer.id}
          className={`gap-1 py-3 cursor-pointer ${
            prayer.priority === Priorities.Prioritario ||
            prayer.priority === Priorities.Diario
              ? "border-red-500"
              : ""
          }`}
          onClick={() => checkPrayer(prayer.id)}
        >
          <CardHeader className="px-3">
            <CardTitle className="font-normal">{prayer.text}</CardTitle>
            <CardAction>
              <Checkbox checked={prayer.checked} />
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </section>
  ));
}
