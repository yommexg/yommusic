import { View, Text, SafeAreaView, SafeAreaViewBase } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { SplashScreen, Stack } from 'expo-router'
import { useSetupTrackPlayer } from './../hooks/useSetupTrackPlayer'
import { useCallback } from 'react'
import { useLogTrackPLayerState } from '@/hooks/useLogTrackPlayerState'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { MenuProvider } from 'react-native-popup-menu'
import { colors } from '@/constants/tokens'
import TrackPlayer from 'react-native-track-player'
import { playbackService } from '@/constants/playbackService'

SplashScreen.preventAutoHideAsync()

TrackPlayer.registerPlaybackService(() => playbackService)

const App = () => {
	const handleTrackPlayerLoaded = useCallback(() => {
		SplashScreen.hideAsync()
	}, [])

	useSetupTrackPlayer({
		onLoad: handleTrackPlayerLoaded,
	})

	useLogTrackPLayerState()

	return (
		<SafeAreaProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<MenuProvider>
					<RootNavigation />
				</MenuProvider>
				<StatusBar style="auto" />
			</GestureHandlerRootView>
		</SafeAreaProvider>
	)
}

const RootNavigation = () => {
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen
				name="player"
				options={{
					presentation: 'card',
					gestureEnabled: true,
					gestureDirection: 'vertical',
					animationDuration: 400,
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="(modals)/addToPlaylist"
				options={{
					presentation: 'modal',
					headerStyle: {
						backgroundColor: colors.background,
					},
					headerTitle: 'Add to Playlist',
					headerTitleStyle: {
						color: colors.text,
					},
				}}
			/>
		</Stack>
	)
}

export default App
