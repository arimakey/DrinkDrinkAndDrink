import React, { useState, useCallback } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function Index() {
  const [userId, setUserId] = useState<string | null>(null);

  const checkUserId = async () => {
    const storedUserId = await getData("user_id");
    setUserId(storedUserId);
  };

  useFocusEffect(
    useCallback(() => {
      checkUserId();
    }, [])
  );

  const getData = async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error("Error al obtener los datos", error);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      {userId ? (
        <>
          <Text style={styles.title}>¡Estás listo, usuario!</Text>
          <Text style={styles.message}>Puedes comenzar cuando quieras.</Text>
          <Text onPress={() => router.navigate({ pathname: '/questions', params: { user: userId } })} style={styles.link}>
            <Text style={styles.linkText}>Comienza Ahora!</Text>
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.title}>¡Bienvenido!</Text>
          <Text style={styles.message}>Parece que aún no tienes una cuenta.</Text>
          <Link href="/register" style={styles.link}>
            <Text style={styles.linkText}>Regístrate Ahora!</Text>
          </Link>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  link: {
    backgroundColor: "#6200EE",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  linkText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
