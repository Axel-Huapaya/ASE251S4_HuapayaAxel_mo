/** Tipografía, espaciado y bordes compartidos por los componentes. */
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 } as const;

export const radius = { sm: 8, md: 10, lg: 14, xl: 20, sheet: 24 } as const;

export const fontSize = { xs: 11, sm: 12.5, md: 14, lg: 17, xl: 20, xxl: 26 } as const;

export const theme = { spacing, radius, fontSize } as const;
