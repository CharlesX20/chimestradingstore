// src/components/HeroSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
    const { user } = useUserStore();

    return (
        <section className="mt-6 mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-black/60 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg flex flex-col-reverse lg:flex-row items-center gap-6">
                    {/* Left: text content */}
                    <div className="flex-1 text-center lg:text-left">
                        <p className="text-sm sm:text-base font-medium text-white/80 mb-1">
                            Since <span className="font-semibold text-[#FFB300]">2007</span> • Trusted by millions
                        </p>

                        <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                            The best place to get your <span className="text-[#FFB300]">spices</span> &amp; <span className="text-[#ED232A]">condiments</span>
                        </h2>

                        <p className="mt-3 text-sm sm:text-base text-white/80 max-w-xl mx-auto lg:mx-0">
                            Fresh, authentic flavours — curated for home cooks and pro chefs alike.
                            {user ? "" : " Sign up or login to start buying what you need."}
                        </p>

                        {/* Buttons - show only if not logged in */}
                        {!user && (
                            <div className="mt-5 flex items-center justify-center lg:justify-start gap-3">
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center gap-2 rounded-md bg-[#FFB300] px-4 py-2 text-sm sm:text-base font-semibold text-black shadow-md hover:opacity-95 transition"
                                >
                                    Sign up
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm sm:text-base font-medium text-white hover:bg-white/5 transition"
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Right: hero image */}
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                        <div className="w-full max-w-md rounded-lg overflow-hidden shadow-xl">
                            <img
                                src="/product17.jpeg"
                                alt="Assorted spices and condiments"
                                className="w-full h-56 sm:h-64 md:h-72 object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
