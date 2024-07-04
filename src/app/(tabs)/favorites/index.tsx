import { TrackList } from '@/components/TracksList'
import { screenPadding } from '@/constants/tokens'
import { defaultStyles } from '@/styles'
import { ScrollView, Text, View } from 'react-native'
import library from '@/assets/data/library.json'
import { useMemo } from 'react'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { useFavorites } from '@/store/library'
import { trackTitleFilter } from '@/helpers/filter'
import { generateTracksListId } from '@/helpers/miscellaneous'

const FavoritesScreen = () => {
	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: 'Find in Songs',
		},
	})

	const favotiteTracks = useFavorites().favorites

	const filteredFavoriteTracks = useMemo(() => {
		if (!search) return favotiteTracks

		return favotiteTracks.filter(trackTitleFilter(search))
	}, [search, favotiteTracks])

	return (
		<View style={defaultStyles.container}>
			<ScrollView
				style={{
					marginTop: 25,
					height: '80%',
					paddingHorizontal: screenPadding.horizontal,
				}}
				contentInsetAdjustmentBehavior="automatic"
			>
				<TrackList
					id={generateTracksListId('favorites', search)}
					tracks={filteredFavoriteTracks}
					scrollEnabled={false}
				/>
			</ScrollView>
		</View>
	)
}

export default FavoritesScreen
