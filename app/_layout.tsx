import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="register">
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="questions" options={{ headerShown: false }}/>
      <Stack.Screen name="recommendations" options={{ headerShown: false }}/>
    </Stack>
  );
}
