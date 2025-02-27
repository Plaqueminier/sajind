import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  mediaContainer: {
    width: width * 0.9,
    height: height * 0.6,
    alignItems: "center",
    justifyContent: "center",
  },
  media: {
    width: width * 0.85,
    height: height * 0.55,
    borderRadius: 8,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
  },
  swipeIndicatorContainer: {
    position: "absolute",
    top: 50,
    zIndex: 10,
    width: "100%",
    alignItems: "center",
  },
  swipeIndicator: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 8,
    borderRadius: 8,
  },
  keepIndicator: {
    color: "#4CAF50",
    backgroundColor: "rgba(76, 175, 80, 0.2)",
  },
  deleteIndicator: {
    color: "#F44336",
    backgroundColor: "rgba(244, 67, 54, 0.2)",
  },
  instructionContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  instruction: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  actionButtons: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 3,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  keepButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
}); 