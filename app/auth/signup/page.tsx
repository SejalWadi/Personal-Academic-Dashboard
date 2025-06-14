import SignUpForm from "@/components/auth/signup-form";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
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
        <SignUpForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}