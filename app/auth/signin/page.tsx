import SignInForm from "@/components/auth/signin-form";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <BackgroundBeams className="opacity-20" />
      <div className="relative z-10 w-full max-w-md p-6">
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">EduTrack</span>
          </Link>
        </div>
        <SignInForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}