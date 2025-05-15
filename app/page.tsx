import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Image from "next/image";

export default function Home() {
  // No client-side logic needed here as the middleware will handle redirects
  return redirect("/auth/login");
}
