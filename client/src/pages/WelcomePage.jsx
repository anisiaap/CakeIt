import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpring, animated, useTransition } from "@react-spring/web";
import logo from "../assets/img.png";
import cupcakeIcon from "../assets/cupcake.png";

export default function WelcomePage() {
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = useState(false);

  // Button animation
  const [buttonProps, setButtonProps] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 10 },
  }));

  // Page transitions
  const transition = useTransition(!isLeaving, {
    from: { opacity: 0, transform: "translateY(30px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(-30px)" },
    config: { duration: 500 },
    onRest: () => {
      if (isLeaving) navigate("/choice");
    },
  });

  const handleGetStarted = () => {
    setButtonProps.start({ scale: 0.95 });
    setTimeout(() => {
      setButtonProps.start({ scale: 1 });
      setIsLeaving(true);
    }, 150);
  };

  return transition((style, item) =>
          item && (
              <animated.div
                  style={{
                    ...style,
                    background: "url('/wallpaper.png') no-repeat center center / cover",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
              >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between mt-16 max-w-7xl mx-auto px-10">
                  {/* Logo */}
                  <img
                      src={logo}
                      alt="CakeIt Logo"
                      className="w-72 h-72 drop-shadow-xl md:mr-auto"
                  />
                  {/* Text */}
                  <div className="md:ml-40 text-right max-w-md">
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
                      Welcome to <span className="text-pink-500">CakeIt</span>
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Discover bakeries, order delicious treats, and more. Join us to
                      explore a world of delightful baked goods and exceptional
                      experiences.
                    </p>
                  </div>
                </div>

                {/* Features Section */}
                <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-16 max-w-6xl mx-auto px-10">
                  <div className="flex flex-col items-center text-center">
                    <img
                        src={cupcakeIcon}
                        alt="Cupcake"
                        className="w-28 h-28 mb-4 drop-shadow-md"
                    />
                    <h3 className="text-xl font-semibold text-gray-700">
                      Explore Bakeries
                    </h3>
                    <p className="text-lg text-gray-500 mt-2 leading-relaxed">
                      Find the best bakeries near you with ease and simplicity.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <img
                        src={cupcakeIcon}
                        alt="Cupcake"
                        className="w-28 h-28 mb-4 drop-shadow-md"
                    />
                    <h3 className="text-xl font-semibold text-gray-700">
                      EasyBox Pickup
                    </h3>
                    <p className="text-lg text-gray-500 mt-2 leading-relaxed">
                      Reserve a pickup slot for a quick and convenient experience.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <img
                        src={cupcakeIcon}
                        alt="Cupcake"
                        className="w-28 h-28 mb-4 drop-shadow-md"
                    />
                    <h3 className="text-xl font-semibold text-gray-700">
                      Custom Orders
                    </h3>
                    <p className="text-lg text-gray-500 mt-2 leading-relaxed">
                      Place orders tailored to your unique needs and preferences.
                    </p>
                  </div>
                </div>

                {/* Call-to-Action Section */}
                <div className="text-center mt-16 mb-20">
                  <animated.button
                      style={buttonProps}
                      className="px-14 py-4 bg-gradient-to-r from-pink-400 to-yellow-300 text-white font-bold rounded-full shadow-lg hover:scale-110 transition-transform text-lg"
                      onClick={handleGetStarted}
                      onMouseEnter={() => setButtonProps.start({ scale: 1.05 })}
                      onMouseLeave={() => setButtonProps.start({ scale: 1 })}
                  >
                    Get Started
                  </animated.button>
                  <div className="flex justify-center space-x-10 mt-6">
                    <button
                        className="text-md text-gray-700 hover:text-pink-500 transition font-medium"
                        onClick={() => navigate("/home")}
                    >
                      Explore Bakeries
                    </button>
                    <button
                        className="text-md text-gray-700 hover:text-yellow-500 transition font-medium"
                        onClick={() => navigate("/login")}
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              </animated.div>
          )
  );
}
