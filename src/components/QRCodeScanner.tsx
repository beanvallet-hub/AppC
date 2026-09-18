import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'react-native-camera-kit';
import { parseQRPayload } from '@/services/qrCodeService';
import { useCameraPermission } from '@/hooks/useCameraPermission';

export const QRCodeScanner = ({ onQRScanned, showInstructions, isActive }) => {
    const {
        granted,
        denied,
        blocked,
        unavailable,
        loading,
        requestPermission,
        openPermissionSettings
    } = useCameraPermission();

    const [isScanning, setIsScanning] = useState(isActive);

    useEffect(() => {
        if (denied) {
            requestPermission();
        }
    }, [denied, requestPermission]);

    useEffect(() => {
        setIsScanning(isActive);
    }, [isActive]);


    const handleReadCode = (event) => {
        if (!isScanning) {
            return;
        }

        const qrCode = event.nativeEvent.codeStringValue;

        if (!qrCode) {
            return;
        }

        const value = parseQRPayload(qrCode);

        if (!value) {
            Alert.alert('Invalid QR Code value');

            return;
        }

        // Stop processing additional detections.
        // setIsScanning(false);

        onQRScanned(value);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Checking camera permission...</Text>
            </View>
        );
    }

    if (unavailable) {
        return (
            <View style={styles.center}>
                <Text>Camera is not available on this device.</Text>
            </View>
        );
    }

    if (blocked) {
        return (
            <View style={styles.center}>
                <Text>
                    Camera permission has been blocked. Please enable it in Settings.
                </Text>

                <Button title='Open settings' onPress={() => openPermissionSettings()} />
            </View>
        );
    }

    if (!granted) {
        return (
            <View style={styles.center}>
                <Text>Camera permission is required to scan QR codes.</Text>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <Camera
                style={StyleSheet.absoluteFill}
                scanBarcode={true}
                showFrame={false}
                barcodeFrameSize={{ width: 200, height: 200 }}
                onReadCode={handleReadCode}
                allowedBarcodeTypes={['qr']}
            />

            <View style={styles.overlay}>
                {isScanning && <View style={styles.scanBox} />}

                {isScanning && showInstructions && <Text style={styles.instruction}>
                    Point your camera at a QR code
                </Text>}
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },

    permissionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },

    permissionText: {
        textAlign: 'center',
        fontSize: 16,
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

    scanBox: {
        width: 200,
        height: 200,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 16,
    },

    instruction: {
        marginTop: 30,
        color: 'white',
        fontSize: 16,
    },

    resultContainer: {
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 40,
        padding: 20,
        borderRadius: 12,
        backgroundColor: 'white',
    },

    resultTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },

    resultValue: {
        fontSize: 16,
    },

    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
});
