import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function LoadingPage() {
    const animatedWidth = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedWidth, {
            toValue: 100, // Animate to 100%
            duration: 2000,
            useNativeDriver: false,
        }).start();
    }, [animatedWidth]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Loading...</Text>
            <View style={styles.progressBarContainer}>
                <Animated.View
                    style={[
                        styles.progressBar,
                        {
                            width: animatedWidth.interpolate({
                                inputRange: [0, 100],
                                outputRange: ['0%', '100%'],
                            }),
                        },
                    ]}
                />
            </View>
            <Text style={styles.subtitle}>Preparing your bakery experience</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a202c',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    progressBarContainer: {
        width: 200,
        height: 16,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#2d3748',
    },
    progressBar: {
        height: '100%',
        backgroundColor: 'linear-gradient(to right, #4299e1, #9f7aea)',
    },
    subtitle: {
        marginTop: 16,
        color: '#a0aec0',
        fontSize: 14,
    },
});
