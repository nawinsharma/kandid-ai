import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xl">
              L
            </div>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">LinkBird</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your AI-powered LinkedIn outreach platform
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
