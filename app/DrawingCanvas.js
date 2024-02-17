import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { BackHandler,ToastAndroid, View, Text, TextInput, Button, StyleSheet, Alert,FlatList, Keyboard } from 'react-native';
import Toast from 'react-native-toast-message';
import { TouchableOpacity } from 'react-native';
import { AllCombinations, GetGrider, GetLCI } from './helper';
import RadioForm,{RadioButton,RadioButtonInput,RadioButtonLabel} from 'react-native-simple-radio-button';
const DrawingCanvas = () => {
  const [data, setData] = useState([]);
  const [inputSize, setInputSize] = useState('');
  const [width, setWidth] = useState('');
  const [isListVisible, setIsListVisible] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [wallSize, setWallSize] = useState(9);

  const backPressRef = useRef(0);

  useEffect(() => {
    const backPress = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => backPress.remove();
  }, []);

  const handleBackPress = () => {
    backPressRef.current += 1;
    if (backPressRef.current === 2) {
      BackHandler.exitApp();
    } else {
      ToastAndroid.showWithGravity("Press back again to exit",ToastAndroid.SHORT,ToastAndroid.CENTER);
    }
    setTimeout(() => {
      backPressRef.current = 0;
    }, 2000);
    return true;
  };

  const handleCalculateList = () => {
    const Size = parseFloat(inputSize);
    const Width = parseFloat(width);
    if (!isNaN(Size) && !isNaN(Width)) {
      if (Size <= 0 || Width <= 0) {
        Alert.alert('Set sizes greater than 0');
      } else {
        const combinations = AllCombinations(Size + 0.5);
        setData(combinations);
        setTotalItems(combinations.length);
        setIsListVisible(true);
      }
    } else {
      setIsListVisible(false);
    }
  };

  const renderItem = ({ item }) => {
    const girder = GetGrider(width, wallSize, item.cells - 1);
    const w2 = parseFloat(width) + 2 * (wallSize / 12);
    const LCI = GetLCI(girder.size, w2, item.slab1.length);
    const optimal = LCI >= 89;
    return (
      <TouchableOpacity onPress={() => handlePress(item)}>
        <View
          style={{
            ...styles.listItem,
            ...(optimal ? styles.greenBox : styles.redBox),
          }}>
          <Text style={styles.text}>{`${item.i}*${item.slab1.length}${
            item.slab2 ? `+${item.j}*${item.slab2.length}` : ''
          }`}</Text>
          <Text style={styles.text}>{`Total = ${~~item.sum} ft ${Math.ceil(
            (item.sum - Math.floor(item.sum)) * 12,
          )} inch`}</Text>
          <Text style={styles.text}>{`Cells = ${item.cells}`}</Text>
          <Text style={styles.text}>{`LCI = ${LCI}`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handlePress = (item) => {
    const w = parseFloat(width);
    const l = parseFloat(inputSize);
    navigation.navigate('Details', {
      item,
      length: l,
      width: w,
      walls: wallSize,
    });
  };

  const handleBlur = (text) => {
    if (text.trim() == '') {
      setIsListVisible(false);
      Keyboard.dismiss();
    }
  };

  const navigation = useNavigation();

  const radioOptions = [
    {
      label: '9 inch',
      value: 9,
    },
    {
      label: '6 inch',
      value: 6,
    },
    {
      label: '1 foot',
      value: 12,
    },
  ];

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Length"
        keyboardType="numeric"
        value={inputSize}
        onChangeText={(text) => setInputSize(text)}
        onBlur={() => handleBlur(inputSize)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Width"
        keyboardType="numeric"
        value={width}
        onChangeText={(text) => setWidth(text)}
        onBlur={() => handleBlur(width)}
      />
      <Text style={{ fontSize: 20, color: '#000', marginBottom: 10, marginTop: 10 }}>
        Wall Size
      </Text>
      <RadioForm formHorizontal={true} animation={true} style={{ marginBottom: 10 }}>
        {radioOptions.map((obj, i) => (
          <RadioButton labelHorizontal={true} key={i}>
            <RadioButtonInput
              obj={obj}
              index={i}
              isSelected={wallSize === obj.value}
              onPress={() => setWallSize(obj.value)}
              borderWidth={1}
              buttonInnerColor={'#e74c3c'}
              buttonOuterColor={wallSize === obj.value ? '#2196F3' : '#000'}
              buttonSize={15}
              buttonOuterSize={25}
              buttonStyle={{}}
              buttonWrapStyle={{ marginLeft: 10 }}
            />
            <RadioButtonLabel
              obj={obj}
              index={i}
              labelHorizontal={true}
              onPress={() => setWallSize(obj.value)}
              labelStyle={{ fontSize: 20, color: '#000' }}
              labelWrapStyle={{}}
            />
          </RadioButton>
        ))}
      </RadioForm>
      <Button title="Calculate List" onPress={handleCalculateList} />
      {isListVisible && (
        <View style={{ marginTop: 10, marginBottom: 50 }}>
          <Text>Total Items: {totalItems}</Text>
          <FlatList 
            contentContainerStyle={styles.flatList}
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
    width: '100%',
    top: 50,
    paddingBottom: 200, // Adjust this value according to your content height
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  flatList: {
    width: '100%',
    marginTop: 10,
    paddingBottom:50,
  },
  listItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
  },
  greenBox: {
    backgroundColor: '#4caf50',
  },
  redBox: {
    backgroundColor: '#f44336',
  },
  text: {
    color: "white"
  }
});

export default DrawingCanvas;
