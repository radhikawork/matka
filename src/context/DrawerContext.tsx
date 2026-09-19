import React, { createContext, useContext, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { CustomDrawerContent } from '../components/drawer/CustomDrawerContent';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.78;

interface DrawerContextType {
  openDrawer: () => void;
  closeDrawer: () => void;
  isDrawerOpen: boolean;
}

const DrawerContext = createContext<DrawerContextType>({
  openDrawer: () => {},
  closeDrawer: () => {},
  isDrawerOpen: false,
});

export const useDrawer = () => useContext(DrawerContext);

interface DrawerProviderProps {
  children: React.ReactNode;
  navigationRef: any;
}

export const DrawerProvider: React.FC<DrawerProviderProps> = ({
  children,
  navigationRef,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const openDrawer = () => {
    setIsOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsOpen(false);
    });
  };

  const drawerNavigation = {
    navigate: (screen: string, params?: any) => {
      closeDrawer();
      if (navigationRef.current) {
        navigationRef.current.navigate(screen, params);
      }
    },
    reset: (state: any) => {
      closeDrawer();
      if (navigationRef.current) {
        navigationRef.current.reset(state);
      }
    },
  };

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer, isDrawerOpen: isOpen }}>
      {children}
      {isOpen && (
        <Modal
          transparent
          visible={isOpen}
          animationType="none"
          onRequestClose={closeDrawer}>
          <View style={styles.overlayContainer}>
            {/* Backdrop */}
            <TouchableWithoutFeedback onPress={closeDrawer}>
              <Animated.View
                style={[
                  styles.backdrop,
                  {
                    opacity: opacityAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.6],
                    }),
                  },
                ]}
              />
            </TouchableWithoutFeedback>

            {/* Slide-in Drawer Container */}
            <Animated.View
              style={[
                styles.drawerPanel,
                {
                  transform: [{ translateX: slideAnim }],
                },
              ]}>
              <CustomDrawerContent navigation={drawerNavigation} />
            </Animated.View>
          </View>
        </Modal>
      )}
    </DrawerContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
  },
  drawerPanel: {
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: '#ffffff',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
