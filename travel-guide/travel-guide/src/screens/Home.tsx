import { Text, View, TextInput, Pressable, Keyboard, Alert, ActivityIndicator, ScrollView} from "react-native";
import { Feather} from '@expo/vector-icons'

import React, { useState } from 'react';
import api from "../services/api";
import Slider from "@react-native-community/slider";

export function Home() {

  const [pressed, setPressed] = useState(false);
  const [roadmap, setRoadmap] = useState('');
  const [city, setCity] = useState('');
  const [days, setDays] = useState(3);
  async function handleButtonPress() {
    if(!city){
      return Alert.alert("Por favor informe uma cidade!")
    }

    setRoadmap('')

    const body = JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "user",
          "content": `Crie roteiro de ${days} dias, com pontos turisticos para serem visitados na cidade de ${city}. Trazer um roteiro resumido em topicos.`
        }
      ]
      })
    setPressed(true);
    Keyboard.dismiss();
    const response = await api.post('/chat/completions', body,
      {
        headers: {
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },   
    )
    const text = (response.data.choices[0].message.content)
    setRoadmap(text)
    console.log(roadmap)
    setPressed(false);
    
  }

  return (
    <View className="flex-1 bg-black p-4">
        <View className="mt-20 flex-row items-center justify-center w-full">
          <Text className="p-3 text-white text-4xl font-semibold">Guia de Viagem</Text>
          <Feather name="map" size={30} color="#fff" />
        </View>
        <View className="items-center justify-center w-full">
          <Text className="text-zinc-200 text-sm">By: Igor Silva</Text>
        </View>
        <View className="w-full items-center py-4">
          <TextInput className="w-full h-14 bg-white rounded-md p-3 text-base"  placeholder="Digite o destino" onChangeText={setCity}/>
        </View>
        <View className="w-full mb-4 p-2 ">
          <Slider minimumValue={1} maximumValue={7} step={1} onValueChange={setDays} value={days} />
          <Text className="text-white text-md font-bold">{`Quantidade de Dias: ${days}`}</Text>
        </View>
        {
          pressed ? (
            <Pressable onPress={handleButtonPress}>
              <View className="w-full h-14 bg-blue-500 items-center justify-center rounded-md flex-row">
                <Text className="font-bold text-lg text-white px-2">Carregando</Text>
                <ActivityIndicator color="white"/>
              </View>
            </Pressable>
          ):(
            <Pressable onPress={handleButtonPress}>
              <View className="w-full h-14 bg-blue-500 items-center justify-center rounded-md">
                <Text className="font-bold text-lg text-white">Buscar</Text>
              </View>
            </Pressable>
          )
        }
      <>
        {
          roadmap && (
            <View className="items-center justify-center p-4 mt-10 w-full rounded-lg bg-zinc-900 h-[50%]">
              <Text className="text-white text-2xl items-center justify-center font-semibold">Roteiro de Viagem</Text>
              <ScrollView showsVerticalScrollIndicator={false} className="mt-3">
                  <Text className="text-white text-lg items-center justify-center leading-tight">{roadmap}</Text>
              </ScrollView>
            </View>
          )
        }
      </>
      
    </View>
  )
}