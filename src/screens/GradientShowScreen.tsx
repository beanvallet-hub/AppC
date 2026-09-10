import { Image, StyleSheet, Text, View } from "react-native";
import { GradientView } from "../components/GradientView";
import { gradients } from "../theme/gradients";
import { GradientButton } from "../components/GradientButton";
import { RadialGradientButton } from "../components/RadialGradientButton";

export function GradientShowScreen() {
    return (
        <View style={styles.screen}>
            <GradientView colors={gradients.blue.colors} style={styles.content}>

                <View style={styles.content}>
                    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
                        <Image source={require('../../assets/images/basketball-on-fire.png')} style={{ width: 610, height: 1200 }} />
                    </View>


                    <View style={{ padding: 12 }}>
                        <GradientButton
                            title="Login"
                            colors={gradients.sunset.colors}
                            onPress={() => {

                            }}
                            direction="rightToLeft"
                        />
                    </View>

                    <View style={{ padding: 12 }}>
                        <RadialGradientButton
                            title="Sign In"
                            colors={gradients.success.colors}
                            
                            onPress={() => {
                            }}
                            direction="rightToLeft"
                        />
                    </View>
                </View>
            </GradientView>
        </View>
    );
}


const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    content: {
        flex: 1,
    }
});
