import AuthLayout from "../components/AuthLayout";
import LoginForm from "../components/LoginForm";
/**
 * LoginPage — presentational.
 * props: values, onChange(field, value), onSubmit(values), submitting, error, onGoToSignup()
 */
export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
