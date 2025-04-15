import { useFonts } from 'expo-font'; // Đảm bảo import useFonts từ expo-font
import { Poppins_700Bold, Poppins_500Medium, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { Roboto_400Regular,Roboto_700Bold } from '@expo-google-fonts/roboto';
import { PlusJakartaSans_400Regular,PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

export default function useCustomFonts() {
  const [fontsLoaded, error] = useFonts({
    Poppins_700Bold,
    Poppins_500Medium,
    Roboto_400Regular,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_400Regular,
    Poppins_400Regular,
    Roboto_700Bold,
  });

  useEffect(() => {
    // Chỉ ẩn splash screen khi fonts đã tải xong
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }

    // Xử lý lỗi nếu font không tải được
    if (error) {
      console.error('Error loading fonts:', error);
      // Bạn có thể xử lý lỗi tại đây (ví dụ, hiển thị một UI thay thế)
    }
  }, [fontsLoaded, error]);

  return { fontsLoaded, error };
}