import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<any, 'Registro'>;

export default function RegistroScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    initializer();
  }, []);

  const initializer = async () => {
    try {
      const userIdData = await getData('user_id');
      const usernameData = await getData('username');
      setUsername(usernameData || '');
      setUserId(userIdData || '');
    } catch (error) {
      Alert.alert('Error', `No se pudo inicializar los datos del usuario: ${error}`);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://drinkdrinkdrinkand-78904077df64.herokuapp.com/api/users/', { username });
      const userId = response.data.user_id + '';
      setUserId(userId)
      setUsername(username)
      await saveData('user_id', userId);
      await saveData('username', username);
    } catch (error) {
      Alert.alert('Error', `No se pudo registrar el usuario: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user_id');
      await AsyncStorage.removeItem('username');
      setUserId('');
      setUsername('');
      Alert.alert('Éxito', 'Se ha cerrado la sesión correctamente');
    } catch (error) {
      Alert.alert('Error', `No se pudo cerrar sesión: ${error}`);
    }
  };

  const getData = async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error al obtener los datos', error);
      return null;
    }
  };

  const saveData = async (key: string, value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error al guardar los datos', error);
    }
  };

  return (
    userId ? (
      <View style={styles.container}>
        <Text style={styles.title}>Datos del Usuario</Text>
        <Text style={styles.infoText}>Nombre: {username}</Text>
        <Text style={styles.infoText}>Codigo: {userId}</Text>
        <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={styles.container}>
        <Text style={styles.title}>Registro de Usuario</Text>
        <TextInput
          placeholder="Nombre de usuario"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Registrar</Text>
          )}
        </TouchableOpacity>
      </View>
    )
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 18,
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 18,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonLogout: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});