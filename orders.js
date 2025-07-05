import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";



export default function Orders({ visible, setVisible, orders, setOrders, ordered, setOrdered, setTotalPrice, setOrderNo, setEditedOrderNo }) {

    function editOrder(orderIndex) {
        const order = orders[orderIndex];
        setOrdered(order.items);
        setTotalPrice(order.totalPrice);
        setVisible(false);
        setOrderNo(order.orderNo)
        setEditedOrderNo(order.orderNo)
    }


  return (
    <View style={{ width: 1300, height: 750, backgroundColor: "#EDEBDE", borderRadius: 15 }}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => setVisible(false)} style={styles.exit}>
          <Text style={styles.exitText}>X</Text>
        </TouchableOpacity>
      </View>


      <FlatList
        data={orders}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          marginBottom: 25,
          gap: 25
        }}
        contentContainerStyle={{
          padding: 25,
        }}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.orderWrapper} onPress={()=>editOrder(index)}>
            <Text style={styles.orderNo}>ORDER #{orders[index].orderNo}</Text>
            <View style={styles.separator} />

            {/* Items in the order */}
            <ScrollView style={styles.itemsWrapper}>
              {item.items.map((orderItem, i) => (
                <View
                  key={i}
                  style={i % 2 !== 0 ? styles.orderedItem : styles.darker}
                >
                  <View style={styles.amountWrapper}>
                    <Text style={styles.itemText}>{orderItem.amount}</Text>
                  </View>
                  <View style={styles.nameWrapper}>
                    <Text style={styles.itemText}>{orderItem.name}</Text>
                  </View>
                  <View style={styles.priceWrapper}>
                    <Text style={styles.itemText}>
                      {orderItem.price * orderItem.amount}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

 
            <View style={styles.bottom}>
              <View style={styles.totalWrapper}>
                <Text style={styles.totalTitle}>Total</Text>
                <Text style={styles.totalTitle}>{item.totalPrice}</Text>
              </View>
              <View style={styles.center}>
                <TouchableOpacity style={styles.finishButton} onPress={()=>setOrders(prev=>prev.filter((p)=>p.orderNo!==orders[index].orderNo))}>
                  <Text style={styles.finishText}>Finish Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  finishButton: {
    backgroundColor: "#D6472E",
    width: 200,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  finishText: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
  },
  totalWrapper: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  totalTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  bottom: {
    backgroundColor: "#E7C60C",
    width: "100%",
    height: "25%",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  itemText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  amountWrapper: {
    width: "10%",
  },
  nameWrapper: {
    width: "55%",
    justifyContent: "center",
    alignItems: "center",
  },
  priceWrapper: {
    width: "35%",
    alignItems: "center",
  },
  orderedItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 10,
  },
  darker: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 10,
    backgroundColor: "#0E577B",
  },
  itemsWrapper: {
    flex: 1,
    width: "100%",
  },
  orderWrapper: {
    borderRadius: 10,
    height: 600,
    width: 390,
    backgroundColor: "#136E9B",
  },
  header: {
    width: "100%",
    height: 50,
    alignItems: "flex-end",
  },
  exit: {
    backgroundColor: "red",
    height: 50,
    width: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  exitText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  orderNo: {
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
    paddingTop: 25,
  },
  separator: {
    height: 2,
    width: "100%",
    backgroundColor: "black",
    marginVertical: 25,
  },
});
