import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRoute} from '@react-navigation/native';
const TotalSlabs = (item, width) => {
  let n1 = (width + 0.5) / 1.5;
  let n2 = n1 - Math.floor(n1);
  let x1 = 0;
  let x2 = 0;
  if (n2 !== 0) {
    x1 = Math.round(n1) - 1;
    if (n2.toFixed(2) == 0.33) {
      x2 = 2;
    } else {
      x2 = 1;
    }
  } else {
    x1 = Math.round(n1);
  }
  let price_1 = item.i * item.slab1.price_1 * x1;
  let price_2 = item.i * item.slab1.price_2 * x2;
  let weight_1 = item.i * item.slab1.weight_1 * x1;
  let weight_2 = item.i * item.slab1.weight_2 * x2;
  let weight_3 = 0;
  let weight_4 = 0;
  let price_3 = 0;
  let price_4 = 0;
  if (item.slab2 != null) {
    price_3 = item.j * item.slab2.price_1 * x1;
    price_4 = item.j * item.slab2.price_2 * x2;
    weight_3 = item.j * item.slab2.weight_1 * x1;
    weight_4 = item.j * item.slab2.weight_2 * x2;
  }

  const price = price_1 + price_2 + price_3 + price_4;

  let slab_1_string = SlbString(item.slab1.length);
  let slab_2_string = '';
  if (item.slab2 != null) {
    slab_2_string = SlbString(item.slab2.length);
  }
  return {
    x1: x1,
    x2: x2,
    price: price,
    w_1: weight_1,
    w_2: weight_2,
    w_3: weight_3,
    w_4: weight_4,
    s_weight: weight_1 + weight_2 + weight_3 + weight_4,
    price_1_string: `${slab_1_string} x 1-6 = ${item.i}x${x1} = ${item.i * x1}`,
    price_1: price_1,
    price_2_string: `${slab_1_string} x 1= ${item.i}x${x2} = ${item.i * x2}`,
    price_2: price_2,
    price_3_string: `${slab_2_string} x 1-6 = ${item.j}x${x1} = ${item.j * x1}`,
    price_3: price_3,
    price_4_string: `${slab_2_string} x 1 = ${item.j}x${x2} = ${item.j * x2}`,
    price_4: price_4,
  };
};

const GirdersPrice = (width, walls, girders) => {
  const size = width + 2 * (walls / 12);
  let gPrice = 0;
  let weight = 0;
  let girderCombination = {};
  if (size >= 1 && size <= 14.4) {
    gPrice = size * girders * 390;
    weight = size *girders* 10.3;
    girderCombination = {
      size: '4x9',
      price: 390,
      totalPrice: gPrice,
      totaWeight: weight,
    };
  } else if (size >= 14.5 && size <= 16.9) {
    gPrice = size * girders * 420;
    weight = size *girders*11.5;
    girderCombination = {
      size: '4x10',
      price: 420,
      totalPrice: gPrice,
      totaWeight: weight,
    };
  } else if (size >= 17 && size <= 18.4) {
    gPrice = size * girders * 460;
    weight = size * girders*11.5;
    girderCombination = {
      size: '4x10',
      price: 460,
      totalPrice: gPrice,
      totaWeight: weight,
    };
  } else if (size >= 18.5 && size <= 20.9) {
    gPrice = size * girders * 520;
    weight = size *girders* 16;
    girderCombination = {
      size: '5x12',
      price: 520,
      totalPrice: gPrice,
      totaWeight: weight,
    };
  } else if (size >= 21 && size <= 23.4) {
    gPrice = size * girders * 550;
    weight = size *girders* 16;
    girderCombination = {
      size: '5x12',
      price: 550,
      totalPrice: gPrice,
      totaWeight: weight,
    };
  } else if (size >= 23.5 && size <= 25.4) {
    gPrice = size * girders * 660;
    weight = size *girders* 20;
    girderCombination = {
      size: '5x14',
      price: 660,
      totalPrice: gPrice,
      totaWeight: weight,
    };
  } else {
    gPrice = size * girders * 700;
    weight = size*girders* 20;
    girderCombination = {
      size: '5x14',
      price: 700,
      totalPrice: gPrice,
      totaWeight: weight,
    };
  }
  return girderCombination;
};
const SlbString = slab => {
  const feetPart = Math.floor(slab);
  const inchPart = Math.round((slab - feetPart) * 12);
  return `${feetPart}-${inchPart}`;
};
const Details = () => {
  const route = useRoute();
  const {item, length, width, walls} = route.params;
  const area = (length + 2 * (walls / 12)) * (width + 2 * (walls / 12));
  const x = TotalSlabs(item, width);
  const girdersObj = GirdersPrice(width, walls, item.cells - 1);
  const totalPrice = x.price + girdersObj.totalPrice;
  const weight_lb = x.s_weight + girdersObj.totaWeight;
  const [percentage, setPercentage] = useState('');
  const [hasting, setHasting] = useState('');
  const [rent, setRent] = useState('');
  const [gt, setGt] = useState('');
  const [price_pp, setPrice_PP] = useState(gt / area);
  const [pshow, setPshow] = useState(false);
  useEffect(() => {
    const a = hasting ? parseFloat(hasting) : 0;
    const r = rent ? parseFloat(rent) : 0;
    const b = percentage
      ? totalPrice - (totalPrice * parseFloat(percentage)) / 100
      : totalPrice;
    setGt(a + b + r);
  }, [percentage, hasting, rent]);
  useEffect(() => {
    setPrice_PP(gt / area);
  }, [gt]);
  const toggleCheckbox = () => {
    setPshow(!pshow);
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Percentage</Text>
        <TextInput
          style={styles.input}
          value={percentage}
          onChangeText={text => setPercentage(text)}
          keyboardType="numeric"
          onBlur={() => Keyboard.dismiss()}
        />
        <Text style={styles.label}>Hasting</Text>
        <TextInput
          style={styles.input}
          value={hasting}
          onChangeText={text => setHasting(text)}
          keyboardType="numeric"
          onBlur={() => Keyboard.dismiss()}
        />
        <Text style={styles.label}>Rent</Text>
        <TextInput
          style={styles.input}
          value={rent}
          keyboardType="numeric"
          onChangeText={text => setRent(text)}
          onBlur={() => Keyboard.dismiss()}
        />
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={toggleCheckbox}>
          <Icon
            name={pshow ? 'check-box' : 'crop-square'}
            size={24}
            color={pshow ? 'green' : 'black'}
          />
          <Text style={styles.checkboxLabel}>{pshow?'Hide Price':'Show Price'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <Text style={styles.heading}>Details of Slabs</Text>
        <Text style={styles.text}>
          <Text style={styles.column}>{`Total Cells`}</Text> ={' '}
          <Text style={styles.column}>{`${item.cells}`}</Text>
        </Text>
        <Text style={styles.text}>
          <Text
            style={
              styles.column
            }>{`${item.i} Cells of ${item.slab1.length}`}</Text>{' '}
          ={' '}
          <Text style={styles.column}>{`(${x.x1.toString()}${
            parseFloat(x.x2) > 0 ? ` + ${x.x2.toString()}` : ''
          })`}</Text>
        </Text>
        {item.slab2 && (
          <Text style={styles.text}>
            <Text
              style={
                styles.column
              }>{`${item.j} Cells of ${item.slab2.length}`}</Text>{' '}
            ={' '}
            <Text style={styles.column}>{`(${x.x1.toString()}${
              parseFloat(x.x2) > 0 ? ` + ${x.x2.toString()}` : ''
            })`}</Text>
          </Text>
        )}
        <Text style={styles.text}>
          <Text style={styles.column}>{`No. Of Girders`}</Text> ={' '}
          <Text style={styles.column}>{`${item.cells - 1}`}</Text>
        </Text>
        <Text style={styles.text}>
          <Text style={styles.column}>{`${girdersObj.size}`}</Text> ={' '}
          <Text style={styles.column}>{`${item.cells - 1}*${
            width + 2 * (walls / 12)
          }*${girdersObj.price}`}</Text>{' '}
          {pshow && (
            <Text style={styles.column}>
              = {`${Math.round(girdersObj.totalPrice)} RS`}
            </Text>
          )}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.column}>{`${x.price_1_string}${
            pshow ? ` = ${x.price_1} RS` : ''
          }`}</Text>
        </Text>
        {x.x2 > 0 && (
          <Text style={styles.text}>
            <Text style={styles.column}>{`${x.price_2_string}${
              pshow ? ` = ${x.price_2} RS` : ''
            }`}</Text>
          </Text>
        )}
        {item.slab2 && (
          <Text style={styles.text}>
            <Text style={styles.column}>{`${x.price_3_string}${
              pshow ? ` = ${x.price_3} RS` : ''
            }`}</Text>
          </Text>
        )}
        {item.slab2 && x.x2 > 0 && (
          <Text style={styles.text}>
            <Text style={styles.column}>{`${x.price_4_string}${
              pshow ? ` = ${x.price_4} RS` : ''
            }`}</Text>
          </Text>
        )}
        <Text style={styles.text}>
          <Text style={styles.column}>{`Lengthxwidth`}</Text> ={' '}
          <Text style={styles.column}>{`${length + 2 * (walls / 12)}x${
            width + 2 * (walls / 12)
          }`}</Text>
        </Text>
        {pshow && (
          <>
            <Text style={styles.text}>
              <Text style={styles.column}>{`Total Area`}</Text> ={' '}
              <Text style={styles.column}>{`${area} Sq.ft`}</Text>
            </Text>
            <Text style={styles.text}>
              <Text style={styles.column}>{`Ex.Factory`}</Text> ={' '}
              <Text style={styles.important}>{`${totalPrice} RS`}</Text>
            </Text>
            {percentage ? (
              <Text style={styles.text}>
                <Text style={styles.column}>{percentage}%</Text> ={' '}
                <Text style={styles.important}>{`${
                  Math.round(totalPrice - (totalPrice * parseFloat(percentage)) / 100)
                } RS`}</Text>
              </Text>
            ) : null}
            {hasting ? (
              <Text style={styles.text}>
                <Text style={styles.column}>{`Hasting`}</Text> ={' '}
                <Text style={styles.important}>{`${
                  Math.round(area * parseFloat(hasting))
                } RS`}</Text>
              </Text>
            ) : null}
            {rent ? (
              <Text style={styles.text}>
                <Text style={styles.column}>{`Rent`}</Text> ={' '}
                <Text style={styles.important}>{`${rent} RS`}</Text>
              </Text>
            ) : null}
            <Text style={styles.text}>
              <Text style={styles.column}>{`Total Price`}</Text> ={' '}
              <Text style={styles.important}>{`${Math.round(parseFloat(gt))} RS`}</Text>
            </Text>
            <Text style={styles.text}>
              <Text style={styles.column}>{`Price Per Sq.ft`}</Text> ={' '}
              <Text style={styles.important}>{`${price_pp.toFixed(
                2,
              )} RS`}</Text>
            </Text>
          </>
        )}
        <Text style={styles.text}>
          <Text style={styles.column}>{`Material weight`}</Text> ={' '}
          <Text style={styles.column}>{`${weight_lb} kg = ${(
            weight_lb / 1000
          ).toFixed(2)} ton`}</Text>
        </Text>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Adjust background color as needed
    padding: 20,
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'green',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    padding: 20,
    width: '100%', // Adjust the width as needed
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
  },
  important: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold', // Make labels bold
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#ffffff', // White background for inputs
  },
  column: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    textAlign: 'right',
    fontSize: 16, // Adjust font size as needed
    paddingRight: 5, // Add padding to separate the columns
  },
});
export default Details;
