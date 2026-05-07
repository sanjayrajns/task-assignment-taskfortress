import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { theme } from '../theme/theme';
import { useAuthStore } from '../store/authStore';

export const SignUpScreen = ({ navigation }: any) => {
  const { register } = useAuthStore();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !name) return;
    setLoading(true);
    try {
      await register({ email, password, name, role: 'USER' });
      // RootNavigator redirects automatically
    } catch (e: any) {
      Alert.alert('Sign Up Failed', e.response?.data?.message || 'Unable to create account');
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
            <Text style={styles.subtitle}>Create a new{'\n'}workspace.</Text>
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
              <Text style={styles.label}>Name</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Full Name" 
                placeholderTextColor={theme.colors.textSecondary} 
                value={name}
                onChangeText={setName}
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

            <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister} disabled={loading}>
              {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>Sign Up</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkBtn}>
              <Text style={styles.linkText}>Already have an account? Log in.</Text>
            </TouchableOpacity>
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