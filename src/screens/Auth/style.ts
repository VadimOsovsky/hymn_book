import { StyleSheet } from "react-native";
import { Colors } from "react-native-paper";
import { lightTheme } from "../../styles/appTheme";
import { fullWH } from "../../styles/styleVariables";

const authSheetPadding = 20;

export default StyleSheet.create({
  bgPic: {
    ...fullWH,
  },
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    flexGrow: 1,
  },
  authSheetWrapper: {
    padding: 20,
    flex: 0,
    maxWidth: 500,
    width: "100%",
  },
  authSheet: {
    paddingVertical: authSheetPadding,
    width: "100%",
    borderRadius: 5,
    backgroundColor: lightTheme.colors.background,
  },
  titlesContainer: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: authSheetPadding,
  },
  title: {
    color: Colors.black,
  },
  authInfoText: {
    marginHorizontal: authSheetPadding,
    marginBottom: 10,
    opacity: 0.6,
  },
  form: {
    paddingHorizontal: authSheetPadding,
  },
  input: {
    color: Colors.black,
  },
  button: {
    marginTop: 30,
    marginBottom: 20,
    marginHorizontal: authSheetPadding,
  },

  offlineBtn: {
    padding: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.teal500,
  },
  offlineBtnText: {
    marginLeft: 10,
    color: Colors.white,
    letterSpacing: 0.2,
    fontFamily: "sans-serif-medium",
  },
});
