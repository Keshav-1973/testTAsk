import * as React from 'react';
import { ActivityIndicator, TouchableOpacity, View, Text } from 'react-native';


type Props = {
    onPress?: () => void;
    title: string;
    loading?: boolean;
    loadingTitle?: string;
    disabled?: boolean;
    customStyles?: {};
};

const CustomButton = ({
    onPress,
    title,
    loading,
    loadingTitle,
    disabled,
    customStyles,
}: Props) => {
    return (
        <TouchableOpacity onPress={onPress} style={{ ...customStyles }} disabled={disabled || loading}>
            <View style={{
                backgroundColor: "#767af5",
                justifyContent: "center",
                alignItems: "center",
                height: 50,
                paddingHorizontal: 100,
                marginVertical: 10,
                borderRadius: 10,
                flexDirection: "row",
            }}
            >
                {loading && (
                    <ActivityIndicator
                        color={"red"}
                    />
                )}

                <Text style={{ color: "white", fontFamily: "Montserrat-SemiBold", fontSize: 15 }}
                >
                    {loading ? loadingTitle || '  PROCESSING...' : title}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default CustomButton;