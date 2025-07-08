import React, {useState} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native';


export default function Orders({ visible, setVisible, orders, setOrders, ordered, setOrdered, setTotalPrice, setOrderNo, setEditedOrderNo, lifetimeOrders }) {
    async function readData() {
      try {
        const value = await AsyncStorage.getItem('orders');
        if (value !== null) {
          console.log("read item: " + value);
          const parsed = JSON.parse(value);
          // Always return an array
          return Array.isArray(parsed) ? parsed : [parsed];
        }
        return []; // Return empty array if nothing stored
      } catch (e) {
        console.error("Error reading data", e);
      }
    }

    async function storeData(newOrders) {
      try {
        const d = new Date();
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0'); 
        const day = d.getDate().toString().padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        const prevOrders = await readData();
        const updatedOrders = prevOrders.concat({...newOrders, date: formattedDate});
        await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
      } catch (e) {
        console.error("Error storing data", e);
      }
    }


    const [showCalc, setShowCalc] = useState(false);
    const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
    const [moneyGiven, setMoneyGiven] = useState('');
    const [change, setChange] = useState(null);

    function editOrder(orderIndex) {
      const order = orders[orderIndex];
      setOrdered(order.items);
      setTotalPrice(order.totalPrice);
      setVisible(false);
      setOrderNo(order.orderNo)
      setEditedOrderNo(order.orderNo)
    }

    function finishOrder(index){
      setSelectedOrderIndex(index);
      setShowCalc(true);
    }

    function confirmPayment() {
    const order = orders[selectedOrderIndex];
    const given = parseFloat(moneyGiven);
    const total = parseFloat(order.totalPrice);

    if (isNaN(given)) {
      alert("Please enter a valid number.");
      return;
    }

    if (given < total) {
      alert("Insufficient payment.");
      return;
    }

    const calcChange = given - total;
    setChange(calcChange.toFixed(2)); // 2 decimal places
  }

  function finalizeOrder() {
    const index = selectedOrderIndex;

    setOrders(prev => prev.filter(p => p.orderNo !== orders[index].orderNo));
    setOrdered([]);
    setTotalPrice(0);
    setOrderNo(lifetimeOrders);
    storeData(orders[index]);

    // Reset states
    setShowCalc(false);
    setSelectedOrderIndex(null);
    setMoneyGiven('');
    setChange(null);
  }


  

  if (showCalc) {
  const order = orders[selectedOrderIndex];
  return (
    <View style={styles.calcWrapper}>
      <Text style={{ fontSize: 40, fontWeight: 'bold', textAlign: "center", color:"white", width:"100%", height: 70, marginTop: 25 }}>
        Order # {order?.orderNo}
      </Text>
      <View style={styles.separator}/>
      <Text style={{ fontSize: 40, fontWeight: 'bold', textAlign: "center", color:"white"  }}>Total: {order?.totalPrice}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, marginRight: 10 }}>₱</Text>
        <TextInput
          style={{
            borderWidth: 2,
            padding: 10,
            width: 450,
            borderRadius: 8,
            fontSize: 25,
            color:"white",
          }}
          keyboardType="numeric"
          value={moneyGiven}
          onChangeText={setMoneyGiven}
          autoFocus={true}
          placeholder="payment amount"
        />
      </View>
      
      <View style={{height: "15%", gap:25, alignItems:"center"}}> 
      {change !== null && (
        <Text style={{ marginTop: 20, fontSize: 30, backgroundColor:"#F5D107", paddingVertical:15, borderRadius:25, paddingHorizontal: 25, fontWeight: "bold" }}>
          Change: ₱{change}
        </Text>
      )}

      {change !== null && (
              <TouchableOpacity
                style={[styles.finishButton, { backgroundColor: "#2E7D32" }]}
                onPress={finalizeOrder}
              >
                <Text style={styles.finishText}>Confirm</Text>
              </TouchableOpacity>
            )}
      </View>


        <View style={styles.calcButtons}>

          <View style={{flexDirection:"row", justifyContent: "center", alignItems: "center", gap: 25}}>
            <TouchableOpacity
              style={styles.finishButton}
              onPress={confirmPayment}
            >
              <Text style={styles.finishText}>Calculate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.finishButton, { backgroundColor: "gray" }]}
              onPress={() => {
                setShowCalc(false);
                setSelectedOrderIndex(null);
                setMoneyGiven('');
                setChange(null);
              }}
            >
              <Text style={styles.finishText}>Cancel</Text>
            </TouchableOpacity>
          </View>

        </View>
        

      
    </View>
  );
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
                <TouchableOpacity style={styles.finishButton} onPress={()=>finishOrder(index)}>
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
  calcButtons: {
    height: "35%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "column",
    gap: 35,

  },
  calcWrapper: {
    width: 600,
    height: 750,
    backgroundColor: "#136E9B",
    borderRadius: 15,
    alignItems: "center",
    padingTop: 100
  },

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
