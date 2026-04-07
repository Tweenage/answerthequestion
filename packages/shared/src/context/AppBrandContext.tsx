import { createContext, useContext, type ReactNode } from 'react';

export interface AppBrand {
  /** App display name, e.g. "AnswerTheQuestion!" or "Spelling Bees" */
  name: string;
  /** Short tagline shown under the name */
  tagline: string;
  /** Mascot React element (ProfessorHoot or BeeChar) */
  mascot: ReactNode;
  /** Primary gradient for buttons: "from-purple-600 to-fuchsia-600" or "from-amber-500 to-orange-500" */
  buttonGradient: string;
  /** Hover gradient for buttons */
  buttonGradientHover: string;
  /** Primary text colour class for headings: "text-purple-800" or "text-amber-800" */
  headingColor: string;
  /** Accent text colour for links: "text-purple-600" or "text-amber-600" */
  accentColor: string;
  /** Accent hover colour for links */
  accentHoverColor: string;
  /** Checkbox accent classes */
  checkboxColor: string;
  /** Focus ring classes */
  focusRing: string;
}

const DEFAULT_BRAND: AppBrand = {
  name: 'AnswerTheQuestion!',
  tagline: '11+ Exam Technique Trainer',
  mascot: null,
  buttonGradient: 'from-purple-600 to-fuchsia-600',
  buttonGradientHover: 'hover:from-purple-700 hover:to-fuchsia-700',
  headingColor: 'text-purple-800',
  accentColor: 'text-purple-600',
  accentHoverColor: 'hover:text-purple-800',
  checkboxColor: 'border-purple-300 text-purple-600 focus:ring-purple-400 accent-purple-600',
  focusRing: 'focus:ring-purple-300 focus:border-purple-300',
};

const AppBrandContext = createContext<AppBrand>(DEFAULT_BRAND);

export function AppBrandProvider({ brand, children }: { brand: AppBrand; children: ReactNode }) {
  return <AppBrandContext.Provider value={brand}>{children}</AppBrandContext.Provider>;
}

export function useAppBrand(): AppBrand {
  return useContext(AppBrandContext);
}
