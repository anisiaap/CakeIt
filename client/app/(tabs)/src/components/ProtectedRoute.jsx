import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigation = useNavigation();

  // Show a loading indicator while authentication state is being checked
  if (loading) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
  }

  // Redirect to Login if not authenticated
  if (!isAuthenticated) {
    navigation.navigate('Login');
    return null;
  }

  // Render the protected children if authenticated
  return children;
};

export default ProtectedRoute;
