export interface LoginPageProps {
    onLogin: () => void;
    onRegister: () => void;
    onBackToHome: () => void;
}

export interface LoginLanguageOption {
    code: string;
    label: string;
    flag: string;
}
