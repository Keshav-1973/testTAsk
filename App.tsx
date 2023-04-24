import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import DropDownPicker from 'react-native-dropdown-picker';
import DataModel1 from "./DataModel1.json"
import DataModel2 from "./DataModel2.json"
import InputField from './src/components/InputField';
import { sha256, sha256Bytes } from 'react-native-sha256';
import CustomButton from './src/components/CustomButton';




interface ArrayTypes {
  label: string,
  type: string,
  readOnly: boolean,
  calculate: null
}


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(DataModel1);
  const [items, setItems] = useState([
    { label: DataModel1.name, value: DataModel1 },
    { label: DataModel2.name, value: DataModel2 },
  ]);
  const [output, setOutput] = useState({
    SHA256: "",
    Mean: 0,
    Median: 0,
    Standard_Deviation: 0,
  })
  const [string, setString] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "",
    9: ""
  });


  const [array, setArray] = useState<ArrayTypes[]>([]);
  let arr: ArrayTypes[] = []
  useEffect(() => {
    for (const property in value.fields) {
      arr.push(value.fields[property])
    }
    setArray(arr);
  }, [value])



  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  const calculate = async (data: string) => {
    let numbers = []
    const mean = (numbers: any[]) => numbers.reduce((p, c) => p + c, 0) / numbers.length;
    let meanResult: number
    if (data === "SHA256") {
      const hashOne = await sha256(string[0]);
      const hashTwo = await sha256(string[1]);
      const hashfinal = await sha256(hashOne + hashTwo);
      setOutput({
        ...output,
        SHA256: hashfinal
      })
    }
    else if (data === "Mean" || "Median" || "Standard_Deviation") {

      for (var element in string) {
        numbers.push(string[element]);
      }

      if (data === "Mean") {
        meanResult = mean(numbers)
        setOutput({
          ...output,
          Mean: meanResult
        })
      }
      else if (data === "Median") {
        const sorted = Array.from(numbers).sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
          const data = (sorted[middle - 1] + sorted[middle]) / 2;
          setOutput({
            ...output,
            Median: data
          })
        }
        setOutput({
          ...output,
          Median: sorted[middle]
        })
      } else if (data === "Standard_Deviation") {
        let data
        if (meanResult) {
          data = numbers.reduce((s, n) => s + (n - meanResult) ** 2, 0) / (numbers.length - 1);
        } else {
          meanResult = meanResult = mean(numbers)
          data = numbers.reduce((s, n) => s + (n - meanResult) ** 2, 0) / (numbers.length - 1);
        }
        setOutput({
          ...output,
          Standard_Deviation: data
        })
      }
    }
  }



  const uiTwo = () => {
    return (
      <View style={{ flex: 1, backgroundColor: "white", width: "90%", alignSelf: "center", marginVertical: 20 }}>
        {array.length ? array.map((elem, ind) => {
          return (
            <View key={elem.label}>
              {!elem.readOnly && <InputField
                label={elem.label}
                placeholder={elem.label}
                onChange={(value) => {
                  setString({
                    ...string,
                    [ind]: elem.type === "int" ? Number(value) : value
                  });
                }}
                keyboardType={elem.type === "int" ? "number-pad" : "default"}
              />}
              {elem.calculate &&
                <View style={{ marginTop: 10 }}>
                  <CustomButton
                    title={elem.label}
                    onPress={() => { calculate(elem.label) }} />
                  <Text
                    style={{
                      color: "black",
                      fontSize: 15
                    }}>
                    {elem.label} Result: {output[elem.label]}
                  </Text>
                </View>
              }
            </View>
          );
        }) : null}
      </View>
    );
  }





  return (
    <SafeAreaView style={[{
      flex: 1,
      // justifyContent: "center"
    }, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ zIndex: 12, width: "95%", alignSelf: "center", marginVertical: 20 }}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
          />
        </View>
        {uiTwo()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
