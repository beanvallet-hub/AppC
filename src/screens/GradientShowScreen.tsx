import { Image, StyleSheet, Text, View } from "react-native";
import { SvgGradientView } from "@/components/SvgGradientView";
import { SvgGradientButton } from "@/components/SvgGradientButton";
import { RadialGradientButton } from "@/components/RadialGradientButton";
import { useAppTheme } from "@/theme";

export function GradientShowScreen() {
    const theme = useAppTheme();

    return (
        <View style={styles.screen}>
            <SvgGradientView colors={theme.gradients.blue.colors} style={styles.content}>

                <View style={styles.content}>
                    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
                        <Image source={require('@assets/images/basketball-on-fire.png')} style={{ width: 610, height: 1200 }} />
                    </View>


                    <View style={{ padding: 12 }}>
                        <SvgGradientButton
                            title="Login"
                            colors={theme.gradients.sunset.colors}
                            onPress={() => {

                            }}
                            direction="rightToLeft"
                        />
                    </View>

                    <View style={{ padding: 12 }}>
                        <RadialGradientButton
                            title="Sign In"
                            colors={theme.gradients.success.colors}

                            onPress={() => {
                            }}
                        />
                    </View>
                </View>
            </SvgGradientView>
        </View>
    );
}


const styles = StyleSheet.create({
    screen: {
        flex: 1,
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
});
