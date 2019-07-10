import { StyleSheet } from 'react-native';
import { fullWH } from "../../styles/styleVariables";

export default StyleSheet.create({
  lyricsView: {
    ...fullWH,
    padding: 10,
  },
  lyricsText: {
    fontSize: 17,
    opacity: 0.85,
  }
})
