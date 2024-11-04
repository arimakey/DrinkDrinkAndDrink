import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Link, router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

type Props = NativeStackScreenProps<any, 'Recomendacion'>;

export default function RecomendacionScreen({ navigation }: Props) {
  const { recommendation, userId } = useLocalSearchParams();
  const parsedRecommendation = JSON.parse(recommendation + '');

  const handleFeedback = async (feedback: 'positive' | 'negative') => {
    try {
      await axios.post(`https://drinkdrinkdrinkand-78904077df64.herokuapp.com/api/feedback/${userId}/`, { feedback });
      router.navigate('/');
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la retroalimentación: ' + error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍸 Recomendación Final 🍸</Text>
      <View style={styles.recommendationBox}>
        <Text style={styles.recommendationName}>{parsedRecommendation.name}</Text>
        <Text style={styles.recommendationDetails}>
          Tipo: {parsedRecommendation.drink_type} {"\n"}
          Intensidad: {parsedRecommendation.intensity === "Suave" ? "🧊 Suave" : parsedRecommendation.intensity === "Intermedio" ? "🔥 Intermedio" : "💥 Fuerte"} {"\n"}
          Sabor: {parsedRecommendation.flavor_profile === "Dulce" ? "🍭 Dulce" : parsedRecommendation.flavor_profile === "Frutal" ? "🍎 Frutal" : parsedRecommendation.flavor_profile === "Amargo" ? "🍋 Amargo" : parsedRecommendation.flavor_profile === "Ahumado" ? "🔥 Ahumado" : "🌿 Herbal"} {"\n"}
          Temperatura: {parsedRecommendation.temperature === "Fría" ? "❄️ Fría" : "🌡️ Ambiente"} {"\n"}
          Burbujas: {parsedRecommendation.bubbles ? "Sí 🥂" : "No 🍷"}
        </Text>
      </View>

      {/* Botones de retroalimentación */}
      <TouchableOpacity style={styles.feedbackButton} onPress={() => handleFeedback('positive')}>
        <Text style={styles.feedbackButtonText}>👍 Me gustó</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.feedbackButton, styles.negativeButton]} onPress={() => handleFeedback('negative')}>
        <Text style={styles.feedbackButtonText}>👎 No me gustó</Text>
      </TouchableOpacity>

      {/* Enlace para regresar al inicio */}
      <Link href="/" style={styles.linkText}>
        ⬅️ Regresar al inicio
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f2f2f7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  recommendationBox: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 15,
    elevation: 4,
    width: '90%',
    marginBottom: 20,
  },
  recommendationName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  recommendationDetails: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  feedbackButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '80%',
  },
  negativeButton: {
    backgroundColor: '#dc3545',
  },
  feedbackButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkText: {
    color: '#007bff',
    fontSize: 16,
    marginTop: 24,
    textAlign: 'center',
  },
});
