"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import LoginPopup from "../Login/Login";
import Player from "../../assets/Player.png";
import { useAuthStore } from "../../store/Auth";
import { gsap } from "gsap";
import { ArrowRight, Play, Zap } from "lucide-react";

export default function Hero() {
  const token = useAuthStore((state) => state.token);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const floating1Ref = useRef<HTMLDivElement>(null);
  const floating2Ref = useRef<HTMLDivElement>(null);
  const floating3Ref = useRef<HTMLDivElement>(null);
  const BackendKey = import.meta.env.VITE_BACKEND_KEY;

  useEffect(() => {
    if (token) {
      fetch(`${BackendKey}/KickIt/getUser`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then(() => setIsLoggedIn(true));
    }
  }, [token]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Badge animation
      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 20, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6 }
      );

      // Headline words animation
      tl.fromTo(
        ".hero-word",
        { opacity: 0, y: 40, rotateX: -20 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.1 },
        "-=0.3"
      );

      // Description animation
      tl.fromTo(
        ".hero-desc",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4"
      );

      // Buttons animation
      tl.fromTo(
        ".hero-btn",
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.15 },
        "-=0.3"
      );

      // Image animation
      tl.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.8, rotation: -5 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1 },
        "-=0.8"
      );

      // Floating elements
      tl.fromTo(
        ".floating",
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 },
        "-=0.5"
      );

      // Floating animations (continuous)
      gsap.to(floating1Ref.current, {
        y: -15,
        rotation: 5,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(floating2Ref.current, {
        y: 10,
        rotation: -3,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(floating3Ref.current, {
        y: -20,
        x: 5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen bg-gray-900 text-white overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating Elements */}
      <div
        ref={floating1Ref}
        className="floating absolute top-32 right-[15%] w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30"
      >
        <span className="text-2xl">⚽</span>
      </div>
      <div
        ref={floating2Ref}
        className="floating absolute top-48 left-[8%] w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30"
      >
        <span className="text-xl">🏏</span>
      </div>
      <div
        ref={floating3Ref}
        className="floating absolute bottom-40 right-[12%] w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30"
      >
        <span className="text-lg">🎾</span>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 grid md:grid-cols-2 gap-12 items-center min-h-screen">
        {/* Left Content */}
        <div ref={textRef} className="relative z-10">
          {/* Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8"
          >
            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium">Join 10,000+ Players</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="hero-word block">Find & Join</span>
            <span className="hero-word block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Local Sports
            </span>
            <span className="hero-word block">Events Today</span>
          </h1>

          {/* Description */}
          <p className="hero-desc text-lg text-gray-400 mb-10 max-w-lg leading-relaxed">
            Connect with players in your area, create or join games, and never miss an opportunity to play. Your next match is just a tap away.
          </p>

          {/* Buttons */}
          <div className="hero-btn flex flex-wrap gap-4">
            {!isLoggedIn ? (
              <LoginPopup
                Text={
                  <>
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                }
              />
            ) : (
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl px-8 py-6 text-lg font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
              >
                Browse Events
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold backdrop-blur-sm transition-all hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="hero-btn mt-16 grid grid-cols-3 gap-8">
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-gray-500">Active Events</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">2K+</p>
              <p className="text-sm text-gray-500">Players</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">50+</p>
              <p className="text-sm text-gray-500">Venues</p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div ref={imageRef} className="relative flex justify-center items-center">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl scale-75" />

          {/* Main Image */}
          <div className="relative">
            <img
              src={Player}
              alt="Hero Illustration"
              className="relative z-10 w-full max-w-md object-cover rounded-3xl shadow-2xl"
            />

            {/* Image Badge */}
            <div className="absolute -bottom-4 -left-4 z-20 bg-gray-800/90 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Event Nearby</p>
                  <p className="text-gray-400 text-sm">Cricket match in 2hrs</p>
                </div>
              </div>
            </div>

            {/* Image Badge 2 */}
            <div className="absolute -top-2 -right-2 z-20 bg-gray-800/90 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">⭐</span>
                <p className="text-white font-semibold">4.9 Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}