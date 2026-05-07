import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { theme } from '../theme/theme';
import { useAuthStore } from '../store/authStore';

export const LoginScreen = ({ route, navigation }: any) => {
  const mode = route.params?.mode || 'user'; // 'user' or 'admin'
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      await login({ email, password });
      // RootNavigator will automatically redirect on auth state change
    } catch (e: any) {
      Alert.alert('Login Failed', e.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.content}>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>TaskFortress</Text>
            <Text style={styles.subtitle}>
              {mode === 'admin' ? 'Admin Access\nYour workspace.' : 'Access or Create\nYour workspace.'}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Email" 
                placeholderTextColor={theme.colors.textSecondary} 
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Password" 
                secureTextEntry 
                placeholderTextColor={theme.colors.textSecondary} 
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.btnText}>Continue</Text>
              )}
            </TouchableOpacity>

            {mode !== 'admin' && (
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.linkBtn}>
                <Text style={styles.linkText}>Sign up for a new account.</Text>
              </TouchableOpacity>
            )}
          </View>

        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

// SignUpScreen utilizes identical styles, just with an added Email input.
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  keyboardView: { flex: 1 },
  content: { flex: 1, paddingHorizontal: theme.spacing.l, justifyContent: 'center' },
  titleContainer: { marginBottom: theme.spacing.xxl },
  title: { fontFamily: theme.typography.fontFamily.heading, fontSize: 32, color: theme.colors.textPrimary, marginBottom: 16 },
  subtitle: { fontFamily: theme.typography.fontFamily.body, fontSize: 24, color: theme.colors.textSecondary, lineHeight: 32 },
  form: { gap: 16 },
  inputGroup: {},
  label: { fontFamily: theme.typography.fontFamily.body, fontSize: 12, color: theme.colors.textSecondary, marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: theme.colors.surfaceLight, borderRadius: 16, padding: 16, color: theme.colors.textPrimary, fontFamily: theme.typography.fontFamily.body },
  primaryBtn: { backgroundColor: theme.colors.primary, borderRadius: 16, padding: 18, alignItems: 'center', marginTop: 16 },
  btnText: { color: '#000', fontFamily: theme.typography.fontFamily.heading, fontSize: 16 },
  linkBtn: { alignItems: 'center', marginTop: 16 },
  linkText: { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.body, fontSize: 14 },
});