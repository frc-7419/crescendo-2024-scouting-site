import Image from "next/image";
import LoginForm from "../components/login-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 dark:bg-slate-950">
      <LoginForm />
    </main>
  );
}
