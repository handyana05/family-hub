"use client";

import { useEffect, useState } from "react";
import {
  CloudSun,
  Moon,
  Sun,
  Sunset,
} from "lucide-react";

import { FamilyAvatar } from "@/components/family-avatar";
import type { FamilyMemberHeaderDto } from "@/lib/services/family-service";

type FamilyGreetingProps = {
  familyName: string;
  members: FamilyMemberHeaderDto[];
};

function getGreeting(hour: number) {
  if (hour >= 5 && hour < 12) {
    return {
      text: "Good morning",
      Icon: Sun,
      iconClass: "text-amber-400",
    };
  }

  if (hour >= 12 && hour < 17) {
    return {
      text: "Good afternoon",
      Icon: CloudSun,
      iconClass: "text-amber-400",
    };
  }

  if (hour >= 17 && hour < 21) {
    return {
      text: "Good evening",
      Icon: Sunset,
      iconClass: "text-orange-400",
    };
  }

  return {
    text: "Good night",
    Icon: Moon,
    iconClass: "text-indigo-300",
  };
}

export function FamilyGreeting({
  familyName,
  members,
}: FamilyGreetingProps) {
  const [hour, setHour] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setHour(new Date().getHours());

    update();

    const timer = window.setInterval(update, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  const greeting =
    hour === null
      ? {
          text: "Welcome",
          Icon: Sun,
          iconClass: "text-amber-400",
        }
      : getGreeting(hour);

  const Icon = greeting.Icon;

  return (
    <div className="flex min-w-0 items-start gap-4 sm:gap-5">
      <div className="mt-1 hidden sm:block">
        <Icon
          className={`h-10 w-10 lg:h-12 lg:w-12 ${greeting.iconClass}`}
          strokeWidth={1.8}
        />
      </div>

      <div className="min-w-0">
        <span className="block text-2xl font-semibold leading-tight text-violet-400 sm:text-3xl lg:text-4xl">
          {greeting.text},
        </span>

        <div className="mt-1 flex min-w-0 flex-wrap items-center gap-4">
          <span className="text-3xl font-bold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
            {familyName} Family
          </span>

          {members.length > 0 && (
            <div className="flex shrink-0 items-center -space-x-1.5">
              {members.map((member) => (
                <FamilyAvatar
                  key={member.id}
                  name={member.name}
                  avatarUrl={member.avatarUrl}
                  color={member.color}
                  size="sm"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}