"use client";
import { useEffect, useState } from "react";
import { Check, X, AlertTriangle } from "lucide-react";
import { subscribeAlert, resolveAlert } from "@/lib/alert";

const VARIANTS = {
  success: { Icon: Check, wrap: "bg-emerald-100 text-emerald-600" },
  error: { Icon: X, wrap: "bg-rose-100 text-rose-600" },
  confirm: { Icon: AlertTriangle, wrap: "bg-rose-100 text-rose-600" },
};

export default function NotificationModal() {
  const [config, setConfig] = useState(null);

  // subscribe ກັບ store ໃນ alert.js
  useEffect(() => subscribeAlert((c) => setConfig(c)), []);

  // ກົດ Escape = ປິດ (ຖືວ່າ cancel)
  useEffect(() => {
    if (!config) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setConfig(null);
        resolveAlert(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [config]);

  if (!config) return null;

  const close = (isConfirmed) => {
    setConfig(null);
    resolveAlert(isConfirmed);
  };

  const isConfirm = config.variant === "confirm";
  const { Icon, wrap } = VARIANTS[config.variant] || VARIANTS.success;
  const confirmBtn = isConfirm
    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-100"
    : "bg-blue-600 hover:bg-blue-700 shadow-blue-100";

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={() => close(false)}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className={`flex h-14 w-14 items-center justify-center rounded-full ${wrap}`}>
            <Icon size={28} strokeWidth={2.5} />
          </div>

          <h3 className="mt-4 text-lg font-bold text-slate-800">{config.title}</h3>
          {config.text && (
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{config.text}</p>
          )}

          <div className={`mt-7 grid w-full gap-3 ${isConfirm ? "grid-cols-2" : "grid-cols-1"}`}>
            {isConfirm && (
              <button
                type="button"
                onClick={() => close(false)}
                className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-600 transition-all hover:bg-slate-200"
              >
                {config.cancelText}
              </button>
            )}
            <button
              type="button"
              onClick={() => close(true)}
              className={`rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition-all ${confirmBtn}`}
            >
              {config.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
