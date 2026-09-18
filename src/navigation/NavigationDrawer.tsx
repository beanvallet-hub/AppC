import { useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



function NavItem({ screen, title, onPress }) {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate(screen);

        setImmediate(() => {
            onPress();
        });
    }

    return (
        <View style={{ paddingLeft: 32, paddingRight: 16, paddingVertical: 12 }}>
            <TouchableOpacity style={{ paddingLeft: 4, paddingRight: 4, paddingVertical: 12 }} onPress={handlePress}>
                <Text style={{ fontSize: 16 }}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}


export function DrawerList({ onPressListItem }) {
    return (
        <ScrollView>
            <NavItem onPress={onPressListItem} screen={'MainTabs'} title={'Home'} />
            <NavItem onPress={onPressListItem} screen={'QR Generator'} title={'QR Generator'} />
            <NavItem onPress={onPressListItem} screen={'QR Scanner'} title={'QR Scanner'} />
            <NavItem onPress={onPressListItem} screen={'Gradient Showcase'} title={'Gradient Showcase'} />
            <NavItem onPress={onPressListItem} screen={'Native Gradient'} title={'Native Gradient'} />
            <NavItem onPress={onPressListItem} screen={'Animations'} title={'Animations'} />
        </ScrollView>
    )
}



export function NavigationDrawer({ children }: React.PropsWithChildren) {
    const [open, setOpen] = useState(false);
    const safeAreaInsets = useSafeAreaInsets();

    const contentPlatformStyle = Platform.select({
        android: {
            paddingTop: safeAreaInsets.top,
            paddingLeft: safeAreaInsets.left,
            paddingRight: safeAreaInsets.right,
            paddingBottom: 0,
        },
        web: {
            paddingTop: 24,
            paddingBottom: 16,
        },
    });

    const NavList = useCallback(() => {
        return <DrawerList onPressListItem={() => {
            setOpen(false);
        }} />
    }, [setOpen]);

    return (
        <Drawer
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            renderDrawerContent={NavList}
            style={[{ backgroundColor: 'black' }, contentPlatformStyle]}
        >
            {children}
        </Drawer>
    );
}
