import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Eye, EyeOff, Mail, Lock, User, ChevronLeft } from "lucide-react-native";
import { useMutation } from "@apollo/client";
import { GENERATE_CUSTOMER_TOKEN, CREATE_CUSTOMER, FORGOT_PASSWORD } from "../services/queries";
import { useDispatch } from "react-redux";
import { setUser, setLoading, setError } from "./slices/authSlice";

type Screen = "landing" | "login" | "signup";

export default function LoginSignupPage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();

  const [generateToken, { loading: loginLoading }] = useMutation(GENERATE_CUSTOMER_TOKEN);
  const [createCustomer, { loading: signupLoading }] = useMutation(CREATE_CUSTOMER);
  const [forgotPassword] = useMutation(FORGOT_PASSWORD);

  const handleInputChange = (field: keyof typeof formData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleLogin = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const { data } = await generateToken({ variables: { email: formData.email, password: formData.password } });
      const token: string | undefined = data?.generateCustomerToken?.token;
      if (!token) throw new Error("No token returned");
      dispatch(
        setUser({
          user: { id: "self", name: formData.username || formData.email, email: formData.email || "" },
          token,
        })
      );
    } catch (e: any) {
      dispatch(setError(e?.message || "Login failed"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      dispatch(setError("Passwords do not match"));
      return;
    }
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      await createCustomer({ variables: { email: formData.email, password: formData.password } });
      setCurrentScreen("login");
    } catch (e: any) {
      dispatch(setError(e?.message || "Signup failed"));
    } finally {
      dispatch(setLoading(false));
    }
  };
  const handleSocialLogin = (provider: string) =>
    console.log(`${provider} login initiated`);

  // ================== LANDING ==================
  if (currentScreen === "landing") {
    return (
      <View style={styles.landingContainer}>
        <View style={styles.landingLeft}>
          <View style={styles.landingLeftOverlay} />
          <View style={styles.centerContent}>
            <Text style={styles.emoji}>🥗</Text>
            <Text style={styles.landingTitle}>Title Here</Text>
            <Text style={styles.landingSubtitle}>
              Find and order high quality fruits & vegetables
            </Text>
          </View>
        </View>

        <View style={styles.landingRight}>
          <TouchableOpacity
            onPress={() => setCurrentScreen("login")}
            style={[styles.button, styles.buttonWhite]}
          >
            <Text style={[styles.buttonText, styles.textGreen]}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCurrentScreen("signup")}
            style={[styles.button, styles.buttonGreen]}
          >
            <Text style={[styles.buttonText, styles.textWhite]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ================== LOGIN ==================
  if (currentScreen === "login") {
    return (
      <SafeAreaView style={styles.screenContainer} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => setCurrentScreen("landing")}
              style={styles.backButton}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              activeOpacity={0.7}
            >
              <ChevronLeft color="#fff" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Log In</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setCurrentScreen("signup")}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            activeOpacity={0.7}
            style={styles.headerLinkButton}
          >
            <Text style={styles.headerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <ScrollView contentContainerStyle={styles.formContainer}>
          {/* Username */}
          <Text style={styles.label}>Username</Text>
          <View style={styles.inputWrapper}>
            <User size={20} color="#999" style={styles.iconLeft} />
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              value={formData.username}
              onChangeText={(v) => handleInputChange("username", v)}
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#999" style={styles.iconLeft} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(v) => handleInputChange("password", v)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconRight}>
              {showPassword ? <EyeOff size={20} color="#777" /> : <Eye size={20} color="#777" />}
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotContainer}
            onPress={async () => {
              if (formData.email) {
                try {
                  await forgotPassword({ variables: { email: formData.email } });
                  alert("Password reset link sent to your email!");
                } catch (e: any) {
                  alert(e?.message || "Failed to send password reset email");
                }
              } else {
                alert("Please enter your email address first");
              }
            }}
          >
            <Text style={styles.forgotText}>Forgot your password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity onPress={handleLogin} style={styles.primaryButton} disabled={loginLoading}>
            <Text style={styles.primaryText}>Log In</Text>
          </TouchableOpacity>

          {/* Social */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin("Google")}>
            <Text style={styles.socialText}>Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin("Facebook")}>
            <Text style={styles.socialText}>Continue with Facebook</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ================== SIGNUP ==================
  if (currentScreen === "signup") {
    return (
      <SafeAreaView style={styles.screenContainer} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              onPress={() => setCurrentScreen("landing")} 
              style={styles.backButton}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              activeOpacity={0.7}
            >
              <ChevronLeft color="#fff" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sign Up</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setCurrentScreen("login")}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            activeOpacity={0.7}
            style={styles.headerLinkButton}
          >
            <Text style={styles.headerLink}>Log In</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.formContainer}>
          {/* Username */}
          <Text style={styles.label}>Username</Text>
          <View style={styles.inputWrapper}>
            <User size={20} color="#999" style={styles.iconLeft} />
            <TextInput
              style={styles.input}
              placeholder="Choose a username"
              value={formData.username}
              onChangeText={(v) => handleInputChange("username", v)}
            />
          </View>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#999" style={styles.iconLeft} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(v) => handleInputChange("email", v)}
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#999" style={styles.iconLeft} />
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(v) => handleInputChange("password", v)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconRight}>
              {showPassword ? <EyeOff size={20} color="#777" /> : <Eye size={20} color="#777" />}
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#999" style={styles.iconLeft} />
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              secureTextEntry={!showPassword}
              value={formData.confirmPassword}
              onChangeText={(v) => handleInputChange("confirmPassword", v)}
            />
          </View>

          <TouchableOpacity onPress={handleSignup} style={styles.primaryButton} disabled={signupLoading}>
            <Text style={styles.primaryText}>Sign Up</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  landingContainer: { flex: 1, flexDirection: "row" },
  landingLeft: { flex: 1, justifyContent: "center", alignItems: "center" },
  landingLeftOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "#a7f3d0", opacity: 0.2 },
  centerContent: { alignItems: "center", padding: 20 },
  emoji: { fontSize: 64, marginBottom: 10 },
  landingTitle: { fontSize: 28, fontWeight: "bold", color: "#222" },
  landingSubtitle: { color: "#666", textAlign: "center", fontSize: 16 },
  landingRight: { flex: 1, backgroundColor: "#16a34a", justifyContent: "center", alignItems: "center", gap: 16, padding: 24 },
  button: { width: "100%", padding: 16, borderRadius: 16, alignItems: "center" },
  buttonWhite: { backgroundColor: "#fff" },
  buttonGreen: { backgroundColor: "#15803d" },
  buttonText: { fontWeight: "600", fontSize: 16 },
  textWhite: { color: "#fff" },
  textGreen: { color: "#16a34a" },

  screenContainer: { flex: 1, backgroundColor: "#f9fafb" },
  header: { 
    backgroundColor: "#16a34a", 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
    minHeight: 60,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  backButton: { 
    marginRight: 8,
    padding: 12,
    minWidth: 48,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginLeft: 4 },
  headerLinkButton: {
    padding: 12,
    minWidth: 60,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  headerLink: { 
    color: "#fff", 
    textDecorationLine: "underline",
    fontSize: 16,
  },

  formContainer: { padding: 20, gap: 12 },
  label: { color: "#333", fontSize: 14, fontWeight: "500" },
  inputWrapper: { position: "relative", justifyContent: "center", marginBottom: 10 },
  input: { backgroundColor: "#fff", borderColor: "#ddd", borderWidth: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 40, fontSize: 16 },
  iconLeft: { position: "absolute", left: 12 },
  iconRight: { position: "absolute", right: 12 },
  forgotContainer: { alignItems: "flex-end" },
  forgotText: { color: "#16a34a", fontSize: 13 },
  primaryButton: { backgroundColor: "#16a34a", padding: 14, borderRadius: 12, alignItems: "center" },
  primaryText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  dividerContainer: { flexDirection: "row", alignItems: "center", marginVertical: 10, justifyContent: "center" },
  divider: { flex: 1, height: 1, backgroundColor: "#ccc" },
  dividerText: { marginHorizontal: 8, color: "#999" },
  socialButton: { borderColor: "#ddd", borderWidth: 1, padding: 12, borderRadius: 12, alignItems: "center", backgroundColor: "#fff" },
  socialText: { color: "#333", fontWeight: "500" },
});


