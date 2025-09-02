"use client";

import { Prayer } from "../app/types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2Icon, ClipboardIcon } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Loading from "@/components/loading";

import Categories from "./categories";

import {
  getPrayersToAssign,
  markAssignedPrayers,
} from "@/actions/sheet-actions";

export default function Prayers() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadPrayers = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    try {
      const result = await getPrayersToAssign();

      if (result.success) {
        setPrayers(result.data);
      } else {
        toast.error(result.error as string);
      }
    } catch {
      toast.error("Error al cargar peticiones");
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  const groupPrayers = (prayers: Prayer[]) => {
    return prayers.reduce((acc, prayer) => {
      if (!acc[prayer.category]) {
        acc[prayer.category] = [];
      }
      acc[prayer.category].push(prayer);
      return acc;
    }, {} as Record<string, Prayer[]>);
  };

  const checkedPrayers = prayers.filter((prayer) => prayer.checked);

  const checkPrayer = (id: number) => {
    setPrayers((prevPrayers) =>
      prevPrayers.map((prayer) =>
        prayer.id === id ? { ...prayer, checked: !prayer.checked } : prayer
      )
    );
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const handleClick = async () => {
    if (checkedPrayers.length === 0) {
      toast.warning("Selecciona al menos una petición");
      return;
    }

    setIsLoading(true);
    const checkedTexts = Object.entries(groupPrayers(checkedPrayers))
      .map(
        ([category, prayers]) =>
          `*${category}*\n${prayers.map((p) => `- ${p.text}`).join("\n")}`
      )
      .join("\n\n");
    copyToClipboard(checkedTexts);

    await markAssignedPrayers(checkedPrayers.map((p) => String(p.id)));
    await loadPrayers(false);

    setIsLoading(false);
    toast.success("Peticiones copiadas al portapapeles", {
      icon: <CheckCircle2Icon className="text-green-500" />,
      duration: 8000,
      description: "Puedes pegarlas en Whatsapp y enviarlas al orador.",
    });
  };

  useEffect(() => {
    loadPrayers();
  }, []);

  return (
    <div>
      <Toaster position="top-center" closeButton />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Categories
            prayers={prayers}
            checkPrayer={checkPrayer}
            groupPrayers={groupPrayers}
          />
          <div className="fixed top-1 right-4">
            <Button onClick={handleClick} className="bg-neutral-800">
              <ClipboardIcon className="" /> {checkedPrayers.length}
            </Button>
          </div>{" "}
        </>
      )}
    </div>
  );
}
