import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import itemsList from "./ItemsList"

export default function History({setState}){
    const [history, setHistory] = useState([]);
    const [showSummary, setShowSummary] = useState(false);
    useEffect(()=>{
        async function loadHistory(){
            const history = await readData();
            setHistory(history);
        }

        loadHistory();
    },[])

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

    if(showSummary){
        let itemData = {};
        let extractedItems = {}

        history.forEach((order)=>{
            order.items.forEach((item)=>{
                if(extractedItems[item.name] == undefined){
                    extractedItems[item.name] = { name: item.name, amount: item.amount };
                }else{
                    extractedItems[item.name].amount +=  item.amount
                }
            })
        })

        itemsList.forEach((item)=>{
            itemData[item.name] = {name: item.name, amount: extractedItems[item.name]?.amount || 0};
        })
        
    
        
        return(
            <View style={styles.wrapper}>
                <View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
                    <TouchableOpacity onPress={()=>setShowSummary(false)}>
                        <Text style={{fontSize:30, fontWeight: "bold", color: "white"}}>Back</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.historyWrapper}>
                    {Object.values(itemData).map((item, index) => (
                    <View key={index} style={index % 2 !== 0 ? styles.historyItem : styles.darker}>
                        <Text style={styles.itemContent}>{item.name}</Text>
                        <Text style={styles.itemContent}>{item.amount}</Text>
                    </View>
                )   )}
                </ScrollView>
            </View>
        )
    }

    if(!showSummary){
    return(
        <View style={styles.wrapper}>

            <View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
                <TouchableOpacity onPress={()=>setShowSummary("true")}>
                    <Text style={{fontSize:30, fontWeight: "bold", color: "white"}}>Summary</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>setState("home")}>
                    <Text style={{fontSize:30, fontWeight: "bold", color: "white"}}>Go Back</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={async ()=> {await AsyncStorage.clear(); setHistory([])}}>
                    <Text style={{fontSize:30, fontWeight: "bold", color: "white"}}>Clear History</Text>
                </TouchableOpacity>
            </View>
            

            <ScrollView style={styles.historyWrapper}>
                {
                    history.map((order, index)=>{
                        return order.items.map((item, i)=>{
                
                            return(
                                <View style={ (index) % 2 !== 0 ? styles.historyItem : styles.darker}>
                                    <Text style={styles.itemContent}>{order.date}</Text>
                                    <Text style={styles.itemContent}>{item.name}</Text>
                                    <Text style={styles.itemContent}>Amount: {item.amount}</Text>
                                    <Text style={styles.itemContent}>Total Price: {item.price * item.amount}</Text>
                                </View>
                            )
                        })
                    })
                }
            </ScrollView>
        </View>
    )}
}

const styles = StyleSheet.create({
    wrapper: {
        padding: 65,
        backgroundColor: "#136E9B",
        flex: 1
    },

    historyWrapper: {
        marginTop: 25,
        flex: 1,
    },

    item: {
        width: "100%",
        height: 50
    },

    historyItem: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        padding: 15,
    },

    darker: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        padding: 15,
        backgroundColor: "#072B3D"
    },

    itemContent: {
        fontSize: 30,
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
        width: "25%",

    }
})