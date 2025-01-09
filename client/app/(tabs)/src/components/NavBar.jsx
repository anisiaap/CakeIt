import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo_git.png';

export default function NavBar() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigation.navigate('Welcome');
  };

  return (
      <View style={styles.navBar}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
            <View style={styles.logoContainer}>
              <Image source={logo} style={styles.logo} />
              <Text style={styles.title}>CakeIT</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.linksContainer}>
            {!isAuthenticated ? (
                <>
                  <NavLink to="Welcome">Welcome</NavLink>
                  <NavLink to="Login">Login</NavLink>
                  <NavLink to="SignUp">Sign Up</NavLink>
                </>
            ) : (
                <>
                  <NavLink to="Home">Home</NavLink>
                  <NavLink to="BakeryDetails">Bakery Details</NavLink>
                  <NavLink to="Cart">Cart</NavLink>
                  <NavLink to="Profile">My Profile</NavLink>
                  <NavLink to="AddBakeries">Add Bakery</NavLink>
                  <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                  </TouchableOpacity>
                </>
            )}
          </View>
        </View>
      </View>
  );
}

function NavLink({ to, children }) {
  const navigation = useNavigation();
  return (
      <TouchableOpacity
          onPress={() => navigation.navigate(to)}
          style={styles.navLink}
      >
        <Text style={styles.navLinkText}>{children}</Text>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  linksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navLink: {
    marginHorizontal: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: '#f2f2f2',
  },
  navLinkText: {
    fontSize: 14,
    color: '#000',
  },
  logoutButton: {
    marginHorizontal: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: '#e74c3c',
  },
  logoutText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});
