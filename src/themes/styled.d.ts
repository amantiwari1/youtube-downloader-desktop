export interface IContextProps {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

export interface ThemeProviderInterface {
  initialTheme?: any;
  children: React.ReactNode;
}
