import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated, useTransition } from '@react-spring/web';

export default function ChooseRole() {
    const navigate = useNavigate();
    const [isLeaving, setIsLeaving] = useState(false); // To track if the page is leaving
    const [targetPath, setTargetPath] = useState(''); // To store the navigation target

    // Button animation (scaling effect)
    const buttonProps = useSpring({
        scale: 1,
        config: { tension: 300, friction: 10 },
    });

    // Page transition animation
    const transition = useTransition(!isLeaving, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 300 },
        onRest: () => {
            if (isLeaving) navigate(targetPath); // Navigate when animation completes
        },
    });

    // Handle role selection
    const handleRoleSelect = (path) => {
        setTargetPath(path); // Store target path
        setIsLeaving(true); // Trigger leaving animation
    };

    return transition((style, show) =>
            show && (
                <animated.div style={style} className="min-h-screen flex items-start justify-center pt-20">
                    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
                        {/* Header */}
                        <div className="text-center space-y-4 mb-12">
                            <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
                                Connect with
                                <br />
                                Bakeries
                            </h1>
                            <p className="text-gray-400 max-w-[600px] mx-auto">
                                Explore bakeries, view products, and place custom orders.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="w-full max-w-[600px] space-y-4">
                            <animated.button
                                style={buttonProps}
                                className="w-full h-14 rounded-xl bg-black text-white hover:bg-gray-200"
                                onClick={() => handleRoleSelect('/login-bakery')}
                                onMouseEnter={() => buttonProps.scale.set(1.05)}
                                onMouseLeave={() => buttonProps.scale.set(1)}
                            >
                                I am a Bakery
                            </animated.button>
                            <animated.button
                                style={buttonProps}
                                className="w-full h-14 rounded-xl bg-black text-white hover:bg-gray-200"
                                onClick={() => handleRoleSelect('/login')}
                                onMouseEnter={() => buttonProps.scale.set(1.05)}
                                onMouseLeave={() => buttonProps.scale.set(1)}
                            >
                                I am a Bakery Lover
                            </animated.button>
                        </div>

                        {/* Footer Links */}
                        <div className="flex items-center justify-between w-full max-w-[600px] mt-6">
                            <button
                                className="text-sm text-gray-400 hover:text-white"
                                onClick={() => navigate('/home')}
                            >
                                Check out more bakeries
                            </button>
                            <button
                                className="text-sm text-black hover:text-gray-200"
                                onClick={() => navigate('/login')}
                            >
                                Sign in
                            </button>
                        </div>
                    </div>
                </animated.div>
            )
    );
}
