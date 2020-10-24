export const envIsProd = () => !['localhost', '127.0.0.1'].includes(window.location.hostname);
export const envIsDev = () => ['localhost', '127.0.0.1'].includes(window.location.hostname);
