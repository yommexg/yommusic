import { useFavorites } from '@/store/library'
import { useQueue } from '@/store/queue'
import { StyleSheet, View, Text } from 'react-native'
import { useRouter } from 'expo-router'
import { PropsWithChildren } from 'react'
import TrackPlayer, { Track } from 'react-native-track-player'
import { match } from 'ts-pattern'
import { Menu, MenuOptions, MenuTrigger, MenuOption } from 'react-native-popup-menu'
import { FontAwesome } from '@expo/vector-icons'
import { colors } from '@/constants/tokens'

type TrackShortcutMenuProps = PropsWithChildren<{ track: Track }>

const Divider = () => <View style={styles.divider} />

export const TrackShortcutMenu = ({ track, children }: TrackShortcutMenuProps) => {
	const router = useRouter()

	const isFavorite = track.rating === 1

	const { toggleTrackFavorite } = useFavorites()
	const { activeQueueId } = useQueue()

	const handlePressAction = async (id: string) => {
		switch (id) {
			case 'add-to-favorites':
				toggleTrackFavorite(track)

				if (activeQueueId?.startsWith('favorites')) {
					await TrackPlayer.add(track)
				}
				break

			case 'remove-from-favorites':
				toggleTrackFavorite(track)

				// Check if the track is in the favorite queue and remove it if necessary
				if (activeQueueId?.startsWith('favorites')) {
					const queue = await TrackPlayer.getQueue()
					const trackToRemove = queue.findIndex((queueTrack) => queueTrack.url === track.url)

					if (trackToRemove !== -1) {
						await TrackPlayer.remove(trackToRemove)
					}
				}
				break

			case 'add-to-playlist':
				// Open the addToPlaylist modal
				router.push({ pathname: '(modals)/addToPlaylist', params: { trackUrl: track.url } })
				break

			default:
				console.warn(`Unknown menu action ${id}`)
				break
		}
	}

	return (
		<Menu>
			<MenuTrigger
				customStyles={{
					triggerWrapper: {
						// top: 20,
					},
				}}
			>
				{children}
			</MenuTrigger>
			<MenuOptions
				customStyles={{
					optionsContainer: styles.container,
				}}
			>
				<MenuOption
					onSelect={() =>
						handlePressAction(isFavorite ? 'remove-from-favorites' : 'add-to-favorites')
					}
					customStyles={{
						optionWrapper: {
							flexDirection: 'row',
							alignItems: 'center',
							gap: 10,
						},
					}}
				>
					{isFavorite ? (
						<FontAwesome name="star-o" size={18} />
					) : (
						<FontAwesome name="star" size={18} />
					)}
					<Text>{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</Text>
				</MenuOption>
				<Divider />
				<MenuOption
					onSelect={() => handlePressAction('add-to-playlist')}
					customStyles={{
						optionWrapper: {
							flexDirection: 'row',
							alignItems: 'center',
							gap: 10,
						},
					}}
				>
					<FontAwesome name="plus" size={18} />
					<Text>Add to playlist</Text>
				</MenuOption>
			</MenuOptions>
		</Menu>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
	},
	divider: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: '#7F8487',
		marginVertical: 5,
	},
})
