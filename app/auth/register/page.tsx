import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-background to-background p-4 sm:p-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl blur-xl opacity-20 -m-2" />
        <Card className="w-full backdrop-blur-sm border border-border/50 shadow-xl relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-t-lg" />
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <h1 className="logo-text text-3xl">Article Management</h1>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Create Account
              </CardTitle>
              <CardDescription className="text-center">
                Fill out the form below to create your new account
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <AuthForm type="register" />
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-center gap-2 border-t pt-6">
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-primary hover:text-accent underline-offset-4 transition-colors hover:underline font-medium"
              >
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="text-center mt-4 text-xs text-muted-foreground">
          <p>Choose any role for demo access</p>
          <p className="mt-1">All data is simulated in demo mode</p>
        </div>
      </div>
    </div>
  );
}
