export const clamp = (v:number, a=0, b=1) => Math.max(a, Math.min(b, v));
export const pct = (num:number, denom:number) => (denom === 0 ? 0 : Math.round((num/denom)*100));
export const nowISO = () => new Date().toISOString();