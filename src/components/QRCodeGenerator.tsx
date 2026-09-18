import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { createQRPayload } from "@/services/qrCodeService";


export function QRCodeGenerator({ value, size, color, backgroundColor, containerStyles, ...rest }) {
    return (
        <View style={containerStyles}>
            <QRCode
                value={createQRPayload(value) || ' '}
                size={size}
                color={color}
                backgroundColor={backgroundColor}
                { ...rest }
            />
        </View>
    );
}
