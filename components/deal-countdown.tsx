"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

// Static target date (replace with desired date)
const TARGET_DATE = new Date("2025-05-30T00:00:00");

// Function to calculate the time remaining
const calculateTimeRemaining = (targetDate: Date) => {
  const currentTime = new Date();
  const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0);
  return {
    days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    ),
    minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
  };
};

export default function DealCountdown() {
  const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>();

  useEffect(() => {
    // Calculate initial time on client
    setTime(calculateTimeRemaining(TARGET_DATE));

    const timerInterval = setInterval(() => {
      const newTime = calculateTimeRemaining(TARGET_DATE);
      setTime(newTime);

      if (
        newTime.days === 0 &&
        newTime.hours === 0 &&
        newTime.minutes === 0 &&
        newTime.seconds === 0
      ) {
        clearInterval(timerInterval);
      }

      return () => clearInterval(timerInterval);
    }, 1000);
  }, []);

  if (!time) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-col gap-2 justify-conter">
          <h3 className="text-3xl font-bold">Cargando Cuenta Atrás...</h3>
        </div>
      </section>
    );
  }

  if (
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0
  ) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-col gap-2 justify-conter">
          <h3 className="text-3xl font-bold">La oferta ha terminado</h3>
          <p>
            Esta oferta ya no está disponible. Mira nuestras últimas promociones
          </p>

          <div className="text-center">
            <Button asChild>
              <Link href="/search">Ver productos</Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <Image
            src="/images/promo.jpg"
            alt="promoción"
            width={300}
            height={300}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 my-20">
      <div className="flex flex-col gap-2 justify-conter">
        <h3 className="text-3xl font-bold">Oferta del Mes</h3>
        <p>
          Prepárate para una experiencia de compra como nunca antes con nuestras
          ofertas del mes! Cada compra viene con ventajas y ofertas exclusivas,
          haciendo de este mes una celebración de elecciones inteligentes y
          ofertas increíbles. ¡No te lo pierdas! 🎁🛒
        </p>

        <ul className="grid grid-cols-4">
          <StatBox label="Días" value={time.days} />
          <StatBox label="Horas" value={time.hours} />
          <StatBox label="Minutos" value={time.minutes} />
          <StatBox label="Segundos" value={time.seconds} />
        </ul>
        <div className="text-center">
          <Button asChild>
            <Link href="/search">Ver productos</Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <Image
          src="/images/promo.jpg"
          alt="promoción"
          width={300}
          height={300}
        />
      </div>
    </section>
  );
}

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <li className="p-4 w-full text-center">
    <p className="text-3xl font-bold">{value}</p>
    <p>{label}</p>
  </li>
);
