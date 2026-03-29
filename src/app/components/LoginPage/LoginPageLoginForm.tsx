import { LoginPageLoginActions } from "./LoginPageLoginActions";
import { LoginPageLoginCredentials } from "./LoginPageLoginCredentials";

interface LoginPageLoginFormProps {
    accent: string;
    accentG: string;
    isRTL: boolean;
    t: (key: string) => string;
    email: string;
    setEmail: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
    focused: string | null;
    setFocused: (v: string | null) => void;
    apiError: string | null;
    setApiError: (v: string | null) => void;
    apiLoading: boolean;
    agreedToTerms: boolean;
    setAgreedToTerms: (v: boolean) => void;
    setTermsOpen: (v: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
    onRegister: () => void;
    onOpenForgot: () => void;
}

export function LoginPageLoginForm(props: LoginPageLoginFormProps) {
    const { onSubmit, ...rest } = props;
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <LoginPageLoginCredentials
                accent={rest.accent}
                accentG={rest.accentG}
                isRTL={rest.isRTL}
                t={rest.t}
                email={rest.email}
                setEmail={rest.setEmail}
                password={rest.password}
                setPassword={rest.setPassword}
                focused={rest.focused}
                setFocused={rest.setFocused}
                onOpenForgot={rest.onOpenForgot}
            />
            <LoginPageLoginActions
                accent={rest.accent}
                accentG={rest.accentG}
                isRTL={rest.isRTL}
                t={rest.t}
                apiError={rest.apiError}
                setApiError={rest.setApiError}
                apiLoading={rest.apiLoading}
                agreedToTerms={rest.agreedToTerms}
                setAgreedToTerms={rest.setAgreedToTerms}
                setTermsOpen={rest.setTermsOpen}
                onRegister={rest.onRegister}
            />
        </form>
    );
}
