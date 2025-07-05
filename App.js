import React, {useState} from 'react';
import { Image, View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, TouchableHighlight, Modal, Pressable} from 'react-native';
import Item from "./Item.js";
import itemList from "./ItemsList.js";
import Orders from "./orders.js";
export default function App() {


  const [lifetimeOrders, setLifetimeOrders] = useState(1)
  const [ordered, setOrdered] = useState([]);
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderNo, setOrderNo] = useState(1);
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState(itemList);
  const [filtering, setFiltering] = useState("all");
  const [editedOrderNo, setEditedOrderNo] = useState(null);


  function itemClick(name, price) {
    setOrdered((prev) => {
      // Check if the item already exists
      const index = prev.findIndex(order => order.name === name);

      if (index >= 0) {
        // If it exists, create a new array with updated amount
        return prev.map((order, i) => {
          if (i === index) {
            return {
              ...order,
              amount: order.amount + 1
            };
          }
          return order;
        });
      } else {
        // If not exists, add it with amount 1
        return prev.concat({ name, price, amount: 1 });
      }
    });
    setTotalPrice(prev=>prev+price)
  }


  function resetOrder(){
    setOrdered([])
    setTotalPrice(0)
    console.log("resetting")
  }

  function confirmOrder() {
    if (ordered.length === 0) {
      alert("Must input at least 1 item");
      return;
    }

    if (editedOrderNo !== null) {
      // Editing an existing order
      setOrders(prev =>
        prev.map(order =>
          order.orderNo === editedOrderNo ? { ...order, items: ordered, totalPrice } : order
        )
      );
      setOrderNo(lifetimeOrders);
    } else {
      // Creating a new order
      setOrders(prev =>
        prev.concat({
          items: ordered,
          totalPrice,
          orderNo
        })
      );

      setLifetimeOrders((prev) => {
        const next = prev + 1;
        setOrderNo(next);
        return next;
      });
    }

    

    setOrdered([]);
    setTotalPrice(0);
    setEditedOrderNo(null);
  }


  function increaseOrder(index) {
  setOrdered(prev => {
    const newOrders = [...prev];
    newOrders[index] = {
      ...newOrders[index],
      amount: newOrders[index].amount + 1
    };
    return newOrders;
  });
    setTotalPrice(prev => prev + ordered[index].price);
  }
  

function decreaseOrder(index) {
    setOrdered(prev => {
      const newOrders = [...prev];
      if (newOrders[index].amount > 1) {
        newOrders[index] = {
          ...newOrders[index],
          amount: newOrders[index].amount - 1
        };
        setTotalPrice(prev => prev - ordered[index].price);
        return newOrders;
      } else {
        // Optionally remove the item if amount reaches 0
        const removed = newOrders.filter((_, i) => i !== index);
        setTotalPrice(prev => prev - ordered[index].price);
        return removed;
      }
    });
  }

  function seeOrders(){
    setVisible(true);
  }

  function filter(category){
    setFiltering(category);
    if(category == "all"){
      setItems(itemList);
    }else{
      setItems(itemList.filter((item)=>{
        return item.category == category;
      }))
    }
  
  }
  
  return (
    <View style={styles.wrapper}>
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable style={styles.backdrop} onPress={() => setVisible(false)} />

          <View style={styles.modalContent}>
            <Orders visible={visible} setVisible={setVisible} orders={orders} setOrders={setOrders} ordered={ordered} setOrdered={setOrdered} setOrderNo={setOrderNo} setTotalPrice={setTotalPrice} setEditedOrderNo={setEditedOrderNo}/>
          </View>
        </View>
      </Modal>


      <View style={styles.left}>
        <View style={styles.filterbar}>
          <TouchableOpacity onPress={()=>filter("all")}><Text style={filtering=="all" ? styles.filterSelected : styles.filterText }>All</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=>filter("meal")}><Text style={filtering=="meal" ? styles.filterSelected : styles.filterText}>Meals</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=>filter("drinks")}><Text style={filtering=="drinks" ? styles.filterSelected : styles.filterText}>Drinks</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=>filter("extras")}><Text style={ filtering=="extras" ? styles.filterSelected : styles.filterText}>Extras</Text></TouchableOpacity>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          numColumns={4}
          contentContainerStyle={styles.itemsWrapper}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            marginBottom: 25,
            gap: 25
          }}
          renderItem={({ item }) => (
            <Item
              name={item.name}
              price={item.price}
              image={item.image}
              onPress={() => {
                itemClick(item.name, item.price);
              }}
            />
          )}
        />

      </View>

      <View style={styles.right}>
        <View style={styles.overallWrapper}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Order #{orderNo}</Text>

          <TouchableOpacity onPress={seeOrders}><View style={styles.ordersButton}><Text style={styles.buttonText}>See Orders</Text></View></TouchableOpacity>
        </View>
        <View style={styles.separator}/>

          <ScrollView style={styles.orderedList}>
            {
              ordered.map((order, index)=>{
                return(
                  <View style={index%2!=0 ? styles.orderedItem : styles.darker}>

                    <View style={styles.amountWrapper}>
                      <TouchableHighlight onPress={()=>decreaseOrder(index)}><Image source={require("./assets/Minus.png")} style={styles.controls}/></TouchableHighlight>
                      <Text style={styles.orderedText}>{order.amount || 1}</Text>
                      <TouchableHighlight onPress={()=>increaseOrder(index)}><Image source={require("./assets/Add.png")} style={styles.controls}/></TouchableHighlight>
                    </View>

                    <View style={styles.orderedNameWrapper}>
                      <Text style={styles.orderedText}>{order.name}</Text>
                    </View>
                    
                    <View style={styles.orderedPriceWrapper}>
                      <Text style={styles.orderedText}>{order.amount * order.price}</Text>
                    </View>
                    
                  </View>
                )
              })
            }
          </ScrollView>

        <View style={styles.bottomRight}>

          <View style={styles.totalWrapper}>
            <Text style={styles.totalTitle}>Total</Text>
            <Text style={styles.totalPrice}>{totalPrice}</Text>
          </View>

          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.resetButton} onPress={resetOrder}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={confirmOrder} style={styles.confirmButton}>
              <View><Text style={styles.buttonText}>Confirm</Text></View>
            </TouchableOpacity>
            
          </View>
        </View>
        </View>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({

  
 header : {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-evenly",
  height: "10%"
 },

 headerText : {
  fontSize: 33,
  color: "white",
  fontWeight: "bold"
 },
 ordersButton: {
  backgroundColor: "#F5D107",
  width: 250,
  height: 85,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 15
 },

 buttonText: {
  fontSize: 33,
  fontWeight: "bold"
 },

 wrapper: {
  flex: 1,
  flexDirection: "row",
  backgroundColor: "#EDEBDE"
 },

 left: {
  paddingTop: 70,
  width: "65%",
  flexDirection: "column",
  alignItems: "center"
 },

 right: {
  paddingTop: 70,
  backgroundColor: "#136E9B",
  width: "35%",
  position: "relative",
  flex: 1
 },

 filterbar: {
  backgroundColor: "#136E9B",
  width: "80%",
  height: "10%",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingLeft: 55,
  paddingRight: 55,
  borderRadius: 15,
 },

filterText: {
  fontSize: 27,
  color: "#F2CF10",
  fontWeight: "bold",
  padding: 2,
  paddingLeft: 5,
  paddingRight: 5,
  width: 100,
  textAlign: "center",
  //trick to make that outline thing yey
  
  textShadowColor: "black",
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 5,
},

 itemsWrapper: {

  padding: 50,
  width: "100%",
  alignSelf: "center",
 },

 separator: {
    height: 2,           
    width: "100%",       
    backgroundColor: "black", 
    marginVertical: 25  
  },

  bottomRight: {
  backgroundColor: "#E7C60C",
  width: "100%",
  height: 200,  // <- use a fixed height you want
},

  totalWrapper: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    marginVertical: 25

  },

  totalTitle: {
    fontSize: 35,
    fontWeight: "bold"
  },

  totalPrice: {
    fontSize: 45,
    fontWeight: "bold"
  },

  buttonWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  },

  resetButton: {
    backgroundColor: "#D6472E",
    borderRadius: 10,
    width: "35%",
    height: "70%",
    alignItems: "center",
    justifyContent: "center"

  },

  confirmButton: {
    width: "35%",
    height: "70%",
    borderRadius: 10,
    backgroundColor: "#51A015",
    alignItems: "center",
    justifyContent: "center"
  },

  orderedList: {
    flex:1,
  },

  orderedItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 10
  },

  darker: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 10,
    backgroundColor: "#0E577B"
  },

  orderedText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold"
  },

  amountWrapper: {
    flexDirection: "row",
    width: "25%",
    alignItems: "center",
    left: 0,
    justifyContent: "space-between"
  },

  orderedNameWrapper: {
    flex: 1,
    width: "45%",
    alignItems: "center"
  },

  orderedPriceWrapper: {
    width: "25%",
    alignItems: "center",
  },

  controls: {
    width: 35,
    height: 35
  },

  overallWrapper: {
    flex: 1
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backdrop: {
  ...StyleSheet.absoluteFillObject
  },

  filterSelected: {
    fontSize: 27,
    color: "#F2CF10",
    fontWeight: "bold",

    //trick to make that outline thing yey
    textShadowColor: "black",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
    backgroundColor: "#EDEBDE",
    padding: 2,
    paddingLeft: 5,
    paddingRight: 5,
    width: 100,
    textAlign: "center",
    borderRadius: 7,
    borderColor: "black",
    borderWidth: 2
  }

});