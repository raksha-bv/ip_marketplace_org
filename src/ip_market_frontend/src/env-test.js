// Test environment variables loading
console.log('=== Environment Variables Test ===');
console.log('VITE_CANISTER_ID_IP_MARKET_BACKEND:', import.meta.env.VITE_CANISTER_ID_IP_MARKET_BACKEND);
console.log('VITE_II_CANISTER_ID:', import.meta.env.VITE_II_CANISTER_ID);
console.log('VITE_DFX_NETWORK:', import.meta.env.VITE_DFX_NETWORK);
console.log('All VITE vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
console.log('==================================');

export default {};
