import { Image, StyleSheet, Text, View } from "react-native";
import { AppButton } from "@/components/AppButton";

export function NativeGradientScreen() {
    return (
        <View style={styles.screen}>
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
                <Image source={require('@assets/images/basketball-on-fire.png')} style={{ width: 610, height: 1200 }} />
            </View>

            <AppButton
                title="Css gradients"
                onPress={() => { }}
                loading={false}
                style={{
                    margin: 12,
                    backgroundImage: 'linear-gradient(to right, #F09819, #FF512F)',
                    borderColor: 'white',
                    borderWidth: 2,
                }}
            />

            <AppButton
                title="Sign In"
                onPress={() => { }}
                loading={false}
                style={{
                    margin: 12,
                    backgroundImage: 'radial-gradient(ellipse farthest-corner at 50% 50%, #11998E, #38EF7D)',
                    borderColor: 'white',
                    borderWidth: 2,
                }}
            />

            <View style={{
                minHeight: 56,
                borderRadius: 8,
                backgroundImage: 'linear-gradient(to right, #F09819, #FF512F)',
                margin: 12,
            }}>
                <View style={{
                    minHeight: 48,
                    borderRadius: 6,
                    backgroundColor: 'white',
                    margin: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                }}>
                    <Text>Title</Text>
                </View>
            </View>


            <View style={{
                minHeight: 300,
                backgroundImage: 'linear-gradient(to top, #FF512F, #F09819, #f8cc5cff, #f8cc5c36, #f8cc5c00)',
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0
            }}>

            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundImage: "linear-gradient(to right, #4FACFE, #00F2FE)",
    },
    content: {
        flex: 1,
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
    gradientContainer: {
        backgroundImage: "linear-gradient(to right, #4FACFE, #00F2FE)",
    },
});
