import { useEffect, useState } from "react";
import api from "../../api/client";

type User = {
  name: string;
};

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold">
          Good morning{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h2>
        <p className="text-slate-500 text-sm">Here's your job search overview</p>
      </div>
      <input
        placeholder="Search..."
        className="w-64 px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
      />
    </header>
  );
}
