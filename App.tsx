import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { ForgotPasswordScreen } from './screens/ForgotPasswordScreen';
import { MapScreen } from './screens/MapScreen';
import { MyPlanScreen } from './screens/MyPlanScreen';
import { ChoosePlanScreen } from './screens/ChoosePlanScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { MyPaymentsScreen } from './screens/MyPaymentsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { TripHistoryScreen } from './screens/TripHistoryScreen';
import { SupportScreen } from './screens/SupportScreen';
import { ChatScreen } from './screens/ChatScreen';
import { HelpScreen } from './screens/HelpScreen';
import { Sidebar } from './components/Sidebar';
import { commonStyles } from './styles/commonStyles';

type Screen = 'login' | 'register' | 'forgotPassword' | 'map' | 'myPlan' | 'choosePlan' | 'payment' | 'myPayments' | 'profile' | 'tripHistory' | 'support' | 'chat' | 'help';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [chatConversationId, setChatConversationId] = useState<string | undefined>(undefined);

  const navigateToLogin = () => {
    console.log('Navigating to login');
    setCurrentScreen('login');
  };
  const navigateToRegister = () => {
    console.log('Navigating to register');
    setCurrentScreen('register');
  };
  const navigateToForgotPassword = () => {
    console.log('Navigating to forgot password');
    setCurrentScreen('forgotPassword');
  };
  const navigateToMap = () => {
    console.log('Navigating to map');
    setCurrentScreen('map');
  };
  const navigateToMyPlan = () => {
    console.log('Navigating to my plan');
    setCurrentScreen('myPlan');
  };
  const navigateToChoosePlan = () => {
    console.log('Navigating to choose plan');
    setCurrentScreen('choosePlan');
  };
  const navigateToPayment = (plan: any) => {
    console.log('Navigating to payment');
    setSelectedPlan(plan);
    setCurrentScreen('payment');
  };
  const navigateToMyPayments = () => {
    console.log('Navigating to my payments');
    setCurrentScreen('myPayments');
  };
  const navigateToProfile = () => {
    console.log('Navigating to profile');
    setCurrentScreen('profile');
  };
  const navigateToTripHistory = () => {
    console.log('Navigating to trip history');
    setCurrentScreen('tripHistory');
  };
  const navigateToSupport = () => {
    console.log('Navigating to support');
    setCurrentScreen('support');
  };
  const navigateToChat = (conversationId?: string) => {
    console.log('Navigating to chat', conversationId);
    setChatConversationId(conversationId);
    setCurrentScreen('chat');
  };
  const navigateToHelp = () => {
    console.log('Navigating to help');
    setCurrentScreen('help');
  };

  const openSidebar = () => setSidebarVisible(true);
  const closeSidebar = () => setSidebarVisible(false);

  const handlePaymentSuccess = (cardData: any) => {
    console.log('Payment successful', cardData);
    navigateToMap();
  };

  return (
    <>
      {currentScreen === 'map' ? (
        <>
          <MapScreen onOpenSidebar={openSidebar} />
          <Sidebar
            visible={sidebarVisible}
            onClose={closeSidebar}
            onNavigateToLogin={navigateToLogin}
            onNavigateToMyPlan={navigateToMyPlan}
            onNavigateToMyPayments={navigateToMyPayments}
            onNavigateToProfile={navigateToProfile}
            onNavigateToTripHistory={navigateToTripHistory}
            onNavigateToSupport={navigateToSupport}
            onNavigateToHelp={navigateToHelp}
          />
        </>
      ) : currentScreen === 'myPlan' ? (
        <MyPlanScreen
          onNavigateToChoosePlan={navigateToChoosePlan}
          onNavigateBack={navigateToMap}
        />
      ) : currentScreen === 'choosePlan' ? (
        <ChoosePlanScreen
          onNavigateToPayment={navigateToPayment}
          onNavigateBack={navigateToMyPlan}
        />
      ) : currentScreen === 'payment' ? (
        <PaymentScreen
          plan={selectedPlan}
          onNavigateBack={navigateToChoosePlan}
          onPaymentSuccess={handlePaymentSuccess}
        />
      ) : currentScreen === 'myPayments' ? (
        <MyPaymentsScreen
          onNavigateBack={navigateToMap}
        />
      ) : currentScreen === 'profile' ? (
        <ProfileScreen
          onNavigateBack={navigateToMap}
        />
      ) : currentScreen === 'tripHistory' ? (
        <TripHistoryScreen
          onNavigateBack={navigateToMap}
        />
      ) : currentScreen === 'support' ? (
        <SupportScreen
          onNavigateBack={navigateToMap}
          onOpenChat={navigateToChat}
        />
      ) : currentScreen === 'chat' ? (
        <ChatScreen
          conversationId={chatConversationId}
          onNavigateBack={navigateToSupport}
        />
      ) : currentScreen === 'help' ? (
        <HelpScreen
          onNavigateBack={navigateToMap}
        />
      ) : (
        <SafeAreaView style={commonStyles.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={commonStyles.keyboardAvoidingView}
          >
            {currentScreen === 'login' && (
              <LoginScreen
                onNavigateToRegister={navigateToRegister}
                onNavigateToForgotPassword={navigateToForgotPassword}
                onNavigateToMap={navigateToMap}
              />
            )}
            {currentScreen === 'register' && (
              <RegisterScreen onNavigateToLogin={navigateToLogin} />
            )}
            {currentScreen === 'forgotPassword' && (
              <ForgotPasswordScreen onNavigateToLogin={navigateToLogin} />
            )}
          </KeyboardAvoidingView>
          <StatusBar style="dark" />
        </SafeAreaView>
      )}
    </>
  );
}
