/**
 * @function - Random Code Generator
 * @param {number} length - number of characters
 * @return {string}
 */
export function codeGenerator(length: number = 6, prefix: string): string {
    const characters = 'ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += characters[Math.floor(Math.random() * characters.length)];
    }
    return prefix + "_" + code;
};

/**
 * @function - Random Token Generator
 * @param {number} length - number of characters
 * @return {string}
 */
export function randomToken(length: number = 6): string {
    let token = '';
    for (let i = 0; i < length; i++) {
        token += Math.floor(Math.random() * 10);
    }
    return token;
};