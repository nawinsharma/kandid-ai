"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { useAuthModalContext } from "@/components/providers/auth-modal-provider";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { Button } from "@/components/ui/button";
import { LogIn, Users, Megaphone, MessageSquare, Linkedin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, isLoading } = useAuthStore();
  const { openAuthModal } = useAuthModalContext();
  const { isOpen } = useAuthModal();
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      // Redirect to dashboard if user is authenticated
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  const handleLoginClick = () => {
    openAuthModal("welcome");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  return (
    <div className={`min-h-screen transition-all duration-300 ${isOpen ? 'blur-md brightness-50' : ''}`}>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold text-2xl">
                L
              </div>
              <span className="ml-4 font-bold text-4xl text-gray-900">LinkBird</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Connect, Engage, and Grow
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Streamline your LinkedIn outreach campaigns with intelligent automation, 
              personalized messaging, and comprehensive analytics.
            </p>

            {/* CTA Button */}
            <Button
              onClick={handleLoginClick}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Get Started
            </Button>

            {/* Features Grid */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Lead Management</h3>
                  <p className="text-gray-600">Organize and track your prospects efficiently</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <Megaphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Campaign Automation</h3>
                  <p className="text-gray-600">Automate your outreach with smart sequences</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Messaging</h3>
                  <p className="text-gray-600">Personalized messages that convert</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <Linkedin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">LinkedIn Integration</h3>
                  <p className="text-gray-600">Seamless connection with LinkedIn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
