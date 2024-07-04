import { useArtist } from '@/store/library'
import { defaultStyles } from '@/styles'
import { Redirect, useLocalSearchParams } from 'expo-router'
import { ScrollView, View } from 'react-native'
import { screenPadding } from './../../../constants/tokens'
import { ArtistTrackList } from '@/components/ArtistTrackList'

const ArtistDetailsScreen = () => {
	const { name: artistName } = useLocalSearchParams<{ name: string }>()

	const artists = useArtist()

	const artist = artists.find((artist) => artist.name === artistName)

	if (!artist) {
		console.warn(`Artist ${artistName} not found`)

		return <Redirect href={'/(tabs)/artists'} />
	}

	return (
		<View style={defaultStyles.container}>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={{ paddingHorizontal: screenPadding.horizontal }}
			>
				<ArtistTrackList artist={artist} />
			</ScrollView>
		</View>
	)
}

export default ArtistDetailsScreen
