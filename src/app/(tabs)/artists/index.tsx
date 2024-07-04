import { unknownArtistImageUri } from '@/constants/images'
import { screenPadding } from '@/constants/tokens'
import { artistNameFilter } from '@/helpers/filter'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { useArtist } from '@/store/library'
import { defaultStyles, utilsStyles } from '@/styles'
import { Link } from 'expo-router'
import { useMemo } from 'react'
import { FlatList, Text, TouchableHighlight, View, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import { ScrollView } from 'react-native-gesture-handler'

const ItemSeparatorComponent = () => {
	return (
		<View
			style={[
				utilsStyles.itemSeparator,
				{
					marginLeft: 50,
					marginVertical: 12,
				},
			]}
		/>
	)
}

const ArtistsScreen = () => {
	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: 'Find in Artist',
		},
	})

	const artist = useArtist()

	const filteredArtist = useMemo(() => {
		if (!search) return artist

		return artist.filter(artistNameFilter(search))
	}, [artist, search])

	return (
		<View style={defaultStyles.container}>
			<ScrollView
				style={{ marginTop: 25, height: '80%', paddingHorizontal: screenPadding.horizontal }}
				contentInsetAdjustmentBehavior="automatic"
			>
				<FlatList
					contentContainerStyle={{ paddingTop: 10, paddingBottom: 120 }}
					scrollEnabled={false}
					ItemSeparatorComponent={ItemSeparatorComponent}
					ListFooterComponent={ItemSeparatorComponent}
					ListEmptyComponent={
						<View>
							<Text>No Artist Found</Text>

							<FastImage
								source={{
									uri: unknownArtistImageUri,
									priority: FastImage.priority.normal,
								}}
								style={utilsStyles.emptyContentImage}
							/>
						</View>
					}
					data={filteredArtist}
					renderItem={({ item: artist }) => {
						return (
							<Link href={`/artists/${artist.name}`} asChild>
								<TouchableHighlight activeOpacity={0.8}>
									<View style={styles.artistItemContainer}>
										<View>
											<FastImage
												source={{
													uri: unknownArtistImageUri,
													priority: FastImage.priority.normal,
												}}
												style={styles.artistImage}
											/>
										</View>
										<View style={{ width: '100%' }}>
											<Text numberOfLines={1} style={styles.artistNameText}>
												{artist.name}
											</Text>
										</View>
									</View>
								</TouchableHighlight>
							</Link>
						)
					}}
				/>
			</ScrollView>
		</View>
	)
}

export default ArtistsScreen

const styles = StyleSheet.create({
	artistItemContainer: {
		flexDirection: 'row',
		columnGap: 14,
		alignItems: 'center',
	},
	artistImage: {
		borderRadius: 32,
		width: 40,
		height: 40,
	},
	artistNameText: {
		...defaultStyles.text,
		fontSize: 17,
		maxWidth: '80%',
	},
})
