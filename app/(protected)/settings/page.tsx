"use client";

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function SettingsPage() {
  const user = useCurrentUser();

  return (
    <div className="bg-white p-10 rounded-xl">
      {JSON.stringify(user)}

      <button type="submit" onClick={() => logout()}>
        Sign Out
      </button>
    </div>
  );
}