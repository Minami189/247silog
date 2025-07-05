import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";

export default function Item({ name, price, image, onPress }) {
  return (
    <TouchableOpacity style={styles.itemWrapper} onPress={onPress}>
      <Image style={styles.itemImage} source={image} />
      <Text style={styles.itemName}>{name}</Text>
      <Text style={styles.itemPrice}>{price}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    backgroundColor: "#136E9B",
    width: 155,
    height: 200,
    borderRadius: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "transparent",
    elevation: 15,
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  itemName: {
    color: "#F2CF10",
    fontSize: 21,
    fontWeight: "bold",
  },
  itemPrice: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
