import { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLocalSearchParams, useRouter } from 'expo-router';

type Props = NativeStackScreenProps<any, 'Pregunta'>;

export default function PreguntaScreen({ route, navigation }: Props) {
  const { user } = useLocalSearchParams();
  const [pregunta, setPregunta] = useState<string>('');
  const [opciones, setOpciones] = useState<string[]>([]);
  const [index, setIndex] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    obtenerPregunta();
  }, []);

  const obtenerPregunta = async () => {
    try {
      const response = await axios.get(
        `https://drinkdrinkdrinkand-78904077df64.herokuapp.com/api/questions/next/${user}/`
      );
      if (response.data.recommendation) {
        router.navigate({
          pathname: '/recommendations',
          params: { recommendation: JSON.stringify(response.data.recommendation), userId: user },
        });
      } else {
        setPregunta(response.data.question);
        setOpciones(response.data.options);
        setIndex(response.data.index);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la pregunta' + error);
    }
  };

  const responderPregunta = async (respuesta: string) => {
    try {
      await axios.post(
        `https://drinkdrinkdrinkand-78904077df64.herokuapp.com/api/questions/answer/${user}/`,
        { answer: respuesta }
      );
      obtenerPregunta();
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la respuesta');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{pregunta}</Text>
      {opciones.map((opcion, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionButton}
          onPress={() => responderPregunta(opcion)}
        >
          <Text style={styles.optionButtonText}>{opcion}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 26,
    marginBottom: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  optionButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    width: '80%', // Ajusta el ancho de los botones
  },
  optionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
});
