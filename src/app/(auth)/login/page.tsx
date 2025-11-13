import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { getAdminPath } from "@/lib/config/admin";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to access the admin dashboard",
};

export default async function LoginPage() {
  // Redirect if already logged in
  const session = await getServerSession();
  if (session) {
    redirect(getAdminPath());
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email and password to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}

