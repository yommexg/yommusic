import { PlaylistsList } from '@/components/PlaylistsList'
import { Playlist } from '@/helpers/types'
import { usePlaylists, useTracks } from '@/store/library'
import { useQueue } from '@/store/queue'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import TrackPlayer, { Track } from 'react-native-track-player'
import { useHeaderHeight } from '@react-navigation/elements'
import { StyleSheet } from 'react-native'
import { defaultStyles } from '@/styles'
import { screenPadding } from '@/constants/tokens'

const AddToPlaylistModal = () => {
	const { trackUrl } = useLocalSearchParams<{ trackUrl: Track['url'] }>()
	const tracks = useTracks()
	const headerHeight = useHeaderHeight()

	const { activeQueueId } = useQueue()

	const { playlists, addToPlaylist } = usePlaylists()

	const track = tracks.find((currentTrack) => trackUrl === currentTrack.url)

	if (!track) {
		return null
	}

	const avaliablePlaylists = playlists.filter(
		(playlist) => !playlist.tracks.some((playlistTrack) => playlistTrack.url === track.url),
	)

	const handlePlaylistPress = async (playlists: Playlist) => {
		addToPlaylist(track, playlists.name)

		// Close the modal
		router.dismiss()

		// If the current queue is on the playlist we are adding to, add the track at the end of the queue
		if (activeQueueId?.startsWith(playlists.name)) {
			await TrackPlayer.add(track)
		}
	}

	return (
		<SafeAreaView style={[styles.modalContainer, { paddingTop: headerHeight }]}>
			<PlaylistsList playlists={avaliablePlaylists} onPlaylistPress={handlePlaylistPress} />
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	modalContainer: {
		...defaultStyles.container,
		paddingHorizontal: screenPadding.horizontal,
		alignItems: 'flex-start',
		marginTop: 0,
	},
})

export default AddToPlaylistModal
