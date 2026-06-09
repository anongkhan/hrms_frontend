"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // 🛠️ Hardcode ເພື່ອ Test ໄປໜ້າ Dashboard
    localStorage.setItem("token", "mock_token");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative p-4"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')" }}>
      <div className="absolute inset-0 bg-slate-900/40"></div>

      <div className="w-full max-w-5xl h-145 flex z-10 rounded-[40px] overflow-hidden shadow-2xl">
        {/* ດ້ານຊ້າຍ: Welcome Section */}
        <div className="flex-1 hidden md:flex flex-col justify-center p-16 bg-white/10 backdrop-blur-xl border-r border-white/20">
          <h1 className="text-5xl font-bold text-white leading-tight">Welcome to</h1>
          <p className="text-xl text-white/70 mt-6 font-light">Human resource management system</p>
        </div>

        {/* ດ້ານຂວາ: Login Form */}
        <div className="flex-1 bg-white p-16 flex flex-col justify-center">

          <h3 className="text-3xl font-bold text-slate-800 mb-10 text-center">Login</h3>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-400 tracking-widest block mb-2">Email</label>
              <input type="email" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                placeholder="Enter email" required />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 tracking-widest block mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                placeholder="Enter password" required />
            </div>
            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-200 mt-4">
              ເຂົ້າສູ່ລະບົບ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

