// ─── Validate Name ─────────────────────────────────────────────────
export const validateName = (name) => {
  if (!name || name.trim() === '') {
    return 'Name is required.';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters.';
  }
  return null;
};

// ─── Validate Email ────────────────────────────────────────────────
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return 'Email is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address.';
  }
  return null;
};

// ─── Validate Password ─────────────────────────────────────────────
export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters.';
  }
  return null;
};

// ─── Validate Confirm Password ─────────────────────────────────────
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return null;
};